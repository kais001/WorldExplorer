import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header';
import { BodyComponent } from './components/body/body';
import { FooterComponent } from './components/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, BodyComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}