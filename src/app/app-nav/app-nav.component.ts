import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {TnOkrCommonTypes} from "../data-objects/tn-okr-common-types";

@Component({
  selector: 'app-nav',
  templateUrl: './app-nav.component.html',
  styleUrls: ['./app-nav.component.scss']
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
