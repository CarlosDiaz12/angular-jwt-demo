import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { lastValueFrom, Observable, take, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const isLoggedIn = this.auth.LoggedInUserValue;
    console.log('EXECUTING INTERCEPTOR');
    if (isLoggedIn) {
      const token = this.auth.getUserToken();
      const clonedRequest = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`),
      });
      return next.handle(clonedRequest);
    }
    return next.handle(request);
  }
}
