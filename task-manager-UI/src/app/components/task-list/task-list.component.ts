import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- Add this import
import { TaskService } from '../../services/task.service';
import { TaskItemComponent } from '../task-item/task-item.component'; // Import TaskItemComponent if used
import { EditTaskComponent } from '../edit-task/edit-task.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskItemComponent, EditTaskComponent], // <-- Add FormsModule here
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: any[] = []; // Initialize tasks as an empty array
  editingTask: any = null; // Initialize editingTask as null
  searchTerm: string = '';
  showConfirmDialog = false;
  taskIdToDelete: number | null = null;

  constructor(private taskService: TaskService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    // Fetch tasks from the service
    this.taskService.getTasks().subscribe(
      (data) => {
        this.tasks = data; // Assign the fetched data to tasks
      },
      (error) => {
        console.error('Error fetching tasks:', error); // Log any errors
      }
    );
  }

  openEditTask(task: any) {
    console.log('Edit clicked:', task);
    this.editingTask = { ...task };
  }

  onDeleteTask(taskId: number): void {
    this.taskIdToDelete = taskId;
    this.showConfirmDialog = true;
  }

  confirmDelete(): void {
    if (this.taskIdToDelete !== null) {
      this.taskService.deleteTask(this.taskIdToDelete.toString()).subscribe(
        () => {
          this.tasks = this.tasks.filter(task => task.id !== this.taskIdToDelete);
          this.snackBar.open('Task deleted successfully!', 'Close', { duration: 3000 });
          this.showConfirmDialog = false;
          this.taskIdToDelete = null;
        },
        (error) => {
          console.error('Error deleting task:', error);
          this.snackBar.open('Failed to delete task.', 'Close', { duration: 3000 });
          this.showConfirmDialog = false;
          this.taskIdToDelete = null;
        }
      );
    }
  }

  cancelDelete(): void {
    this.showConfirmDialog = false;
    this.taskIdToDelete = null;
  }

  onSaveEdit(updatedTask: any) {
    console.log('Saving edited task:', updatedTask);
    this.taskService.updateTask(updatedTask.id, updatedTask).subscribe(
      (response) => {
        // Update the task in your tasks array
        const idx = this.tasks.findIndex(t => t.id === updatedTask.id);
        if (idx > -1) this.tasks[idx] = response;
        this.editingTask = null;
      },
      (error) => {
        console.error('Error updating task:', error);
      }
    );
  }

  onToggleComplete(updatedTask: any) {
    this.taskService.updateTask(updatedTask.id, updatedTask).subscribe(
      (response) => {
        const idx = this.tasks.findIndex(t => t.id === updatedTask.id);
        if (idx > -1) this.tasks[idx] = response;
      },
      (error) => {
        console.error('Error updating task status:', error);
      }
    );
  }

  get completedCount(): number {
    return this.tasks.filter(task => task.status === 'COMPLETED').length;
  }

  get incompleteCount(): number {
    return this.tasks.filter(task => task.status !== 'COMPLETED').length;
  }

  // Example: tasks due today (if you have a dueDate property)
  get dueTodayCount(): number {
    const today = new Date().toISOString().slice(0, 10);
    return this.tasks.filter(task => task.dueDate && task.dueDate.slice(0, 10) === today).length;
  }

  get filteredTasks() {
    if (!this.searchTerm?.trim()) return this.tasks;
    const term = this.searchTerm.trim().toLowerCase();
    const filtered = this.tasks.filter(task =>
      (task.title && task.title.toLowerCase().includes(term)) ||
      (task.description && task.description.toLowerCase().includes(term)) ||
      (task.status && task.status.toLowerCase().includes(term))
    );
    console.log('Filtered tasks:', filtered);
    return filtered;
  }
}