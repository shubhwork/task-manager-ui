import { Routes } from '@angular/router';
import { TaskListComponent } from './components/task-list/task-list.component';
import { AddTaskComponent } from './components/add-task/add-task.component';
import { ViewTaskComponent } from './components/view-task/view-task.component'; // Import ViewTaskComponent


export const routes: Routes = [
  { path: '', component: TaskListComponent }, 
  {path: '', redirectTo: '/view-task', pathMatch: 'full' },// Default route
  { path: '', redirectTo: '/add-task', pathMatch: 'full' }, // Optional: Default route
  { path: 'add-task', component: AddTaskComponent }, // Route for adding a task
];