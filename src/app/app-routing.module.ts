import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {PageNotFoundComponent} from './modules/page-not-found/page-not-found.component';

import {DashboardComponent} from './modules/dashboard/dashboard.component';
import {KpisComponent} from './modules/kpis/kpi-list/kpis.component';
import {AdminComponent} from './modules/admin/admin/admin.component';
import {ObjectivesRoutingModule} from "./modules/objectives/objectives-routing.module";
import {KeyResultsRoutingModule} from "./modules/key-results/key-results-routing.module";
import {DashboardRoutingModule} from "./modules/dashboard/dashboard-routing.module";

const appRoutes: Routes = [
  { path: 'kpi-list', component: KpisComponent },
  { path: 'admin', component: AdminComponent },
  { path: '', redirectTo: '/objectives', pathMatch: 'full'},
  { path: '**', component: PageNotFoundComponent},
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
    RouterModule,
    ObjectivesRoutingModule,
    KeyResultsRoutingModule,
    DashboardRoutingModule,
  ]
})
export class AppRoutingModule {
}

