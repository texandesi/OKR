import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {KeyResultsSearchComponent} from "./key-results-search/key-results-search.component";
import {KeyResultsListComponent} from "./key-results-list/key-results-list.component";
import {KeyResultsDetailComponent} from "./key-results-detail/key-results-detail.component";

const routes: Routes = [
  {
    path: 'keyresults',
    children: [
      {
        path: 'search',
        component: KeyResultsSearchComponent
      },
      {
        path: 'detail/:id',
        component: KeyResultsDetailComponent
      },
      {
        path: '',
        component: KeyResultsListComponent
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
export class KeyResultsRoutingModule { }
