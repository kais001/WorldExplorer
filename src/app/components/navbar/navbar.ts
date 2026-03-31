import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent {
  letters: string[] = [];
  regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  constructor() {
    for (let i = 65; i <= 90; i++) {
      this.letters.push(String.fromCharCode(i));
    }
  }
}