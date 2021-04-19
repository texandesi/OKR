import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ObjectiveListComponent} from './objective-list/objective-list.component';
import {ObjectiveDetailComponent} from './objective-detail/objective-detail.component';

const routes: Routes = [
  {
    path: 'objectives',
    children: [
      {
        path: '',
        component: ObjectiveListComponent
      },
      {
        path: 'detail/:id',
        component: ObjectiveDetailComponent
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
