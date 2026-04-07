import { DecimalPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, map, of, switchMap } from 'rxjs';
import { BorderCountryComponent } from '../../components/border-country/border-country';
import { RxjsPlaygroundComponent } from '../../components/rxjs-playground/rxjs-playground';
import { Country } from '../../models/country.model';
import { CountryService } from '../../services/country';

@Component({
  selector: 'app-country-detail',
  standalone: true,
  imports: [
    DecimalPipe,
    RouterLink,
    BorderCountryComponent,
    RxjsPlaygroundComponent,
  ],
  templateUrl: './country-detail.html',
  styleUrl: './country-detail.css',
})
export class CountryDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private countryService = inject(CountryService);

  country?: Country;
  borderCountries: Country[] = [];
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((params) => params.get('code') || ''),
        switchMap((code) => {
          this.loading = true;
          this.errorMessage = '';
          this.borderCountries = [];

          return this.countryService.getCountryByCode(code).pipe(
            switchMap((country) => {
              if (!country) {
                return of({
                  country: undefined,
                  borderCountries: [] as Country[],
                  errorMessage: 'Country not found.',
                });
              }

              const borders$ = country.borders?.length
                ? this.countryService.getCountriesByCodes(country.borders)
                : of([] as Country[]);

              return borders$.pipe(
                map((borderCountries) => ({
                  country,
                  borderCountries,
                  errorMessage: '',
                })),
                catchError((err) => {
                  console.error('BORDER ERROR:', err);
                  return of({
                    country,
                    borderCountries: [] as Country[],
                    errorMessage: '',
                  });
                })
              );
            })
          );
        })
      )
      .subscribe({
        next: ({ country, borderCountries, errorMessage }) => {
          this.country = country;
          this.borderCountries = borderCountries;
          this.errorMessage = errorMessage;
          this.loading = false;
        },
        error: (err) => {
          console.error('DETAIL ERROR:', err);
          this.country = undefined;
          this.borderCountries = [];
          this.errorMessage = 'Unable to load country details.';
          this.loading = false;
        },
      });
  }

  get capital(): string {
    return this.country?.capital?.join(', ') || 'N/A';
  }

  get languages(): string {
    return this.country?.languages
      ? Object.values(this.country.languages).join(', ')
      : 'N/A';
  }

  get currencies(): string {
    if (!this.country?.currencies) {
      return 'N/A';
    }

    return Object.values(this.country.currencies)
      .map(
        (currency) =>
          `${currency.name}${currency.symbol ? ` (${currency.symbol})` : ''}`
      )
      .join(', ');
  }
}
