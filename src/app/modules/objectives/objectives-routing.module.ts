import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ObjectivesComponent} from './objectives/objectives.component';
import {ObjectiveSearchComponent} from './objective-search/objective-search.component';
import {ObjectiveFormComponent} from './objective-form/objective-form.component';
import {ObjectiveDetailComponent} from './objective-detail/objective-detail.component';
import {ObjectiveListComponent} from './objective-list/objective-list.component';

const routes: Routes = [
  {
    path: 'objectives',
    children: [
      {
        path: '',
        component: ObjectivesComponent
      },
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
        path: 'list',
        component: ObjectiveListComponent
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
