import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ObjectivesRoutingModule } from './objectives-routing.module';
import { ObjectiveSearchComponent } from './objective-search/objective-search.component';
import {ObjectivesComponent} from './objectives/objectives.component';
import { ObjectiveFormComponent } from './objective-form/objective-form.component';

import {NgbDate, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import { ObjectiveDetailComponent } from '../../objectives/objective-detail/objective-detail.component';


@NgModule({
  declarations: [
    ObjectiveSearchComponent,
    ObjectivesComponent,
    ObjectiveFormComponent,
    ObjectiveDetailComponent,
  ],
  imports: [
    CommonModule,
    ObjectivesRoutingModule,
    FormsModule,
    NgbModule,
  ],
})
export class ObjectivesModule {


}
