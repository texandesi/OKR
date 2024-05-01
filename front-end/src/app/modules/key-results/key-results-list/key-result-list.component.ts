import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {PageEvent} from '@angular/material/paginator';
import { MatSort, Sort, MatSortHeader } from '@angular/material/sort';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';

import {debounceTime, distinctUntilChanged, tap} from "rxjs/operators";
import {merge} from "rxjs";
import {MessageService} from "../../../services/message.service";
import {fromEvent} from 'rxjs';
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import {KeyResult} from "../../../data-objects/keyresult";
import {KeyResultsDataService} from "../../../services/key-results-data-service.service";
import {KeyResultListDataSource} from "../../../data-sources/keyresult-list-datasource";
import {KeyResultEditComponent} from "../keyresults-edit/keyresult-edit.component";
import { FormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-key-result',
    templateUrl: './key-result-list.component.html',
    styleUrls: ['./key-result-list.component.scss'],
    standalone: true,
    imports: [MatButton, MatFormField, MatLabel, MatInput, MatTable, MatSort, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatSortHeader, MatCellDef, MatCell, FormsModule, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatPaginator]
})
export class KeyResultListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('input') input!: ElementRef;
  @ViewChild(MatTable) table!: MatTable<KeyResult>;

  dataSource !: KeyResultListDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name', 'description', 'delete'];

  messages: MessageService = new MessageService();
  total_data_length: number = 10;
  pageEvent: PageEvent = new PageEvent();

  constructor(
    private objectiveService: KeyResultsDataService,
    private dialog: MatDialog,
  ) {
    this.dataSource = new KeyResultListDataSource(this.objectiveService);
    this.pageEvent.previousPageIndex = -1;
    this.pageEvent.pageIndex = 0;
  }

  ngOnInit(): void {
    this.dataSource = new KeyResultListDataSource(this.objectiveService);
    this.dataSource.getKeyResults();
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
      .subscribe(
        event => {
          // this.messages.log('Verifying that event is of Page Event type is  ' + this.isPageEvent(event));
          this.messages.log('Objective-List-Component', 'Page event data is ' + JSON.stringify(event));

          const previousPageIndex = this.pageEvent.previousPageIndex;
          if(this.isPageEvent(event)) {
            event.previousPageIndex=this.pageEvent.previousPageIndex;
          }


          // let myPageEvent : PageEvent = this.getPageEvent();

          this.dataSource.getKeyResults(
            this.paginator.pageSize,
            previousPageIndex,
            this.paginator.pageIndex,
            this.sort.active,
            this.sort.direction
          )

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

    let dialogRef !: MatDialogRef<KeyResult>;

    if (record_id) {
      this.dataSource.getKeyResult(record_id).subscribe(
        o => {
          dialogConfig.data = {
            name: o.name,
            description: o.description,
          };
          dialogRef = this.dialog.open(KeyResultEditComponent, dialogConfig)

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
      dialogRef = this.dialog.open(KeyResultEditComponent, dialogConfig);

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
    this.dataSource.addKeyResult({name: name, description: description} as KeyResult);

    // this.pageEvent.pageIndex;
    // this.pageEvent.length=this.pageEvent.length;
    // this.pageEvent.pageSize=this.pageEvent.pageSize;

    this.paginator.page.emit(this.pageEvent);

  }

  update(
    objective: KeyResult
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
    this.dataSource.updateKeyResult(objective);
    // this.table.renderRows();
  }

  // TODO Implement back the page refresh and delete functionality for the KeyResult list.
  delete(id: number): void {
    // this.dataSource.data = this.dataSource.data.filter(h => h !== objective);
    // console.log('Before deleting key-results-list in data source');
    this.dataSource.deleteKeyResult(id);
    // this.table.renderRows();

    // this.pageEvent.length=this.pageEvent.length;
    // this.pageEvent.pageSize=this.pageEvent.pageSize;

    this.paginator.page.emit(this.pageEvent);

  }

  search(name: string): void {
    name = name.trim();
    if (!name) {
      this.dataSource.getKeyResults();
      return;
    }
    this.dataSource.searchKeyResult(name);

  }

  isPageEvent(event: Sort | PageEvent): event is PageEvent {
    return (event as PageEvent).length !== undefined;
  }

  isSortEvent(event: Sort | PageEvent): event is Sort {
    return (event as Sort).direction !== undefined;
  }

  getPageEvent () : PageEvent {
    const pageEvent = new PageEvent();

    return pageEvent;
  }

}
