import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css'],
})
export class EditTaskComponent {
  @Input() task: any;
  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  dueDate: string = '';

  onSave() {
    const newTask = {
      title: this.task.title,
      description: this.task.description,
      status: this.task.status,
      category: {
        id: this.task.categoryId,
        name: this.task.categoryName,
      },
      dueDate: this.dueDate,
    };

    this.save.emit(newTask);
  }
}