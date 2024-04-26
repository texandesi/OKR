import {Injectable, Output } from '@angular/core';
import {BehaviorSubject, Subscription} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventHandlingService {
  @Output () objectiveDataHandler = new BehaviorSubject<any>(1);

  constructor() {}

  emitEvent(context: string, value?: any) :void {
      this.objectiveDataHandler.next(value);
  }

  subscribeEvent(context:string, observerOrNext?: any): Subscription  {
    return this.objectiveDataHandler.subscribe(observerOrNext);
  }
}

export namespace EVENT_EMITTER {
  export enum CONTEXT {
    ObjectiveList       = "OBJECTIVE_LIST",
    ObjectiveDataEntry  = "OBJECTIVE_DATA_ENTRY",
    KeyResultsList      = "KEY_RESULTS_LIST",
    KeyResultsDataEntry = "KEY_RESULTS_DATA_ENTRY",
    KpiResultsList      = "KPI_RESULTS_LIST",
    KpiDataEntry        = "KPI_DATA_ENTRY",
    SideNavRefresh      = "SIDENAV_REFRESH",
  };
}

