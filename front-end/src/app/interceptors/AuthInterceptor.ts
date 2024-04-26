import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler):  Observable<any> {

    // TOOD Fix all the ts-ignore suppressions
  // @ts-ignore
    const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
  request = request.clone({
    setHeaders: {
      Authorization: `Token ${user.accessToken}`
    }
  });
}
return next.handle(request);
}
}
