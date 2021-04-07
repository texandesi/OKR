import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {PageNotFoundComponent} from './modules/page-not-found/page-not-found.component';

import {KeyResultsComponent} from './modules/key-results/key-results.component';
import {DashboardComponent} from './modules/dashboard/dashboard.component';
import {KpisComponent} from './modules/kpis/kpi-list/kpis.component';
import {AdminComponent} from './modules/admin/admin/admin.component';
import {ObjectiveListComponent} from './modules/objectives/objective-list/objective-list.component';

const appRoutes: Routes = [
  { path: 'key-results', component: KeyResultsComponent },
  { path: 'kpi-list', component: KpisComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'objectives', component: ObjectiveListComponent },
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
    RouterModule
  ]
})
export class AppRoutingModule {
}

