import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // <-- Add this import
import { AddTaskComponent } from '../add-task/add-task.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, AddTaskComponent], // <-- Add CommonModule here
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  sidebarOpen = false;
  showAddTask = false;

  constructor(private router: Router) {}
  navigateToHome(): void {
    this.router.navigate(['/']);
  }
  navigateToAddTask(): void {
    this.router.navigate(['/add-task']);
  }
  navigateToViewTask(): void {
    this.router.navigate(['/view-task']);
  }
  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
  openAddTask() {
    console.log('Add Task clicked');
    this.showAddTask = true;
  }
}