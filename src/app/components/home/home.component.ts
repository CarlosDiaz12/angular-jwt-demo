import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { BudgetCategoryService } from '../../services/budget-category.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private router: Router,
    private budgetService: BudgetCategoryService
  ) {}

  ngOnInit(): void {
    this.budgetService.getAll().subscribe((data) => {
      console.log(data);
    });
  }

  logOut(): void {
    this.auth.logOut();
    this.router.navigateByUrl('login', { replaceUrl: true });
  }
}
