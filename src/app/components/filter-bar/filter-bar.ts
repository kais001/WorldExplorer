import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './filter-bar.html',
  styleUrl: './filter-bar.css',
})
export class FilterBarComponent {
  @Output() regionChange = new EventEmitter<string>();

  selectedRegion = '';
  regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  onRegionChange(): void {
    this.regionChange.emit(this.selectedRegion);
  }
}