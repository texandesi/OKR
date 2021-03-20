import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {KeyResultsComponent} from './key-results.component';

const routes: Routes = [
  {
    path: 'key-results',
    component: KeyResultsComponent,
    children: [
      {
        path: '',
        component: KeyResultsComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KeyResultsRoutingModule { }


