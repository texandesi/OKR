import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Objective} from '../objective';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {ObjectivesDataService} from '../../../services/objectives-data-service.service';

@Component({
  selector: 'app-objectives',
  templateUrl: './objectives.component.html',
  styleUrls: ['./objectives.component.scss']
})
export class ObjectivesComponent implements OnInit, AfterViewInit  {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) matTable!: MatTable<Objective>;

  dataSource : MatTableDataSource<Objective> = new MatTableDataSource<Objective>();

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name', 'details', 'delete'];

  constructor(private objectiveService : ObjectivesDataService) {
    // this.dataSource = myDataSource;
  }

  ngOnInit() :void {
    // this.matTable.dataSource=this.dataSource;
    // this.dataSource = new
    // this.dataSource = ;
    this.getObjectives();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.matTable.dataSource = this.dataSource;
  }

  getObjectives(): void {
    console.log('Before getting objectives in data source');

    this.objectiveService.getObjectives()
      .subscribe(objectives => this.dataSource.data = objectives);

    console.log('After getting objectives in data source');
  }

  add(name: string): void {
    console.log('Before Adding objectives in data source');
    name = name.trim();
    if (!name) { return; }
    this.objectiveService.addObjective({ name } as Objective)
      .subscribe(objective => {
        this.dataSource.data.push(objective);
      });

    this.getObjectives();

    this.matTable.renderRows();
    // this.matTable.dataSource = this.dataSource;
    // this.matTable.renderRows();

    console.log('After Adding objectives in data source');

  }

  // TODO Implement back the page refresh and delete functionality for the Objectives list.
  delete(id: number): void {
    // this.dataSource.data = this.dataSource.data.filter(h => h !== objective);
    console.log('Before deleting objectives in data source');
    this.objectiveService.deleteObjective(id)
      .subscribe(objective => {
        this.dataSource.data = this.dataSource.data.filter(h => h.id !== id);
      });

    this.matTable.renderRows();
    // this.matTable.dataSource = this.dataSource;
    // this.matTable.renderRows();

    console.log('After deleting objectives in data source');


  }

}
