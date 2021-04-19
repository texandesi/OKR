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
import {MatInputModule} from "@angular/material/input";
import {CommonModule} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {LayoutModule} from "@angular/cdk/layout";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatToolbarModule} from "@angular/material/toolbar";

import {PageNotFoundComponent} from './modules/page-not-found/page-not-found.component';
import {ComposeMessageComponent} from './modules/compose-message/compose-message.component';
import {AppNavComponent} from "./app-nav/app-nav.component";
// import {ObjectivesRoutingModule} from "./modules/objectives/objectives-routing.module";

@NgModule({
  declarations: [
    AppComponent,
    AppNavComponent,
    ComposeMessageComponent,
    PageNotFoundComponent,
  ],
  imports: [
    AppRoutingModule,
    AuthModule,
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    LayoutModule,

    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,

    DashboardModule,
    ObjectivesModule,
    ReactiveFormsModule,
    KeyResultsModule,
    KpisModule,
  ],
  exports: [

  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule {


}


