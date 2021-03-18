import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ObjectivesComponent} from './objectives/objectives.component';
import {ObjectiveSearchComponent} from './objective-search/objective-search.component';

const routes: Routes = [
  { path: 'objectives',
    children: [
      {
        path: '',
        component: ObjectivesComponent,
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
