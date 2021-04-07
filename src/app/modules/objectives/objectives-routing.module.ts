import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ObjectiveListComponent} from './objective-list/objective-list.component';
import {ObjectiveSearchComponent} from './objective-search/objective-search.component';
import {ObjectiveDetailComponent} from './objective-detail/objective-detail.component';

const routes: Routes = [
  {
    path: 'objectives',
    children: [
      {
        path: 'search',
        component: ObjectiveSearchComponent
      },
      {
        path: 'detail/:id',
        component: ObjectiveDetailComponent
      },
      {
        path: '',
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
