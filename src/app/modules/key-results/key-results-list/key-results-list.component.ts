import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {KeyResult} from '../../../data-objects/key-result';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {KeyResultDataService} from "../../../services/key-results-data-service.service";
import {KeyResultsEditComponent} from "../key-results-edit/key-results-edit.component";

@Component({
  selector: 'app-key-results',
  templateUrl: './key-results-list.component.html',
  styleUrls: ['./key-results-list.component.scss']
})
export class KeyResultsListComponent implements OnInit, AfterViewInit  {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) matTable!: MatTable<KeyResult>;

  dataSource : MatTableDataSource<KeyResult> = new MatTableDataSource<KeyResult>();

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name', 'description', 'delete'];

  constructor(
    private keyresultService : KeyResultDataService,
    private dialog: MatDialog,
  ) {
    // this.dataSource = myDataSource;
  }

  ngOnInit() :void {
    // this.matTable.dataSource=this.dataSource;
    // this.dataSource = new
    // this.dataSource = ;
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.matTable.dataSource = this.dataSource;
    this.getKeyResults();
  }

  getKeyResults(): void {
    // console.log('Before getting keyresult-list in data source');

    this.keyresultService.getKeyResults()
      .subscribe(keyresults => this.dataSource.data = keyresults);

    this.matTable.renderRows();
  }

  openDialog() {

    const dialogConfig = new MatDialogConfig();
    var name = '';
    var description = '';

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      name: 'Enter name here',
      description: 'Enter description here',
    };

    this.dialog.open(KeyResultsEditComponent, dialogConfig);

    const dialogRef = this.dialog.open(KeyResultsEditComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        console.log('Dialog output:', data);
        this.add(data.name, data.description);
      }
    );


  }

  add(
    name: string,
    description: string
  ): void
  {
    // console.log('Before Adding keyresult-list in data source');
    name = name.trim();
    if (!name) { return; }
    description = description.trim();
    if (!description) { return; }
    this.keyresultService.addKeyResult({ name: name, description:description } as KeyResult)
      .subscribe(keyresult => {
        this.dataSource.data.push(keyresult);
      });

    this.getKeyResults();
  }

  // TODO Implement back the page refresh and delete functionality for the KeyResults list.
  delete(id: number): void {
    // this.dataSource.data = this.dataSource.data.filter(h => h !== keyresult);
    // console.log('Before deleting keyresult-list in data source');
    this.keyresultService.deleteKeyResult(id)
      .subscribe(keyresult => {
        this.dataSource.data = this.dataSource.data.filter(h => h.id !== id);
      });
  }

}
