// import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AdminComponent} from './admin/admin.component';
import {AdminDashboardComponent} from './admin-dashboard/admin-dashboard.component';

import {AuthGuard} from '../auth/auth.guard';

const adminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        canActivateChild: [AuthGuard],
        children: [
          {path: '', component: AdminDashboardComponent}
        ]
      }
    ]
  }
];

// @NgModule({
//   imports: [
//     RouterModule.forChild(adminRoutes)
//   ],
//   exports: [
//     RouterModule
//   ]
// })
export class AdminRoutingModule {
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
