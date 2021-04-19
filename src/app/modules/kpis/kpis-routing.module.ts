import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {KpisComponent} from "./kpi-list/kpis.component";

const routes: Routes = [
  {
    path: 'kpis',
    children: [
      {
        path: '',
        component: KpisComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KpisRoutingModule { }


