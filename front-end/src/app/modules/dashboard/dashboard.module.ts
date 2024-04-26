import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {KpiModule} from "../kpis/kpi.module";
import {DashboardComponent} from "./dashboard.component";

@NgModule({
  declarations: [
    DashboardComponent,

  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatInputModule,
    MatButtonModule,
    KpiModule,

  ],
  exports: [
    DashboardRoutingModule,
  ]

})
export class DashboardModule {

}
