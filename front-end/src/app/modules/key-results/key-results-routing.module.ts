// import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {KeyResultsSearchComponent} from "./key-results-search/key-results-search.component";
import {KeyResultListComponent} from "./key-results-list/key-result-list.component";

const routes: Routes = [
  {
    path: 'keyresults',
    children: [
      {
        path: '',
        component: KeyResultListComponent
      },
      {
        path: 'search',
        component: KeyResultsSearchComponent
      },
    ]
  },
];

// @NgModule({
//   imports: [RouterModule.forChild(routes)],
//   exports: [
//     RouterModule,
//   ]
// })
export class KeyResultsRoutingModule { }
