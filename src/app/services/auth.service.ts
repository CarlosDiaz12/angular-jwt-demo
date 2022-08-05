import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, switchMap, take } from 'rxjs';
import { environment } from '../../environments/environment';
import { TokenStorageService } from './token-storage.service';
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isUserLoggedIn: BehaviorSubject<boolean>;
  public LoggedInUser: Observable<boolean>;
  private jwthelper: JwtHelperService;
  constructor(
    private httpClient: HttpClient,
    private tokenStorage: TokenStorageService
  ) {
    this.jwthelper = new JwtHelperService();
    const state = this.getUserToken() != null;
    this.isUserLoggedIn = new BehaviorSubject<boolean>(state);
    this.LoggedInUser = this.isUserLoggedIn.asObservable().pipe(
      take(1),
      map((_) => {
        const token = this.getUserToken();
        let result = false;
        if (token) {
          result = !this.jwthelper.isTokenExpired(token);
          this.isUserLoggedIn.next(result);
        } else {
          this.logOut();
        }
        return result;
      })
    );
  }

  setUserState(
    isLoggedIn: boolean,
    token: string | null = null,
    refreshToken: string | null = null
  ) {
    if (token && refreshToken) {
      this.tokenStorage.saveToken(token);
      this.tokenStorage.saveRefreshToken(refreshToken);
    }
    this.isUserLoggedIn.next(isLoggedIn);
  }

  refreshAccessToken(refreshToken: string | null): Observable<any> {
    return this.httpClient.post(
      environment.baseUrl + '/auth/refresh-token',
      {
        refreshToken,
      },
      {
        headers: { Authorization: 'Bearer ' + this.getUserToken() },
      }
    );
  }
  getTokenLogin(username: string, password: string): Observable<any> {
    this.logOut();
    return this.httpClient.post(environment.baseUrl + '/auth/token', {
      username,
      password,
    });
  }

  logOut(): void {
    this.isUserLoggedIn.next(false);
    this.tokenStorage.clearToken();
    this.tokenStorage.clearRefreshToken();
  }

  getUserToken(): string | null {
    return this.tokenStorage.getToken();
  }

  getUserRefreshToken(): string | null {
    return this.tokenStorage.getRefreshToken();
  }

  public get LoggedInUserValue() {
    return this.isUserLoggedIn.value;
  }
}
