import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="flex justify-end mb-4">
      <div class="bg-white rounded-lg shadow p-2 flex space-x-2">
        <button 
          *ngFor="let lang of languages"
          (click)="switchLanguage(lang.code)"
          class="px-4 py-2 rounded-md transition-colors duration-200"
          [class.bg-indigo-600]="currentLang === lang.code"
          [class.text-white]="currentLang === lang.code"
          [class.hover:bg-indigo-700]="currentLang === lang.code"
          [class.hover:bg-gray-100]="currentLang !== lang.code"
        >
          {{ lang.name }}
        </button>
      </div>
    </div>
  `
})
export class LanguageSwitcherComponent {
  languages = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' }
  ];

  constructor(private translate: TranslateService) {
    // Set default language
    translate.setDefaultLang('en');
    translate.use('en');
  }

  get currentLang(): string {
    return this.translate.currentLang;
  }

  switchLanguage(lang: string): void {
    this.translate.use(lang);
    // Add RTL support for Arabic
    document.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }
}