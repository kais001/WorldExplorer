import { Component, OnInit } from '@angular/core';
import { Country } from '../../models/country.model';
import { CountryCardComponent } from '../../components/country-card/country-card';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CountryCardComponent],
  templateUrl: './favorites.html',
})
export class FavoritesComponent implements OnInit {
  favorites: Country[] = [];

  ngOnInit(): void {
    const data = localStorage.getItem('favorites');
    this.favorites = data ? JSON.parse(data) : [];
  }
}