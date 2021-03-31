import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ObjectivesRoutingModule } from './objectives-routing.module';
import { ObjectiveSearchComponent } from './objective-search/objective-search.component';
import {ObjectivesComponent} from './objectives/objectives.component';
import { ObjectiveFormComponent } from './objective-form/objective-form.component';

import {FormsModule} from '@angular/forms';
import {ObjectiveDetailComponent} from './objective-detail/objective-detail.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import {MatSliderModule} from '@angular/material/slider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';


@NgModule({
  declarations: [
    ObjectivesComponent,
    ObjectiveFormComponent,
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
    MatSliderModule,
    MatFormFieldModule,
    MatInputModule,

  ],
  exports: [
    ObjectiveSearchComponent,
  ]
})
export class ObjectivesModule {


}
