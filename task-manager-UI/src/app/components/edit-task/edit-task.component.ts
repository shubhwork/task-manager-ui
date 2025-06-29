import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css'],
})
export class EditTaskComponent implements OnChanges {
  @Input() task: any;
  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  title: string = '';
  description: string = '';
  status: string = 'IN_PROGRESS';
  categoryId: number = 1;
  categoryName: string = '';
  dueDate: string = '';
  priority: string = 'MEDIUM';
  tags: string = ''; // Store as comma-separated string or use an array for advanced usage

  ngOnChanges(changes: SimpleChanges) {
    if (changes['task'] && this.task) {
      this.title = this.task.title || '';
      this.description = this.task.description || '';
      this.status = this.task.status || 'IN_PROGRESS';
      this.categoryId = this.task.category?.id || 1;
      this.categoryName = this.task.category?.name || '';
      this.dueDate = this.task.dueDate ? this.task.dueDate.slice(0, 10) : '';
      this.priority = this.task.priority || 'MEDIUM';
      this.tags = this.task.tags || ''; // Initialize tags
    }
  }

  onSave() {
    const newTask = {
      ...this.task,
      title: this.title,
      description: this.description,
      status: this.status,
      category: {
        id: this.categoryId,
        name: this.categoryName
      },
      dueDate: this.dueDate,
      priority: this.priority, // <-- Add this line!
      tags: this.tags.split(',').map(tag => tag.trim()).filter(tag => tag) // Convert to array
    };
    this.save.emit(newTask);
  }
}