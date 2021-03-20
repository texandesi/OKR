import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {KeyResultsComponent} from "../key-results/key-results.component";
import {DashboardComponent} from "./dashboard.component";

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
