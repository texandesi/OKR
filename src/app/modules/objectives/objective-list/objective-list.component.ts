import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Objective} from '../../../data-objects/objective';
import {MatPaginator} from '@angular/material/paginator';
import {PageEvent} from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';
import {ObjectivesDataService} from '../../../services/objectives-data-service.service';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {ObjectiveEditComponent} from '../objective-edit/objective-edit.component';
import {ObjectiveListDataSource} from "../../../data-sources/objective-list-datasource";
import {debounceTime, distinctUntilChanged, tap} from "rxjs/operators";
import {merge} from "rxjs";
import {MessageService} from "../../../services/message.service";
import {fromEvent} from 'rxjs';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-objectives',
  templateUrl: './objective-list.component.html',
  styleUrls: ['./objective-list.component.scss']
})
export class ObjectiveListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('input') input!: ElementRef;
  @ViewChild(MatTable) table!: MatTable<Objective>;

  dataSource !: ObjectiveListDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name', 'description', 'delete'];

  messages: MessageService = new MessageService();
  total_data_length: number = 10;
  pageEvent: PageEvent = new PageEvent();

  constructor(
    private objectiveService: ObjectivesDataService,
    private dialog: MatDialog,
  ) {
    this.dataSource = new ObjectiveListDataSource(this.objectiveService);
    this.pageEvent.previousPageIndex = -1;
    this.pageEvent.pageIndex = 0;
  }

  ngOnInit(): void {
    this.dataSource = new ObjectiveListDataSource(this.objectiveService);
    this.dataSource.getObjectives();
  }

  ngAfterViewInit(): void {
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.search(this.input.nativeElement.value);
        })
      )
      .subscribe();

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.dataSource.getObjectives(
          this.paginator.pageSize,
          this.pageEvent.previousPageIndex,
          this.paginator.pageIndex,
          this.sort.active,
          this.sort.direction
        ))
      )
      .subscribe(
        event => {
          this.messages.log('Verifying that event is of Page Event type is  ' + this.isPageEvent(event));
          let myPageEvent : PageEvent = this.getPageEvent();


        }
      );
  }

  openDialog(record_id ?: number) {
    // this.messages.log('Objective list component row id is ' + record_id);

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    // let o: Objective = {name: 'Enter name here', description: 'Enter description here'};
    dialogConfig.data = {name: 'Enter name here', description: 'Enter description here'};

    let dialogRef !: MatDialogRef<Objective>;

    if (record_id) {
      this.dataSource.getObjective(record_id).subscribe(
        o => {
          dialogConfig.data = {
            name: o.name,
            description: o.description,
          };
          dialogRef = this.dialog.open(ObjectiveEditComponent, dialogConfig)

          dialogRef.afterClosed().subscribe(
            data => {
              if (!data) { return; }

              this.update({id: record_id, name: data.name, description: data.description});
            }
          );
        }
      )
    } else {
      // Add branch
      dialogRef = this.dialog.open(ObjectiveEditComponent, dialogConfig);

      dialogRef.afterClosed().subscribe(
        data => {
          if (!data) { return; }
          this.add(data.name, data.description);
        }
      );
    }


  }

  add(
    name: string,
    description: string
  ): void {
    // console.log('Before Adding key-results-list in data source');
    name = name.trim();
    if (!name) {
      return;
    }
    description = description.trim();
    if (!description) {
      return;
    }
    this.dataSource.addObjective({name: name, description: description} as Objective);

  }

  update(
    objective: Objective
  ): void {
    // console.log('Before Adding key-results-list in data source');
    objective.name = objective.name.trim();
    if (!objective.name) {
      return;
    }

    if (objective.description) {
      objective.description = objective.description.trim();
      if (!objective.description) {
        return;
      }
    }
    this.dataSource.updateObjective(objective);
    // this.table.renderRows();
  }

  // TODO Implement back the page refresh and delete functionality for the Objectives list.
  delete(id: number): void {
    // this.dataSource.data = this.dataSource.data.filter(h => h !== objective);
    // console.log('Before deleting key-results-list in data source');
    this.dataSource.deleteObjective(id);
    // this.table.renderRows();
  }

  search(name: string): void {
    name = name.trim();
    if (!name) {
      this.dataSource.getObjectives();
      return;
    }
    this.dataSource.searchObjective(name);

  }

  isPageEvent(event: Sort | PageEvent): event is PageEvent {
    return (event as PageEvent).length !== undefined;
  }

  isSortEvent(event: Sort | PageEvent): event is Sort {
    return (event as Sort).direction !== undefined;
  }

  getPageEvent () : PageEvent {
    let pageEvent = new PageEvent();

    return pageEvent;
  }

}
