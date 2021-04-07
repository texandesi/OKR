import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {KeyResultsComponent} from './modules/key-results/key-results.component';
import {KpisComponent} from './modules/kpis/kpi-list/kpis.component';
import {DashboardComponent} from './modules/dashboard/dashboard.component';
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
import { ObjectiveEditComponent } from './modules/objectives/objective-edit/objective-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    KeyResultsComponent,
    KpisComponent,
    DashboardComponent,
    ComposeMessageComponent,
    PageNotFoundComponent,
    ObjectiveEditComponent,
  ],
  imports: [
    AppRoutingModule,
    AuthModule,
    BrowserAnimationsModule,
    BrowserModule,
    DashboardModule,
    FormsModule,
    FormsModule,
    HttpClientModule,
    KeyResultsModule,
    KpisModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    ObjectivesModule,
    ReactiveFormsModule,

  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [ObjectiveEditComponent]
})
export class AppModule { }


