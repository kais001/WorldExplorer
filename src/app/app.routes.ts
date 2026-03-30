import { Routes } from '@angular/router';
import { CountryListComponent } from './pages/country-list/country-list';
import { CountryDetailComponent } from './pages/country-detail/country-detail';

export const routes: Routes = [
  {
    path: '',
    component: CountryListComponent,
  },
  {
    path: 'country/:code',
    component: CountryDetailComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];