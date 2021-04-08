import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KeyResultsRoutingModule } from './key-results-routing.module';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {KeyResultsListComponent} from "./key-results-list/key-results-list.component";
import {KeyResultsDetailComponent} from "./key-results-detail/key-results-detail.component";
import {KeyResultsSearchComponent} from "./key-results-search/key-results-search.component";
import {MatDialogModule} from "@angular/material/dialog";
import {KeyResultsEditComponent} from "./key-results-edit/key-results-edit.component";



@NgModule({
  declarations: [
    KeyResultsListComponent,
    KeyResultsDetailComponent,
    KeyResultsSearchComponent,
    KeyResultsEditComponent,
  ],
  imports: [
    CommonModule,
    KeyResultsRoutingModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,

  ],
  exports: [
    KeyResultsSearchComponent,
    KeyResultsDetailComponent,
    KeyResultsListComponent,
    KeyResultsEditComponent,
  ]
})
export class KeyResultsModule {


}
