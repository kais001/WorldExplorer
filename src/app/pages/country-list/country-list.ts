import { Component, OnInit, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CountryService } from '../../services/country';
import { Country } from '../../models/country.model';
import { CountryCardComponent } from '../../components/country-card/country-card';
import { FilterBarComponent } from '../../components/filter-bar/filter-bar';
import { FavoritesComponent } from '../../components/favorites/favorites';

@Component({
  selector: 'app-country-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CountryCardComponent,
    FilterBarComponent,
    FavoritesComponent,
  ],
  templateUrl: './country-list.html',
  styleUrl: './country-list.css',
})
export class CountryListComponent implements OnInit {
  private countryService = inject(CountryService);
  private route = inject(ActivatedRoute);

  countries: Country[] = [];
  filteredCountries: Country[] = [];
  selectedRegion = '';
  selectedLetter = '';
  loading = true;
  errorMessage = '';

  searchCtrl = new FormControl<string>('', {
    nonNullable: true,
    validators: [
      Validators.pattern(/^[a-zA-ZÀ-ÿ\s-]*$/),
      Validators.minLength(3),
    ],
  });

  searchForm = new FormGroup({
    search: this.searchCtrl,
  });

  ngOnInit(): void {
    this.loadCountries();
  }

  loadCountries(): void {
    this.loading = true;
    this.errorMessage = '';

    this.countryService.getAllCountries().subscribe({
      next: (data) => {
        this.countries = data;

        this.route.params.subscribe((params) => {
          this.selectedRegion = params['region'] || '';
          this.selectedLetter = params['letter'] || '';
          this.applyFilters();
          this.loading = false;
        });
      },
      error: (err) => {
        console.error('COUNTRIES ERROR:', err);
        this.errorMessage = 'Unable to load countries.';
        this.loading = false;
      },
    });
  }

  onSubmitSearch(): void {
    if (this.searchForm.invalid) {
      return;
    }

    this.applyFilters();
  }

  onClearSearch(): void {
    this.searchCtrl.setValue('');
    this.applyFilters();
  }

  onRegionChanged(region: string): void {
    this.selectedRegion = region;
    this.applyFilters();
  }

  applyFilters(): void {
    const search = this.searchCtrl.value.trim().toLowerCase();

    this.filteredCountries = this.countries.filter((country) => {
      const matchesSearch =
        !search || country.name.common.toLowerCase().includes(search);

      const matchesRegion =
        !this.selectedRegion || country.region === this.selectedRegion;

      const matchesLetter =
        !this.selectedLetter ||
        country.name.common
          .toLowerCase()
          .startsWith(this.selectedLetter.toLowerCase());

      return matchesSearch && matchesRegion && matchesLetter;
    });
  }

  get showMinLengthError(): boolean {
    return this.searchCtrl.touched && this.searchCtrl.hasError('minlength');
  }

  get showPatternError(): boolean {
    return this.searchCtrl.touched && this.searchCtrl.hasError('pattern');
  }
}