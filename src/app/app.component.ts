import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { GridComponent } from './components/grid/grid.component';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    GridComponent,
    LanguageSwitcherComponent
  ],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="container mx-auto px-4 py-8">
        <app-language-switcher></app-language-switcher>
        <app-grid></app-grid>
      </div>
    </div>
  `
})
export class AppComponent {
  title = 'task';
}