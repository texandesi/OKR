import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppNavComponent } from './app-nav/app-nav.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [AppNavComponent, RouterOutlet]
})
export class AppComponent {
  title = 'Techniti OKR Management';
}
