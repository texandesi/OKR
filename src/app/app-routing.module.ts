import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ComposeMessageComponent} from './compose-message/compose-message.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';

import {AuthGuard} from './auth/auth.guard';
import {KeyResultsComponent} from './key-results/key-results.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {ObjectivesComponent} from './objectives/objectives.component';
import {KpisComponent} from './kpis/kpis.component';
import {AdminComponent} from './admin/admin/admin.component';

const appRoutes: Routes = [
  { path: 'key-results', component: KeyResultsComponent },
  { path: 'objectives', component: ObjectivesComponent },
  { path: 'kpis', component: KpisComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'dashboard', component: DashboardComponent },
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent}
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

