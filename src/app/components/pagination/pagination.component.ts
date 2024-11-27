import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="flex justify-center items-center space-x-2 mt-4">
      <!-- Previous Button -->
      <button 
        (click)="changePage(currentPage - 1)"
        [disabled]="currentPage === 1"
        class="px-3 py-1 rounded border hover:bg-gray-100 
               disabled:opacity-50 disabled:hover:bg-white"
      >
        {{ 'PAGINATION.PREVIOUS' | translate }}
      </button>

      <!-- Page Numbers -->
      <div class="flex space-x-1">
        <button 
          *ngFor="let page of visiblePages"
          (click)="changePage(page)"
          [class.bg-indigo-600]="currentPage === page"
          [class.text-white]="currentPage === page"
          class="px-3 py-1 rounded border hover:bg-gray-100"
        >
          {{ page }}
        </button>
      </div>

      <!-- Next Button -->
      <button 
        (click)="changePage(currentPage + 1)"
        [disabled]="currentPage === totalPages"
        class="px-3 py-1 rounded border hover:bg-gray-100 
               disabled:opacity-50 disabled:hover:bg-white"
      >
        {{ 'PAGINATION.NEXT' | translate }}
      </button>
    </div>
  `
})
export class PaginationComponent {
  @Input() totalItems = 0;
  @Input() itemsPerPage = 5;
  @Input() currentPage = 1;
  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get visiblePages(): number[] {
    const pages: number[] = [];
    let startPage = Math.max(1, this.currentPage - 2);
    let endPage = Math.min(this.totalPages, startPage + 4);
    
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }
}