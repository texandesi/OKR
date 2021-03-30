import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import {ObjectivesDataService} from '../services/objectives-data-service.service';
import {Objective} from '../modules/objectives/objective';
import {Injectable} from '@angular/core';

/**
 * Data source for the ObjectiveList view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class ObjectiveListDataSource extends DataSource<Objective> {
  data : Objective[] = [
    {id:100, name:'Some name 0'},
    {id:101, name:'Some name 1'},

  ];


  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  constructor(private objectiveService : ObjectivesDataService) {
    super();
  }

  getObjectives(): void {
    console.log('Before getting objectives in data source');

    this.objectiveService.getObjectives()
      .subscribe(objectives => this.data = objectives);

    console.log('After getting objectives in data source');

  }


  addObjective(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.objectiveService.addObjective({ name } as Objective)
      .subscribe(objective => {
        this.data.push(objective);
      });

    this.getObjectives();

  }

  deleteObjective(idValue: number): void {
    // TODO Remove console log messages from all the code
    // console.log("Id value in data source is " + idValue);
    // console.log("Length of data in data source before is " + this.data.length);

    this.objectiveService.deleteObjective( idValue  )
      .subscribe(objective => { objective &&
      this.data.filter(h => h.id !== objective.id);
      });

    this.getObjectives();

    // console.log("Length of data in data source after is " + this.data.length);


  }


  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<Objective[]> {
    if (this.paginator && this.sort) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return merge(observableOf(this.data), this.paginator.page, this.sort.sortChange)
        .pipe(map(() => {
          return this.getPagedData(this.getSortedData([...this.data ]));
        }));
    } else {
      throw Error('Please set the paginator and sort on the data source before connecting.');
    }
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: Objective[]): Objective[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: Objective[]): Objective[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        case 'id': return compare(+a.id, +b.id, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
