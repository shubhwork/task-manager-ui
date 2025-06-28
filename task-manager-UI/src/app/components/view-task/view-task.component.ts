import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- Add this
import { FormsModule } from '@angular/forms'; // Import FormsModule for form handling
import { TaskService } from '../../services/task.service'; // Import the TaskService

@Component({
  selector: 'app-view-task',
  standalone: true, // Mark as a standalone component
  templateUrl: './view-task.component.html', // Template file
  styleUrls: ['./view-task.component.css'], // Styles file
  imports: [CommonModule, FormsModule], // Add CommonModule and FormsModule to imports
})
export class ViewTaskComponent implements OnInit {
  tasks: any[] = []; // Property to hold tasks
  errorMessage: string | null = null; // Property to hold error messages

  constructor(private taskService: TaskService) {} // Inject the TaskService

  ngOnInit(): void {
    this.fetchTasks(); // Fetch tasks when the component initializes
  }

  fetchTasks(): void {
    this.taskService.getTasks().subscribe(
      (response) => {
        console.log('Tasks fetched successfully:', response);
        this.tasks = response; // Assign the fetched tasks to the tasks array
      },
      (error) => {
        console.error('Error fetching tasks:', error);
        this.errorMessage = 'Failed to fetch tasks. Please try again later.';
      }
    );
  }
}