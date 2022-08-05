import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import {
  lastValueFrom,
  Observable,
  take,
  switchMap,
  map,
  catchError,
  BehaviorSubject,
  throwError,
  filter,
} from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private refreshTokenInProgress = false;
  // Refresh Token Subject tracks the current token, or is null if no token is currently
  // available (e.g. refresh pending).
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  constructor(private auth: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const isLoggedIn = this.auth.LoggedInUserValue;
    if (isLoggedIn) {
      const token = this.auth.getUserToken();
      request = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`),
      });
    }
    return next.handle(request).pipe(
      catchError((error) => {
        // We don't want to refresh token for some requests like login or refresh token itself
        // So we verify url and we throw an error if it's the case
        if (
          request.url.includes('refresh-token') ||
          request.url.includes('login')
        ) {
          // We do another check to see if refresh token failed
          // In this case we want to logout user and to redirect it to login page

          if (request.url.includes('refresh-token')) {
            this.auth.logOut();
          }

          return throwError(() => error);
        }

        // If error status is different than 401 we want to skip refresh token
        // So we check that and throw the error if it's the case
        if (error.status !== 401) {
          return throwError(() => error);
        }
        if (this.refreshTokenInProgress) {
          // If refreshTokenInProgress is true, we will wait until refreshTokenSubject has a non-null value
          // – which means the new token is ready and we can retry the request again
          return this.refreshTokenSubject.pipe(
            filter((result) => result !== null),
            take(1),
            switchMap(() => next.handle(this.addAuthenticationToken(request)))
          );
        } else {
          this.refreshTokenInProgress = true;

          // Set the refreshTokenSubject to null so that subsequent API calls will wait until the new token has been retrieved
          this.refreshTokenSubject.next(null);

          // Call auth.refreshAccessToken(this is an Observable that will be returned)
          const refreshToken = this.auth.getUserRefreshToken();
          return this.auth.refreshAccessToken(refreshToken).pipe(
            switchMap((data: any) => {
              //When the call to refreshToken completes we reset the refreshTokenInProgress to false
              // for the next time the token needs to be refreshed
              this.refreshTokenInProgress = false;
              this.refreshTokenSubject.next(data.token);
              this.auth.setUserState(true, data.token, data.refreshToken);
              return next.handle(this.addAuthenticationToken(request));
            }),
            catchError((error) => {
              this.refreshTokenInProgress = false;

              this.auth.logOut();
              return throwError(() => error);
            })
          );
        }
      })
    );
  }
  addAuthenticationToken(request: any) {
    // Get access token from Local Storage
    const accessToken = this.auth.getUserToken();

    // If access token is null this means that user is not logged in
    // And we return the original request
    if (!accessToken) {
      return request;
    }

    // We clone the request, because the original request is immutable
    return request.clone({
      setHeaders: {
        Authorization: 'Bearer ' + this.auth.getUserToken(),
      },
    });
  }
}
