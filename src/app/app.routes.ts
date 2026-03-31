import { Routes } from '@angular/router';
import { CountryListComponent } from './pages/country-list/country-list';
import { CountryDetailComponent } from './pages/country-detail/country-detail';
import { FavoritesComponent } from './pages/favorites/favorites';

export const routes: Routes = [
  { path: '', component: CountryListComponent },
  { path: 'region/:region', component: CountryListComponent },
  { path: 'letter/:letter', component: CountryListComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'country/:code', component: CountryDetailComponent },
];