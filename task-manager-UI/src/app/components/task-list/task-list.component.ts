import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- Add this import
import { TaskService } from '../../services/task.service';
import { TaskItemComponent } from '../task-item/task-item.component'; // Import TaskItemComponent if used
import { EditTaskComponent } from '../edit-task/edit-task.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddTaskComponent } from '../add-task/add-task.component'; // <-- Add this import
import { HeaderComponent } from '../header/header.component'; // <-- Add this import

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TaskItemComponent,
    EditTaskComponent,
    AddTaskComponent,
    HeaderComponent // <-- Add this here
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: any[] = []; // Initialize tasks as an empty array
  editingTask: any = null; // Initialize editingTask as null
  searchTerm: string = '';
  showConfirmDialog = false;
  taskIdToDelete: number | null = null;
  selectedPriority: string = '';
  selectedDueDate: string = '';
  showAddTask = false;
  page: number = 1;
  pageSize: number = 5;

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
    let filtered = this.tasks;

    // Search filter
    if (this.searchTerm?.trim()) {
      const term = this.searchTerm.trim().toLowerCase();
      filtered = filtered.filter(task =>
        (task.title && task.title.toLowerCase().includes(term)) ||
        (task.description && task.description.toLowerCase().includes(term)) ||
        (task.status && task.status.toLowerCase().includes(term))
      );
    }



    // Priority filter
    if (this.selectedPriority) {
      filtered = filtered.filter(task => task.priority === this.selectedPriority);
    }

    // Due date filter
    if (this.selectedDueDate) {
      filtered = filtered.filter(task =>
        task.dueDate && task.dueDate.slice(0, 10) === this.selectedDueDate
      );
    }

    return filtered;
  }

  get uniqueTags(): string[] {
    const tags = this.tasks.flatMap(task => Array.isArray(task.tags) ? task.tags : []);
    return tags.filter((tag, i, arr) => tag && arr.indexOf(tag) === i);
  }

  get uniqueCategories(): string[] {
    const categories = this.tasks.map(t => t.category?.name).filter(Boolean);
    return categories.filter((cat, i, arr) => arr.indexOf(cat) === i);
  }

  onTaskAdded(newTask: any) {
    console.log('New task added:', newTask);
    this.tasks = [newTask, ...this.tasks];
    this.searchTerm = '';
  }

  get paginatedTasks() {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredTasks.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredTasks.length / this.pageSize);
  }

  goToPage(pageNum: number) {
    if (pageNum >= 1 && pageNum <= this.totalPages) {
      this.page = pageNum;
    }
  }
}