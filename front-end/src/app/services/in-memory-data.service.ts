import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import {Objective} from '../data-objects/objective';


@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const objectives = [
      { id: 11, name: 'Dr Nice' },
      { id: 12, name: 'Narco' },
      { id: 13, name: 'Bombasto' },
      { id: 14, name: 'Celeritas' },
      { id: 15, name: 'Magneta' },
      { id: 16, name: 'RubberMan' },
      { id: 17, name: 'Dynama' },
      { id: 18, name: 'Dr IQ' },
    ];
    return {objectives};
  }

  // Overrides the genId method to ensure that a objective always has an id.
  // If the key-results-list array is empty,
  // the method below returns the initial number (11).
  // if the key-results-list array is not empty, the method below returns the highest
  // objective id + 1.
  genId(objectives: Objective[]): number {
    // @ts-ignore
    return objectives.length > 0 ? Math.max(...objectives.map(objective => objective.id)) + 1 : 11;
  }
}
