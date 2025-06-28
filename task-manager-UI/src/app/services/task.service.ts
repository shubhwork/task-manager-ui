import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:8080/api/v1/tasks'; // Replace with your backend URL

  constructor(private http: HttpClient) {}

  getTasks(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  addTask(task: any): Observable<any> {
    return this.http.post(this.apiUrl, task);
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateTask(id: string, task: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, task);
  }
}