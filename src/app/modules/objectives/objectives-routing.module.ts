import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ObjectivesComponent} from './objectives/objectives.component';
import {ObjectiveSearchComponent} from './objective-search/objective-search.component';
import {ObjectiveFormComponent} from './objective-form/objective-form.component';
import {ObjectiveDetailComponent} from './objective-detail/objective-detail.component';

const routes: Routes = [
  {
    path: 'objectives',
    children: [
      {
        path: 'form',
        component: ObjectiveFormComponent
      },
      {
        path: 'detail/:id',
        component: ObjectiveDetailComponent
      },
      {
        path: 'search',
        component: ObjectiveSearchComponent
      },
      {
        path: '',
        component: ObjectivesComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [
    RouterModule,
  ]
})
export class ObjectivesRoutingModule { }
