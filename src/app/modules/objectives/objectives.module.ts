import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ObjectivesRoutingModule } from './objectives-routing.module';
import { ObjectiveSearchComponent } from './objective-search/objective-search.component';
import {ObjectiveListComponent} from './objective-list/objective-list.component';

import {FormsModule} from '@angular/forms';
import {ObjectiveDetailComponent} from './objective-detail/objective-detail.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';



@NgModule({
  declarations: [
    ObjectiveListComponent,
    ObjectiveDetailComponent,
    ObjectiveSearchComponent,
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

  ],
  exports: [
    ObjectiveSearchComponent,
  ]
})
export class ObjectivesModule {


}
