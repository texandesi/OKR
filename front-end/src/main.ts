import { enableProdMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { AuthModule } from './app/modules/auth/auth.module';
import { AdminModule } from './app/modules/admin/admin.module';
import { KpiModule } from './app/modules/kpis/kpi.module';
import { KeyResultsModule } from './app/modules/key-results/key-results.module';
import { ObjectivesModule } from './app/modules/objectives/objectives.module';
import { AppRoutingModule } from './app/app-routing.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { LayoutModule } from '@angular/cdk/layout';
import { withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, CommonModule, FormsModule, LayoutModule, ReactiveFormsModule, MatIconModule, MatListModule, MatSidenavModule, MatToolbarModule, 
        // DashboardModule,
        AppRoutingModule, ObjectivesModule, KeyResultsModule, KpiModule, AdminModule, AuthModule),
        provideAnimations(),
        provideHttpClient(withInterceptorsFromDi())
    ]
})
  .catch(err => console.error(err));
