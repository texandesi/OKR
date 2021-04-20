import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {KpiListComponent} from "./kpi-list/kpi-list.component";

const routes: Routes = [
  {
    path: 'kpis',
    children: [
      {
        path: '',
        component: KpiListComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KpiRoutingModule { }


