import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {ObjectivesModule} from "../objectives/objectives.module";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatInputModule,
    MatButtonModule,
    ObjectivesModule,

  ],
  exports: [
    MatInputModule,
    MatButtonModule,

  ]

})
export class DashboardModule { }
