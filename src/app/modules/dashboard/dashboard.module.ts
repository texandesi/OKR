import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {ObjectivesModule} from "../objectives/objectives.module";
import {KeyResultsModule} from "../key-results/key-results.module";
import {KpisModule} from "../kpis/kpis.module";
import {MatFormFieldModule} from "@angular/material/form-field";
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
    ObjectivesModule,
    KeyResultsModule,
    KpisModule,

  ],
  exports: [
    DashboardRoutingModule,
    MatFormFieldModule,
  ]

})
export class DashboardModule { }
