import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {catchError, map, tap} from 'rxjs/operators';
import {Observable, of as observableOf, merge, of, BehaviorSubject} from 'rxjs';
import {ObjectivesDataService} from '../services/objectives-data-service.service';
import {Objective} from '../data-objects/objective';

/**
 * Data source for the ObjectiveList view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class ObjectiveListDataSource implements DataSource<Objective> {

  private data  = new BehaviorSubject<Objective[]>([]);

  paginator!: MatPaginator;
  sort!: MatSort;
  length = 10;

  constructor(
    private objectiveService : ObjectivesDataService,
  ) {
    // super();
    console.log("getObjectives invoked in Data Source");
    this.getObjectives();
  }

  getObjectives(): void {


    console.log("getObjectives invoked in Data Source");
    this.objectiveService.getObjectives()
      .subscribe(objectives => {this.data.next(objectives); console.log("Data returned from service to data source")});

    length=this.data.value.length;
    console.log("End of getObjectives invoked in Data Source.");
  }


  addObjective(objective: Objective): void {

    this.objectiveService.addObjective(objective);
  }

  deleteObjective(id: number): void {
    this.objectiveService.deleteObjective(id);
 }


  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<Objective[]> {
    this.getObjectives();

    return this.data;
    // if (this.paginator && this.sort) {
    //   // Combine everything that affects the rendered data into one update
    //   // stream for the data-table to consume.
    //   return merge(this.data, this.paginator.page, this.sort.sortChange)
    //     .pipe(map(() => {
    //       return this.getPagedData(this.getSortedData(this.data ));
    //     }));
    // } else {
    //   // throw Error('Please set the paginator and sort on the data source before connecting.');
    //   console.error('data is ' + this.data) ;
    //
    //   return observableOf(this.data)
    //     .pipe(map(() => {
    //       return [ ...this.data ];
    //     }));

    }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

