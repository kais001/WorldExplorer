import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  catchError,
  map,
  of,
  shareReplay,
  startWith,
  switchMap,
} from 'rxjs';
import { CountryCardComponent } from '../../components/country-card/country-card';
import { Country } from '../../models/country.model';
import { CountryService } from '../../services/country';
import { FavoriteService } from '../../services/favorite';

@Component({
  selector: 'app-favorites-page',
  standalone: true,
  imports: [AsyncPipe, CountryCardComponent],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class FavoritesComponent {
  private countryService = inject(CountryService);
  private favoriteService = inject(FavoriteService);

  viewState$ = this.favoriteService.favorites$.pipe(
    switchMap((favoriteCodes) => {
      if (!favoriteCodes.length) {
        return of({
          favoriteCountries: [] as Country[],
          loading: false,
          errorMessage: '',
        });
      }

      return this.countryService.getCountriesByCodes(favoriteCodes).pipe(
        map((favoriteCountries) => ({
          favoriteCountries,
          loading: false,
          errorMessage: '',
        })),
        startWith({
          favoriteCountries: [] as Country[],
          loading: true,
          errorMessage: '',
        }),
        catchError(() =>
          of({
            favoriteCountries: [] as Country[],
            loading: false,
            errorMessage: 'Unable to load favorite countries.',
          })
        )
      );
    }),
    shareReplay(1)
  );
}
