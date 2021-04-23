import {Injectable, Output } from '@angular/core';
import {BehaviorSubject, Subscription} from 'rxjs';
// import {Objective} from "../data-objects/objective";


@Injectable({ providedIn: 'root' })
export class EventHandlingService {
  // private eventMap : Map <string, EventEmitter<any>>  = new Map();
  // private subscription !: Subscription;

  @Output () objectiveData = new BehaviorSubject<number>(1);

  constructor() {}

  /** Register an event to be transmitted */
  // registerEventEmitter(context: string, e?: Event): string {
  //   let retVal  = this.eventMap.get(context);
  //   if(!retVal) {
  //     // Already registered. Return the same context
  //     this.eventMap.set(context, new EventEmitter<any>());
  //   }
  //
  //   return context;
  // }

  // getEventEmitter(context: string): string {
  //   return this.registerEventEmitter(context);
  // }
  //
  // unregisterEventEmitter(context: string): void {
  //   let retVal  = this.eventMap.get(context);
  //   if(retVal) {
  //     // Delete context if it exists
  //     this.eventMap.delete(context);
  //   }
  //
  //   return;
  // }

  // isEventEmitterRegistered(context: string): boolean {
  //   if(this.eventMap.get(context)) {
  //     return true;
  //   }
  //
  //   return false;
  // }

  emitEvent(context: string, value?: any) :void {

    // let eventEmitter = this.eventMap.get(context);

    // if (eventEmitter) {
      console.log('Emitting event ' + context + ' with  value ' + value );
      this.objectiveData.next(value);
    // }
  }

  subscribeEvent(context:string, observerOrNext?: any): Subscription  {
    // let eventEmitter = this.eventMap.get(context);
    //
    // if(!eventEmitter) {
    //   this.registerEventEmitter(context);
    // }

    // @ts-ignore
    // this.subscription = this.eventMap.get(context).subscribe(observerOrNext, error, complete);
    return this.objectiveData.subscribe(observerOrNext);
    // objectiveData

    // return this.subscription;
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

