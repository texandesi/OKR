import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ObjectivesRoutingModule } from './objectives-routing.module';
import { ObjectiveSearchComponent } from './objective-search/objective-search.component';
import {ObjectivesComponent} from './objectives/objectives.component';
import { ObjectiveFormComponent } from './objective-form/objective-form.component';

import {NgbDate, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {ObjectiveDetailComponent} from './objective-detail/objective-detail.component';
import { ObjectiveListComponent } from './objective-list/objective-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';


@NgModule({
  declarations: [
    ObjectivesComponent,
    ObjectiveFormComponent,
    ObjectiveDetailComponent,
    ObjectiveSearchComponent,
    ObjectiveListComponent,
  ],
  imports: [
    CommonModule,
    ObjectivesRoutingModule,
    FormsModule,
    NgbModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  exports: [
    ObjectiveSearchComponent,
  ]
})
export class ObjectivesModule {


}
