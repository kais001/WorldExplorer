import { Component, Input, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Country } from '../../models/country.model';
import { FavoriteService } from '../../services/favorite';

@Component({
  selector: 'app-country-card',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './country-card.html',
  styleUrl: './country-card.css',
})
export class CountryCardComponent {
  @Input({ required: true }) country!: Country;

  favoriteService = inject(FavoriteService);

  get capital(): string {
    return this.country.capital?.join(', ') || 'N/A';
  }

  isFavorite(): boolean {
    return this.favoriteService.isFavorite(this.country.cca3);
  }

  toggleFavorite(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.favoriteService.toggleFavorite(this.country);
  }
}