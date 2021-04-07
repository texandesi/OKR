import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Objective} from '../../../data-objects/objective';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {ObjectivesDataService} from '../../../services/objectives-data-service.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ObjectiveEditComponent} from '../objective-edit/objective-edit.component';

@Component({
  selector: 'app-objectives',
  templateUrl: './objective-list.component.html',
  styleUrls: ['./objective-list.component.scss']
})
export class ObjectiveListComponent implements OnInit, AfterViewInit  {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) matTable!: MatTable<Objective>;

  dataSource : MatTableDataSource<Objective> = new MatTableDataSource<Objective>();

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name', 'description', 'delete'];

  constructor(
    private objectiveService : ObjectivesDataService,
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
    this.getObjectives();
  }

  getObjectives(): void {
    // console.log('Before getting objective-list in data source');

    this.objectiveService.getObjectives()
      .subscribe(objectives => this.dataSource.data = objectives);

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

    this.dialog.open(ObjectiveEditComponent, dialogConfig);

    const dialogRef = this.dialog.open(ObjectiveEditComponent, dialogConfig);

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
    // console.log('Before Adding objective-list in data source');
    name = name.trim();
    if (!name) { return; }
    description = description.trim();
    if (!description) { return; }
    this.objectiveService.addObjective({ name: name, description:description } as Objective)
      .subscribe(objective => {
        this.dataSource.data.push(objective);
      });

    this.getObjectives();
  }

  // TODO Implement back the page refresh and delete functionality for the Objectives list.
  delete(id: number): void {
    // this.dataSource.data = this.dataSource.data.filter(h => h !== objective);
    // console.log('Before deleting objective-list in data source');
    this.objectiveService.deleteObjective(id)
      .subscribe(objective => {
        this.dataSource.data = this.dataSource.data.filter(h => h.id !== id);
      });
  }

}
