import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'jwt-auth-demo';
  userState$: Observable<Boolean>;
  constructor(private auth: AuthService) {
    this.userState$ = auth.isUserLoggedIn;
  }
}
