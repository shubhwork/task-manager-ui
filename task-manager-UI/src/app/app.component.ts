import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component'; // Import HeaderComponent
import { RouterOutlet } from '@angular/router'; // Import RouterOutlet for routing

@Component({
  selector: 'app-root',
  standalone: true, // Mark as standalone component
  imports: [ RouterOutlet], // Add HeaderComponent and RouterOutlet here
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {}