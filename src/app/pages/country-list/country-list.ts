import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  shareReplay,
  startWith,
  switchMap,
} from 'rxjs';
import { CountryCardComponent } from '../../components/country-card/country-card';
import { FavoritesComponent } from '../../components/favorites/favorites';
import { FilterBarComponent } from '../../components/filter-bar/filter-bar';
import { RxjsPlaygroundComponent } from '../../components/rxjs-playground/rxjs-playground';
import { Country } from '../../models/country.model';
import { CountryService } from '../../services/country';

@Component({
  selector: 'app-country-list',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    CountryCardComponent,
    FilterBarComponent,
    FavoritesComponent,
    RxjsPlaygroundComponent,
  ],
  templateUrl: './country-list.html',
  styleUrl: './country-list.css',
})
export class CountryListComponent implements OnInit {
  private countryService = inject(CountryService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private searchPattern = /^[a-zA-Z\u00C0-\u00FF\s-]*$/;
  private selectedRegionSubject = new BehaviorSubject<string>('');
  private selectedLetterSubject = new BehaviorSubject<string>('');

  selectedRegion = '';
  selectedLetter = '';

  searchCtrl = new FormControl<string>('', {
    nonNullable: true,
    validators: [
      Validators.pattern(this.searchPattern),
      Validators.minLength(3),
    ],
  });

  searchForm = new FormGroup({
    search: this.searchCtrl,
  });

  private searchTerm$ = this.searchCtrl.valueChanges.pipe(
    map((value) => value.trim()),
    debounceTime(300),
    distinctUntilChanged(),
    startWith(this.searchCtrl.value.trim()),
    shareReplay(1)
  );

  private searchRequest$ = this.searchTerm$.pipe(
    map((searchTerm) =>
      searchTerm.length >= 3 && this.searchPattern.test(searchTerm)
        ? searchTerm
        : ''
    ),
    distinctUntilChanged()
  );

  private countriesResource$ = this.searchRequest$.pipe(
    switchMap((searchTerm) =>
      this.fetchCountries(searchTerm).pipe(
        map((countries) => ({
          countries,
          loading: false,
          errorMessage: '',
        })),
        startWith({
          countries: [] as Country[],
          loading: true,
          errorMessage: '',
        }),
        catchError((err) => {
          console.error('COUNTRIES ERROR:', err);
          return of({
            countries: [] as Country[],
            loading: false,
            errorMessage: searchTerm
              ? 'Unable to search countries right now.'
              : 'Unable to load countries.',
          });
        })
      )
    ),
    shareReplay(1)
  );

  viewState$ = combineLatest([
    this.countriesResource$,
    this.selectedRegionSubject,
    this.selectedLetterSubject,
  ]).pipe(
    map(([resource, selectedRegion, selectedLetter]) => ({
      ...resource,
      filteredCountries: resource.countries.filter((country) =>
        this.matchesFilters(country, selectedRegion, selectedLetter)
      ),
    })),
    shareReplay(1)
  );

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((params) => ({
          region: params.get('region') || '',
          letter: params.get('letter') || '',
        })),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(({ region, letter }) => {
        this.selectedRegion = region;
        this.selectedLetter = letter;
        this.selectedRegionSubject.next(region);
        this.selectedLetterSubject.next(letter);
      });
  }

  onSubmitSearch(): void {
    this.searchCtrl.markAsTouched();
  }

  onClearSearch(): void {
    this.searchCtrl.setValue('');
    this.searchCtrl.markAsPristine();
    this.searchCtrl.markAsUntouched();
  }

  onRegionChanged(region: string): void {
    this.selectedRegion = region;
    this.selectedRegionSubject.next(region);
  }

  private fetchCountries(searchTerm: string): Observable<Country[]> {
    return searchTerm
      ? this.countryService.searchByName(searchTerm)
      : this.countryService.getAllCountries();
  }

  private matchesFilters(
    country: Country,
    selectedRegion: string,
    selectedLetter: string
  ): boolean {
    const matchesRegion =
      !selectedRegion || country.region === selectedRegion;

    const matchesLetter =
      !selectedLetter ||
      country.name.common
        .toLowerCase()
        .startsWith(selectedLetter.toLowerCase());

    return matchesRegion && matchesLetter;
  }

  get showMinLengthError(): boolean {
    return (
      this.searchCtrl.touched &&
      !!this.searchCtrl.value &&
      this.searchCtrl.hasError('minlength')
    );
  }

  get showPatternError(): boolean {
    return this.searchCtrl.touched && this.searchCtrl.hasError('pattern');
  }
}
