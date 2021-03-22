import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {KpisComponent} from "./kpis.component";

const routes: Routes = [
  {
    path: 'kpis',
    component: KpisComponent,
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


