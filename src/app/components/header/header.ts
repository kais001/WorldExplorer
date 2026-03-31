import { Component } from '@angular/core';
<<<<<<< HEAD
=======
import { UpperCasePipe, LowerCasePipe, TitleCasePipe } from '@angular/common';
>>>>>>> ff8d71179331582fc357fb9ab0ff737021841a12
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
<<<<<<< HEAD
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class HeaderComponent {}
=======
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
>>>>>>> ff8d71179331582fc357fb9ab0ff737021841a12
