import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ObjectivesRoutingModule } from './objectives-routing.module';
import { ObjectiveSearchComponent } from './objective-search/objective-search.component';
import {ObjectivesComponent} from './objectives/objectives.component';
import { ObjectiveFormComponent } from './objective-form/objective-form.component';


@NgModule({
  declarations: [
    ObjectiveSearchComponent,
    ObjectivesComponent,
    ObjectiveFormComponent,
  ],
  imports: [
    CommonModule,
    ObjectivesRoutingModule
  ]
})
export class ObjectivesModule { }
