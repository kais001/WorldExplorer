import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map } from 'rxjs';
import { Country } from '../models/country.model';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private http = inject(HttpClient);
  private baseUrl = 'https://restcountries.com/v3.1';

  getAllCountries(): Observable<Country[]> {
    return this.http
      .get<Country[]>(
        `${this.baseUrl}/all?fields=name,capital,region,population,flags,cca3`
      )
      .pipe(
        map((countries) =>
          countries.sort((a, b) => a.name.common.localeCompare(b.name.common))
        )
      );
  }

  searchByName(name: string): Observable<Country[]> {
    return this.http
      .get<Country[]>(
        `${this.baseUrl}/name/${encodeURIComponent(name)}?fields=name,capital,region,population,flags,cca3,cca2,languages,currencies,borders,subregion,maps`
      )
      .pipe(
        map((countries) =>
          countries.sort((a, b) => a.name.common.localeCompare(b.name.common))
        )
      );
  }

  getCountryByCode(code: string): Observable<Country[]> {
    return this.http.get<Country[]>(
      `${this.baseUrl}/alpha/${encodeURIComponent(code)}?fields=name,capital,region,population,flags,cca3,cca2,languages,currencies,borders,subregion,maps`
    );
  }

  getCountriesByCodes(codes: string[]): Observable<Country[]> {
    if (!codes.length) {
      return of([]);
    }

    return this.http
      .get<Country[]>(
        `${this.baseUrl}/alpha?codes=${codes.join(',')}&fields=name,capital,region,population,flags,cca3`
      )
      .pipe(
        map((countries) =>
          countries.sort((a, b) => a.name.common.localeCompare(b.name.common))
        )
      );
  }
}