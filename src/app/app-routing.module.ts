import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {PageNotFoundComponent} from './modules/page-not-found/page-not-found.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {AppComponent} from "./app.component";

// import {DashboardComponent} from './modules/dashboard/dashboard.component';
// import {AdminComponent} from './modules/admin/admin/admin.component';
import {ObjectivesRoutingModule} from "./modules/objectives/objectives-routing.module";
import {KeyResultsRoutingModule} from "./modules/key-results/key-results-routing.module";
import {DashboardRoutingModule} from "./modules/dashboard/dashboard-routing.module";
import { KpiRoutingModule } from './modules/kpis/kpi-routing.module';
import {AdminRoutingModule} from "./modules/admin/admin-routing.module";
import {AuthRoutingModule} from "./modules/auth/auth-routing.module";
import {ObjectiveListComponent} from "./modules/objectives/objective-list/objective-list.component";

const appRoutes: Routes = [
  { path: '', component: ObjectiveListComponent },
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
    KpiRoutingModule,
    DashboardRoutingModule,
    AdminRoutingModule,
    AuthRoutingModule,
  ]
})
export class AppRoutingModule {
}

