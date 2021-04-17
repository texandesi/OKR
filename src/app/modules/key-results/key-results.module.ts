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
import {KeyResultListComponent} from "./key-results-list/key-result-list.component";
import {KeyResultsSearchComponent} from "./key-results-search/key-results-search.component";
import {MatDialogModule} from "@angular/material/dialog";
import {KeyResultEditComponent} from "./keyresults-edit/keyresult-edit.component";


@NgModule({
  declarations: [
    KeyResultListComponent,
    KeyResultsSearchComponent,
    KeyResultEditComponent,
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
    KeyResultListComponent,
    KeyResultEditComponent,
  ]
})
export class KeyResultsModule {


}
