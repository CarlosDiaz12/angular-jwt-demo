import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {}

  login(): void {
    this.auth.getTokenLogin('karlus', '123456').subscribe({
      next: (data) => {
        console.log(data);
        this.auth.setUserState(true, data.token, data.refreshToken);
        this.router.navigateByUrl('', { replaceUrl: true });
      },
      error: (error) => console.log(error),
    });
  }
}
