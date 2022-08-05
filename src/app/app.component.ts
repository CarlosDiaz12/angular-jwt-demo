import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  userState$: Observable<boolean>;
  constructor(private auth: AuthService) {
    this.userState$ = this.auth.LoggedInUser;
  }
}
