import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  readonly TOKEN_KEY: string = 'id_token';
  readonly REFRESH_TOKEN_KEY: string = 'refresh_token';
  constructor() {}

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  saveRefreshToken(refreshToken: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  clearRefreshToken(): void {
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }
}
