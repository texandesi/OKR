import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {DashboardModule} from './modules/dashboard/dashboard.module';
import {KeyResultsModule} from './modules/key-results/key-results.module';
import {KpisModule} from './modules/kpis/kpis.module';
import {ObjectivesModule} from './modules/objectives/objectives.module';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AuthModule} from './modules/auth/auth.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import {MatDialogModule} from '@angular/material/dialog';
import {PageNotFoundComponent} from './modules/page-not-found/page-not-found.component';
import {ComposeMessageComponent} from './modules/compose-message/compose-message.component';
import {MatInputModule} from "@angular/material/input";

@NgModule({
  declarations: [
    AppComponent,
    ComposeMessageComponent,
    PageNotFoundComponent,
  ],
  imports: [
    AppRoutingModule,
    AuthModule,
    BrowserAnimationsModule,
    BrowserModule,
    DashboardModule,
    FormsModule,
    HttpClientModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatInputModule,
    ReactiveFormsModule,

    // OKR Modules
    KpisModule,
    KeyResultsModule,
    ObjectivesModule,
    KeyResultsModule,

  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule { }


