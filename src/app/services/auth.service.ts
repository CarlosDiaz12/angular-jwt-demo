import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isUserLoggedIn: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(
    false
  );
  constructor(
    private httpClient: HttpClient,
    private tokenStorage: TokenStorageService
  ) {}

  getTokenLogin(username: string, password: string): Observable<any> {
    return this.httpClient
      .post(environment.baseUrl + '/auth/token', {
        username,
        password,
      })
      .pipe(
        switchMap((value: any) => {
          this.isUserLoggedIn.next(true);
          this.tokenStorage.saveToken(value.token);
          return of({ expirationDate: value.expiration });
        })
      );
  }

  logOut(): void {
    this.isUserLoggedIn.next(false);
    this.tokenStorage.clearToken();
  }

  getUserToken(): string | null {
    return this.tokenStorage.getToken();
  }
}
