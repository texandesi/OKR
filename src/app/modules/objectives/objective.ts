import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

export class Objective {

  constructor(
    public id: number,
    public name: string,
    public description: string,
    public date?: NgbDateStruct,
  ) {
  }

}
