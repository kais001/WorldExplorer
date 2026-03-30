import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Country } from '../models/country.model';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private storageKey = 'world-explorer-favorites';
  private favoritesSubject = new BehaviorSubject<string[]>(this.loadFavorites());
  favorites$ = this.favoritesSubject.asObservable();

  private loadFavorites(): string[] {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) : [];
  }

  private saveFavorites(codes: string[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(codes));
    this.favoritesSubject.next(codes);
  }

  getFavorites(): string[] {
    return this.favoritesSubject.value;
  }

  isFavorite(countryCode: string): boolean {
    return this.getFavorites().includes(countryCode);
  }

  toggleFavorite(country: Country): void {
    const current = this.getFavorites();
    const exists = current.includes(country.cca3);

    if (exists) {
      this.saveFavorites(current.filter((code) => code !== country.cca3));
    } else {
      this.saveFavorites([...current, country.cca3]);
    }
  }
}