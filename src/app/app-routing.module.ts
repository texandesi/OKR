import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {PageNotFoundComponent} from './modules/page-not-found/page-not-found.component';

import {KeyResultsComponent} from './modules/key-results/key-results.component';
import {DashboardComponent} from './modules/dashboard/dashboard.component';
import {KpisComponent} from './modules/kpis/kpis.component';
import {AdminComponent} from './modules/admin/admin/admin.component';

const appRoutes: Routes = [
  { path: 'key-results', component: KeyResultsComponent },
  { path: 'kpis', component: KpisComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  { path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {
        enableTracing: false, // <-- debugging purposes only
      }
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}

