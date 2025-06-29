import { Component, Output, EventEmitter } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // Import MatSnackBar


@Component({
  selector: 'app-add-task',
  standalone: true, // Mark as standalone component
  imports: [FormsModule, MatSnackBarModule], // Add MatSnackBarModule here
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css'],
})
export class AddTaskComponent {
  title: string = ''; // Task title
  description: string = ''; // Task description
  status: string = 'IN_PROGRESS'; // Default status
  categoryId: number = 1; // Default category ID
  categoryName: string = 'Rahul'; // Default category name
  dueDate: string = ''; // Due date
  priority: string = 'MEDIUM'; // Default value

  @Output() closeEvent = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();
  @Output() taskAdded = new EventEmitter<any>();

  constructor(private taskService: TaskService, private snackBar: MatSnackBar) {} // Inject MatSnackBar

  onAddTask(): void {
    console.log('Add Task button clicked!'); // Debug log

    if (this.title.trim() && this.description.trim()) {
      // Create the request body
      const newTask = {
        title: this.title,
        description: this.description,
        status: this.status,
        category: {
          id: this.categoryId,
          name: this.categoryName
        },
        dueDate: this.dueDate, 
        priority: this.priority 
      };

      console.log('Task to be added:', newTask); // Debug log

      // Call the service to send the request
      this.taskService.addTask(newTask).subscribe(
        (response) => {
          this.taskAdded.emit(response); // Emit the new task
          this.closeEvent.emit(); // <-- Add this line to close the modal
          console.log('Task added successfully:', response); // Debug log
          this.snackBar.open('Task added successfully!', 'Close', {
            duration: 3000, // Duration in milliseconds
          });
          this.title = ''; // Clear the input fields
          this.description = '';
        },
        (error) => {
          console.error('Error adding task:', error); // Debug log
          this.snackBar.open('Failed to add task. Please try again.', 'Close', {
            duration: 3000,
          });
        }
      );
    } else {
      console.warn('Title or description is empty!'); // Debug log
      this.snackBar.open('Please fill in all required fields.', 'Close', {
        duration: 3000,
      });
    }
  }

  onSave() {
    // ...validate fields...
    this.save.emit({
      title: this.title,
      description: this.description,
      status: this.status,
      category: {
        id: this.categoryId,
        name: this.categoryName
      }
    });
  }

  close() {
    this.closeEvent.emit();
  }

  
}