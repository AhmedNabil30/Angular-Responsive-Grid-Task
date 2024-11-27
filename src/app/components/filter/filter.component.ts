import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  template: `
    <form [formGroup]="filterForm" class="mb-6">
      <div class="bg-white rounded-lg shadow p-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Name Filter -->
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700">
              {{ 'FILTER.NAME' | translate }}
            </label>
            <input 
              type="text" 
              formControlName="name"
              class="w-full rounded-md border-gray-300 shadow-sm 
                     focus:border-indigo-500 focus:ring-indigo-500"
              [placeholder]="'FILTER.NAME_PLACEHOLDER' | translate"
            />
          </div>

          <!-- Email Filter -->
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700">
              {{ 'FILTER.EMAIL' | translate }}
            </label>
            <input 
              type="email" 
              formControlName="email"
              class="w-full rounded-md border-gray-300 shadow-sm 
                     focus:border-indigo-500 focus:ring-indigo-500"
              [placeholder]="'FILTER.EMAIL_PLACEHOLDER' | translate"
            />
            <div 
              *ngIf="filterForm.get('email')?.errors?.['email'] && 
                     filterForm.get('email')?.touched"
              class="text-red-500 text-sm mt-1"
            >
              {{ 'VALIDATION.INVALID_EMAIL' | translate }}
            </div>
          </div>

          <!-- Phone Filter -->
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700">
              {{ 'FILTER.PHONE' | translate }}
            </label>
            <input 
              type="text" 
              formControlName="phone"
              class="w-full rounded-md border-gray-300 shadow-sm 
                     focus:border-indigo-500 focus:ring-indigo-500"
              [placeholder]="'FILTER.PHONE_PLACEHOLDER' | translate"
            />
            <div 
              *ngIf="filterForm.get('phone')?.errors?.['pattern'] && 
                     filterForm.get('phone')?.touched"
              class="text-red-500 text-sm mt-1"
            >
              {{ 'VALIDATION.INVALID_PHONE' | translate }}
            </div>
          </div>
        </div>

        <!-- Clear Filters -->
        <div class="mt-4 flex justify-end">
          <button 
            type="button"
            (click)="clearFilters()"
            class="text-sm text-gray-500 hover:text-gray-700"
          >
            {{ 'FILTER.CLEAR' | translate }}
          </button>
        </div>
      </div>
    </form>
  `
})
export class FilterComponent {
  @Output() filterChange = new EventEmitter<Record<string, string>>();
  filterForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      name: [''],
      email: ['', [Validators.email]],
      phone: ['', [Validators.pattern('^[0-9\\-\\+]{8,}$')]]
    });

    this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(filters => {
        if (this.filterForm.valid) {
          this.emitValidFilters(filters);
        }
      });
  }

  private emitValidFilters(filters: Record<string, string>): void {
    const validFilters = Object.entries(filters)
      .reduce((acc, [key, value]) => {
        if (value && typeof value === 'string' && value.trim()) {
          acc[key] = value.trim();
        }
        return acc;
      }, {} as Record<string, string>);

    this.filterChange.emit(validFilters);
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.filterChange.emit({});
  }
}
