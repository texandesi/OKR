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

// <a mat-list-item href="/objectives">Objectives</a>
//     <a mat-list-item href="/keyresults">Key Results</a>
// <a mat-list-item href="/kpis">KPIs</a>
//
//     <a mat-list-item href="{{nav_item.nav_link}}" *ngFor="let nav_item of NavItemList">{{ nav_item.name }}</a>

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

  ]


  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver) {}

}
