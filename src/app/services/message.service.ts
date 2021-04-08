import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messages: string[] = [];

  private add(message: string) {
    this.messages.push(message);
  }

  log(message: string) {
    this.messages.push(message);

    // TODO Add logging levels or find an Angular logging service
    console.log(message);
  }

  clear() {
    this.messages = [];
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
