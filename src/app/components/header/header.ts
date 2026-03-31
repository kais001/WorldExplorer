import { Component } from '@angular/core';
import { UpperCasePipe, LowerCasePipe, TitleCasePipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, UpperCasePipe, LowerCasePipe, TitleCasePipe],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class HeaderComponent {
  logo = '/logo.png';

  accueil = 'Home';
  europe = 'Europe';
  favorites = 'favorites';
  apropos = 'about';
}