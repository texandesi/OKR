import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {KeyResultsComponent} from './modules/key-results/key-results.component';
import {KpisComponent} from './modules/kpis/kpis.component';
import {DashboardComponent} from './modules/dashboard/dashboard.component';
import {DashboardModule} from './modules/dashboard/dashboard.module';
import {KeyResultsModule} from './modules/key-results/key-results.module';
import {KpisModule} from './modules/kpis/kpis.module';
import {ObjectivesModule} from './modules/objectives/objectives.module';

import {FormsModule} from '@angular/forms';

import {PageNotFoundComponent} from './modules/page-not-found/page-not-found.component';
import {ComposeMessageComponent} from './modules/compose-message/compose-message.component';

import {AuthModule} from './modules/auth/auth.module';
import {HttpClientInMemoryWebApiModule} from 'angular-in-memory-web-api';
import {InMemoryDataService} from './services/in-memory-data.service';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
  declarations: [
    AppComponent,
    KeyResultsComponent,
    KpisComponent,
    DashboardComponent,
    ComposeMessageComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AuthModule,
    DashboardModule,
    KeyResultsModule,
    KpisModule,
    ObjectivesModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,


    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false }
    ),

    BrowserAnimationsModule,

    MatTableModule,

    MatPaginatorModule,

    MatSortModule


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }


