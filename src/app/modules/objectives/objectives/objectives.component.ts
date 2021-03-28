import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Objective} from '../objective';
import {ObjectivesDataService} from '../../../services/objectives-data-service.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable} from '@angular/material/table';
import {ObjectiveListDataSource} from '../../../data-sources/objective-list-datasource';

@Component({
  selector: 'app-objectives',
  templateUrl: './objectives.component.html',
  styleUrls: ['./objectives.component.scss']
})
export class ObjectivesComponent implements OnInit,  AfterViewInit  {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Objective>;
  dataSource : ObjectiveListDataSource;
  objectiveService : ObjectivesDataService;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name', 'details', 'delete' ];

  constructor(private dataService : ObjectivesDataService) {
    this.dataSource = new ObjectiveListDataSource(dataService);
    this.objectiveService = dataService;
  }


  ngOnInit() {
    this.dataSource.getObjectives();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.objectiveService.addObjective({ name } as Objective)
      .subscribe(objective => {
        this.dataSource.data.push(objective);
      });

    this.dataSource.getObjectives();
  }

  // TODO Implement back the page refresh and delete functionality for the Objectives list.
  delete(objective: Objective): void {
    console.log('Objective Id is ' + objective.id);
    console.log('Objective array length is  ' + this.dataSource.data.length);
    this.dataSource.data = this.dataSource.data.filter(h => h !== objective);
    this.objectiveService.deleteObjective(objective.id).subscribe();
  }

}
