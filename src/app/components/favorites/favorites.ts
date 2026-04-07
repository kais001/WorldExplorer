import { AsyncPipe } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { Country } from '../../models/country.model';
import { CountryCardComponent } from '../country-card/country-card';
import { FavoriteService } from '../../services/favorite';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [AsyncPipe, CountryCardComponent],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class FavoritesComponent {
  private countriesSubject = new BehaviorSubject<Country[]>([]);
  favoriteService = inject(FavoriteService);

  @Input() set countries(value: Country[]) {
    this.countriesSubject.next(value);
  }

  favoriteCount$ = this.favoriteService.favorites$.pipe(
    map((favorites) => favorites.length)
  );

  favoriteCountries$ = combineLatest([
    this.countriesSubject,
    this.favoriteService.favorites$,
  ]).pipe(
    map(([countries, favorites]) =>
      countries.filter((country) => favorites.includes(country.cca3))
    )
  );
}
