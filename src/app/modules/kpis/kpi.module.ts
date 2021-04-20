import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {KpiListComponent} from "./kpi-list/kpi-list.component";
import {MatDialogModule} from "@angular/material/dialog";
import {KpiEditComponent} from "./kpi-edit/kpi-edit.component";
import {MatSidenavModule} from "@angular/material/sidenav";
import {LayoutModule} from "@angular/cdk/layout";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {KpiRoutingModule} from "./kpi-routing.module";


@NgModule({
  declarations: [
    KpiListComponent,
    KpiEditComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    ReactiveFormsModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,

    KpiRoutingModule,
  ],
  exports: [
    KpiListComponent,
    KpiEditComponent,
  ]
})
export class KpiModule {


}
