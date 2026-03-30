import { Component, OnInit, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { Country } from '../../models/country.model';
import { CountryService } from '../../services/country';
import { BorderCountryComponent } from '../../components/border-country/border-country';

@Component({
  selector: 'app-country-detail',
  standalone: true,
  imports: [DecimalPipe, RouterLink, BorderCountryComponent],
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
        switchMap((params) => {
          const code = params.get('code') || '';
          console.log('DETAIL CODE:', code);
          return this.countryService.getCountryByCode(code);
        })
      )
      .subscribe({
        next: (data) => {
          console.log('DETAIL DATA:', data);

          this.country = Array.isArray(data) ? data[0] : (data as unknown as Country);
          this.loading = false;

          if (!this.country) {
            this.errorMessage = 'Country not found.';
            return;
          }

          this.loadBorderCountries();
        },
        error: (err) => {
          console.error('DETAIL ERROR:', err);
          this.errorMessage = 'Unable to load country details.';
          this.loading = false;
        },
      });
  }

  loadBorderCountries(): void {
    if (!this.country?.borders?.length) {
      this.borderCountries = [];
      return;
    }

    this.countryService.getCountriesByCodes(this.country.borders).subscribe({
      next: (data) => {
        console.log('BORDER DATA:', data);
        this.borderCountries = data;
      },
      error: (err) => {
        console.error('BORDER ERROR:', err);
        this.borderCountries = [];
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