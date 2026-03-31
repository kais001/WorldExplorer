import { Component, OnInit, inject } from '@angular/core';
import { Country } from '../../models/country.model';
import { CountryService } from '../../services/country';
import { FavoriteService } from '../../services/favorite';
import { CountryCardComponent } from '../../components/country-card/country-card';

@Component({
  selector: 'app-favorites-page',
  standalone: true,
  imports: [CountryCardComponent],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class FavoritesComponent implements OnInit {
  private countryService = inject(CountryService);
  private favoriteService = inject(FavoriteService);

  favoriteCountries: Country[] = [];
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadFavoriteCountries();
  }

  loadFavoriteCountries(): void {
    const favoriteCodes = this.favoriteService.getFavorites();

    if (!favoriteCodes.length) {
      this.favoriteCountries = [];
      this.loading = false;
      return;
    }

    this.countryService.getAllCountries().subscribe({
      next: (countries) => {
        this.favoriteCountries = countries.filter((country) =>
          favoriteCodes.includes(country.cca3)
        );
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load favorite countries.';
        this.loading = false;
      },
    });
  }
}