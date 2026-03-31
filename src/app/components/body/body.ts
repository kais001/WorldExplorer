import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
<<<<<<< HEAD
=======
import { NavbarComponent } from '../navbar/navbar';
>>>>>>> ff8d71179331582fc357fb9ab0ff737021841a12

@Component({
  selector: 'app-body',
  standalone: true,
<<<<<<< HEAD
  imports: [RouterOutlet],
=======
  imports: [NavbarComponent, RouterOutlet],
>>>>>>> ff8d71179331582fc357fb9ab0ff737021841a12
  templateUrl: './body.html',
  styleUrl: './body.css',
})
export class BodyComponent {}