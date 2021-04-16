import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ObjectiveListComponent} from './objective-list/objective-list.component';
import {ObjectiveSearchComponent} from './objective-search/objective-search.component';
import {ObjectiveDetailComponent} from './objective-detail/objective-detail.component';
import {ObjectiveNavComponent} from "./objective-nav/objective-nav.component";

const routes: Routes = [
  {
    path: 'objectives',
    children: [
      {
        path: '',
        component: ObjectiveListComponent,
        pathMatch: 'full'
      },
      {
        path: 'search',
        component: ObjectiveSearchComponent
      },
      {
        path: 'nav',
        component: ObjectiveNavComponent
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
