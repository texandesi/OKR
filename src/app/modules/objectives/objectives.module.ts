import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule} from '@angular/material/input';
import { MatButtonModule} from '@angular/material/button';
import { MatDialogModule} from "@angular/material/dialog";

// Objectives
import { ObjectivesRoutingModule } from './objectives-routing.module';
import { ObjectiveSearchComponent } from './objective-search/objective-search.component';
import { ObjectiveEditComponent } from "./objective-edit/objective-edit.component";
import { ObjectiveDetailComponent } from './objective-detail/objective-detail.component';
import { ObjectiveListComponent } from "./objective-list/objective-list.component";

@NgModule({
  declarations: [
    ObjectiveListComponent,
    ObjectiveDetailComponent,
    ObjectiveSearchComponent,
    ObjectiveEditComponent,
  ],
  imports: [
    CommonModule,
    ObjectivesRoutingModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,

  ],
  exports: [
    ObjectiveListComponent,
    ObjectiveDetailComponent,
    ObjectiveSearchComponent,
    ObjectiveEditComponent,
  ],
  providers: [],
  bootstrap: [],
  entryComponents: [],
})
export class ObjectivesModule {


}
