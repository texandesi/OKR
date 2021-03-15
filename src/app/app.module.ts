import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ObjectivesComponent} from './objectives/objectives.component';
import {KeyResultsComponent} from './key-results/key-results.component';
import {KpisComponent} from './kpis/kpis.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { KeyResultsModule } from './key-results/key-results.module';
import { KpisModule } from './kpis/kpis.module';
import { ObjectivesModule } from './objectives/objectives.module';

@NgModule({
  declarations: [
    AppComponent,
    ObjectivesComponent,
    KeyResultsComponent,
    KpisComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    DashboardModule,
    KeyResultsModule,
    KpisModule,
    ObjectivesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
