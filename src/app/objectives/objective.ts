import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

export class Objective {

  constructor(
    public id: number,
    public name: string,
    public power: string,
    public alterEgo?: string,
    public date?: NgbDateStruct,
  ) {
  }

}
