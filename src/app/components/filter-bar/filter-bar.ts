import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './filter-bar.html',
  styleUrl: './filter-bar.css',
})
export class FilterBarComponent {
  @Input() selectedRegion = '';
  @Output() regionChange = new EventEmitter<string>();
  regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  onRegionChange(): void {
    this.regionChange.emit(this.selectedRegion);
  }
}
