import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ObjectivesComponent} from './objectives/objectives.component';
import {ObjectiveSearchComponent} from './objective-search/objective-search.component';
import {ObjectiveFormComponent} from "./objective-form/objective-form.component";

const routes: Routes = [
  { path: 'objectives',
    children: [
      {
        path: '',
        component: ObjectivesComponent,
      },
      {
        path: 'objective-form',
        component: ObjectiveFormComponent
      },
      {
        path: 'search',
        component: ObjectiveSearchComponent
      },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ObjectivesRoutingModule { }
