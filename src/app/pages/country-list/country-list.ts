import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CountryService } from '../../services/country';
import { Country } from '../../models/country.model';
import { CountryCardComponent } from '../../components/country-card/country-card';
import { FilterBarComponent } from '../../components/filter-bar/filter-bar';
import { FavoritesComponent } from '../../components/favorites/favorites';

@Component({
  selector: 'app-country-list',
  standalone: true,
  imports: [FormsModule, CountryCardComponent, FilterBarComponent, FavoritesComponent],
  templateUrl: './country-list.html',
  styleUrl: './country-list.css',
})
export class CountryListComponent implements OnInit {
  private countryService = inject(CountryService);
  private route = inject(ActivatedRoute);

  countries: Country[] = [];
  filteredCountries: Country[] = [];
  searchTerm = '';
  selectedRegion = '';
  selectedLetter = '';
  loading = true;
  errorMessage = '';

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

  onSearch(): void {
    this.applyFilters();
  }

  onRegionChanged(region: string): void {
    this.selectedRegion = region;
    this.applyFilters();
  }

  applyFilters(): void {
    const search = this.searchTerm.trim().toLowerCase();

    this.filteredCountries = this.countries.filter((country) => {
      const matchesSearch =
        !search || country.name.common.toLowerCase().includes(search);

      const matchesRegion =
        !this.selectedRegion || country.region === this.selectedRegion;

      const matchesLetter =
        !this.selectedLetter ||
        country.name.common.toLowerCase().startsWith(this.selectedLetter.toLowerCase());

      return matchesSearch && matchesRegion && matchesLetter;
    });
  }
}