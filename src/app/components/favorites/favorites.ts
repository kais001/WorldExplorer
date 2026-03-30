import { Component, Input, inject } from '@angular/core';
import { Country } from '../../models/country.model';
import { CountryCardComponent } from '../country-card/country-card';
import { FavoriteService } from '../../services/favorite';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CountryCardComponent],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class FavoritesComponent {
  @Input() countries: Country[] = [];

  favoriteService = inject(FavoriteService);

  get favoriteCountries(): Country[] {
    const favorites = this.favoriteService.getFavorites();
    return this.countries.filter((country) => favorites.includes(country.cca3));
  }
}