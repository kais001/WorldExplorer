import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar';

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet],
  templateUrl: './body.html',
  styleUrl: './body.css',
})
export class BodyComponent {}