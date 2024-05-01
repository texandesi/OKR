import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {TnOkrCommonTypes} from "../data-objects/tn-okr-common-types";
import { RouterOutlet } from '@angular/router';
import { NgFor, AsyncPipe } from '@angular/common';
import { MatNavList, MatListItem } from '@angular/material/list';
import { MatToolbar } from '@angular/material/toolbar';
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';

@Component({
    selector: 'app-nav',
    templateUrl: './app-nav.component.html',
    styleUrls: ['./app-nav.component.scss'],
    standalone: true,
    imports: [MatDrawerContainer, MatDrawer, MatToolbar, MatNavList, NgFor, MatListItem, MatDrawerContent, RouterOutlet, AsyncPipe]
})
export class AppNavComponent {

  NavItemList : TnOkrCommonTypes[] = [
    {
      "nav_link" : "/objectives",
      "name"  : "Objectives",
    },
    {
      "nav_link" : "/keyresults",
      "name"  : "Key Results",
    },
    {
      "nav_link" : "/kpis",
      "name"  : "KPIs",
    },
    {
      "nav_link" : "/admin",
      "name"  : "Admin",
    },

  ]


  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver) {}

}
