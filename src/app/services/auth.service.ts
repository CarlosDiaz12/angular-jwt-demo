import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public isUserLoggedIn: BehaviorSubject<boolean>;
  public LoggedInUser: Observable<boolean>;
  constructor(
    private httpClient: HttpClient,
    private tokenStorage: TokenStorageService
  ) {
    const state = this.getUserToken() != null;
    this.isUserLoggedIn = new BehaviorSubject<boolean>(state);
    this.LoggedInUser = this.isUserLoggedIn.asObservable();
  }

  setUserState(isLoggedIn: boolean, token: string | null = null) {
    console.log('SETTING USER STATE');
    if (token) {
      this.tokenStorage.saveToken(token);
    }
    this.isUserLoggedIn.next(isLoggedIn);
  }

  getTokenLogin(username: string, password: string): Observable<any> {
    return this.httpClient.post(environment.baseUrl + '/auth/token', {
      username,
      password,
    });
  }

  logOut(): void {
    this.isUserLoggedIn.next(false);
    this.tokenStorage.clearToken();
  }

  getUserToken(): string | null {
    return this.tokenStorage.getToken();
  }

  public get LoggedInUserValue() {
    return this.isUserLoggedIn.value;
  }
}
