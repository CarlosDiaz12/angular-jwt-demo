import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BudgetCategoryService {
  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<any> {
    return this.httpClient.get('/budgetCategory');
  }
}
