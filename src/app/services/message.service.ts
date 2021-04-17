import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messages: string[] = [];

  private add(message: string) {
    this.messages.push(message);
  }

  log(context: string, message: string) {
    const log_string = context + ' : ' + message;
    this.add(log_string);

    // TODO Add logging levels or find an Angular logging service
    console.log(log_string);
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
