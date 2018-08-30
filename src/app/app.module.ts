import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule, Injectable } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { ThreeviewerComponent } from './threeviewer/threeviewer.component';
import { MoldeojsViewComponent } from './moldeojs-view/moldeojs-view.component';
import { RouterModule, Routes } from '@angular/router';

import { AppBoostrapModule } from './app-boostrap/app-boostrap.module';

import { ConsoleService } from "./console.service";
import { ViewService } from "./view.service";

import { JsonService } from './json.service';
import { FileAdminService } from './fileadmin.service';

import {CollaborativeService} from './collaborative.service';

const appRoutes: Routes = [
  //{ path: 'about', component: AboutComponent },
];

import { SocketIoModule, SocketIoConfig} from 'ng-socket-io';


//const config: SocketIoConfig = { url: 'https://collaborative.moldeo.org:8988', options: {rejectUnauthorized: false} };
const config: SocketIoConfig = { url: 'http://localhost:8988', options: {rejectUnauthorized: false} };

@NgModule({
  declarations: [
    AppComponent,
    ThreeviewerComponent,
    MoldeojsViewComponent,
  ],
  imports: [
    BrowserModule,
    AppBoostrapModule,
    FormsModule,
    HttpModule,
    SocketIoModule.forRoot(config),
    RouterModule.forRoot(appRoutes)
  ],
  providers: [Title,ViewService,ConsoleService, JsonService, FileAdminService, CollaborativeService ],
  entryComponents: [MoldeojsViewComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
