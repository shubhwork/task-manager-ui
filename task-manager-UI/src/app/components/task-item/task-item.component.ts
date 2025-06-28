import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css']
})
export class TaskItemComponent {
  @Input() task: any;
  @Output() deleteTask = new EventEmitter<number>();
  @Output() editTask = new EventEmitter<any>();
  @Output() toggleComplete = new EventEmitter<any>();

  onDelete(): void {
    this.deleteTask.emit(this.task.id);
  }

  onEdit(): void {
    this.editTask.emit(this.task);
  }

  toggleCompleted(): void {
    const updatedTask = { ...this.task, status: this.task.status === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED' };
    this.toggleComplete.emit(updatedTask);
  }

  isOverdue(): boolean {
    if (!this.task.dueDate || this.task.status === 'COMPLETED') return false;
    const today = new Date().setHours(0,0,0,0);
    const due = new Date(this.task.dueDate).setHours(0,0,0,0);
    return due < today;
  }
}