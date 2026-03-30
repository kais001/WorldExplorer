import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Country } from '../../models/country.model';

@Component({
  selector: 'app-border-country',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './border-country.html',
  styleUrl: './border-country.css',
})
export class BorderCountryComponent {
  @Input({ required: true }) country!: Country;
}