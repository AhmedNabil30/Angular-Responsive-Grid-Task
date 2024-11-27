import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationComponent } from '../pagination/pagination.component';
import { LoaderComponent } from '../loader/loader.component';
import { FilterComponent } from '../filter/filter.component';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface SortConfig {
  column: string;
  direction: 'asc' | 'desc';
}

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    PaginationComponent,
    LoaderComponent,
    FilterComponent
  ],
  template: `
    <div class="container mx-auto p-4">
      <!-- Filter Component -->
      <app-filter 
        (filterChange)="onFilterChange($event)"
      ></app-filter>

      <!-- Error Message -->
      <div *ngIf="error" class="text-center py-4 text-red-600">
        {{ 'ERROR.LOADING_DATA' | translate }}
        <button 
          (click)="loadData()" 
          class="ml-2 text-indigo-600 hover:text-indigo-800"
        >
          {{ 'ERROR.RETRY' | translate }}
        </button>
      </div>

      <!-- Loading Spinner -->
      <div *ngIf="loading" class="flex justify-center py-8">
        <app-loader></app-loader>
      </div>

      <!-- Data Grid -->
      <div *ngIf="!loading && !error" class="space-y-6">
        <!-- Sort Controls -->
        <div class="flex flex-wrap gap-4 mb-4">
          <button 
            *ngFor="let col of sortableColumns"
            (click)="onSort(col.key)"
            class="px-3 py-1 rounded border hover:bg-gray-100 
                   flex items-center space-x-1"
            [class.bg-indigo-50]="currentSort?.column === col.key"
          >
            <span>{{ col.label | translate }}</span>
            <span *ngIf="currentSort?.column === col.key" class="text-xs">
              {{ currentSort?.direction === 'asc' ? '↑' : '↓' }}
            </span>
          </button>
        </div>

        <!-- Grid Items -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            *ngFor="let item of paginatedItems" 
            class="bg-white rounded-lg shadow p-4"
          >
            <h3 class="text-lg font-semibold">{{ item.name }}</h3>
            <p class="text-gray-600">{{ item.email }}</p>
            <p class="text-sm text-gray-500">{{ item.phone }}</p>
          </div>
        </div>

        <!-- No Results Message -->
        <div 
          *ngIf="filteredItems.length === 0" 
          class="text-center py-8 text-gray-500"
        >
          {{ 'GRID.NO_DATA' | translate }}
        </div>

        <!-- Pagination -->
        <app-pagination 
          *ngIf="filteredItems.length > 0"
          [totalItems]="filteredItems.length"
          [itemsPerPage]="itemsPerPage"
          [currentPage]="currentPage"
          (pageChange)="onPageChange($event)"
        ></app-pagination>
      </div>
    </div>
  `
})
export class GridComponent implements OnInit {
  items: User[] = [];
  filteredItems: User[] = [];
  loading = true;
  error = false;
  currentPage = 1;
  itemsPerPage = 5;
  currentFilters: Record<string, string> = {};
  currentSort: SortConfig | null = null;

  sortableColumns = [
    { key: 'name', label: 'GRID.NAME' },
    { key: 'email', label: 'GRID.EMAIL' },
    { key: 'phone', label: 'GRID.PHONE' }
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.error = false;

    this.http.get<User[]>('https://jsonplaceholder.typicode.com/users')
      .subscribe({
        next: (data) => {
          this.items = data;
          this.applyFiltersAndSort();
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading data:', err);
          this.error = true;
          this.loading = false;
        }
      });
  }

  onFilterChange(filters: Record<string, string>): void {
    this.currentFilters = filters;
    this.currentPage = 1;
    this.applyFiltersAndSort();
  }

  onSort(column: string): void {
    if (this.currentSort?.column === column) {
      this.currentSort.direction = this.currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSort = { column, direction: 'asc' };
    }
    this.applyFiltersAndSort();
  }

  applyFiltersAndSort(): void {
    // Apply filters
    let result = this.items.filter(item => {
      return Object.entries(this.currentFilters).every(([key, value]) => {
        if (!value) return true;
        const itemValue = String(item[key as keyof User]).toLowerCase();
        return itemValue.includes(value.toLowerCase());
      });
    });

    // Apply sorting
    if (this.currentSort) {
      const { column, direction } = this.currentSort;
      result = [...result].sort((a, b) => {
        const aValue = String(a[column as keyof User]).toLowerCase();
        const bValue = String(b[column as keyof User]).toLowerCase();
        
        return direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      });
    }

    this.filteredItems = result;
  }

  get paginatedItems(): User[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredItems.slice(startIndex, startIndex + this.itemsPerPage);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }
}