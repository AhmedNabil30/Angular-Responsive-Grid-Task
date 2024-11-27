import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SortConfig } from '../interfaces/sort.interface';

@Component({
  selector: 'app-sort-button',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <button 
      (click)="toggleSort()"
      class="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-gray-900"
    >
      <span>{{ label | translate }}</span>
      <span class="flex flex-col h-4 justify-center">
        <svg 
          [class.text-indigo-600]="isActive && currentSort?.direction === 'asc'"
          class="w-3 h-3 -mb-1" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
        </svg>
        <svg 
          [class.text-indigo-600]="isActive && currentSort?.direction === 'desc'"
          class="w-3 h-3 -mt-1" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    </button>
  `
})
export class SortButtonComponent {
  @Input() column!: string;
  @Input() label!: string;
  @Input() currentSort: SortConfig | null = null;
  @Output() sortChange = new EventEmitter<SortConfig>();

  get isActive(): boolean {
    return this.currentSort?.column === this.column;
  }

  toggleSort(): void {
    if (!this.isActive) {
      this.sortChange.emit({ column: this.column, direction: 'asc' });
    } else {
      const nextDirection = this.currentSort?.direction === 'asc' ? 'desc' : 'asc';
      this.sortChange.emit({ column: this.column, direction: nextDirection });
    }
  }
}