import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Injectable,  Inject} from '@angular/core';

import { AppComponent } from './app.component';
import { ThreeviewerComponent } from './threeviewer/threeviewer.component';
import { MoldeojsViewComponent } from './moldeojs-view/moldeojs-view.component';
import { RouterModule, Routes } from '@angular/router';

import { AppBoostrapModule } from './app-boostrap/app-boostrap.module';
import { AlertModule } from 'ngx-bootstrap';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';


import { MoldeojsInterfaceComponent } from './moldeojs-interface/moldeojs-interface.component';
//Moldeo Components
import { MoControl } from './moldeojs-interface/mo-control/mo-control.component';
import { MoDefaultComponent } from './moldeojs-interface/mo-objects/mo-default/mo-default.component';
import { MoErase } from './moldeojs-interface/mo-objects/mo-erase.component';
import { MoIcon } from './moldeojs-interface/mo-objects/mo-icon.component';

//Services
import { ConnectionsService } from './moldeojs-interface/services/connections.service';
import { ParamsService } from './moldeojs-interface/services/params.service';
import { MoConfigService } from './moldeojs-interface/services/mo-config.service';
import { MoControlService } from './moldeojs-interface/services/mo-control.service';
//Directives - Pipes
import { DraggableDirective } from './moldeojs-interface/draggable.directive';


import { ConsoleService } from "./console.service";
import { ViewService } from "./view.service";

import { JsonService } from './json.service';
import { FileAdminService } from './fileadmin.service';
import { PageNotFoundComponent } from './page-not-found.component';

//import { ElectronService } from './providers/electron.service';
import { CollaborativeService, SocketOne } from './collaborative.service';

const appRoutes: Routes = [
  /*{ path: '', component: AppComponent, pathMatch: 'full' },*/
  { path: 'moldeojs', component: PageNotFoundComponent },
  { path: '**', component: PageNotFoundComponent},
];

import { SocketIoModule, SocketIoConfig, Socket } from 'ngx-socket-io';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faSquare, faCheckSquare, faCamera,
  faGlobeAmericas,faVideo, faInfo, faShare, faDownload } from '@fortawesome/free-solid-svg-icons';
import { faSquare as farSquare, faCheckSquare as farCheckSquare } from '@fortawesome/free-regular-svg-icons';
import { faStackOverflow, faGithub, faMedium } from '@fortawesome/free-brands-svg-icons';

//const config: SocketIoConfig = { url: 'https://speak.moldeo.org:8989', options: {rejectUnauthorized: false} };
//const config: SocketIoConfig = { url: 'http://localhost:8988', options: {rejectUnauthorized: false} };



@NgModule({
  declarations: [
    AppComponent,
    ThreeviewerComponent,
    MoldeojsViewComponent,
    PageNotFoundComponent,
    MoldeojsInterfaceComponent,
    MoControl,
    DraggableDirective,
    MoDefaultComponent,
    MoErase,
    MoIcon
  ],
  imports: [
    BrowserAnimationsModule,
    AlertModule.forRoot(),
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    ModalModule.forRoot(),
    PopoverModule.forRoot(),
    BrowserModule,
    FontAwesomeModule,
    AppBoostrapModule,
    FormsModule,
    HttpClientModule,
    SocketIoModule,
    TooltipModule.forRoot(),
    /*SocketIoModule.forRoot(SocketIoConfig),*/
    /*SocketIoModule.forRoot(SocketIoConfig),*/
RouterModule.forRoot(appRoutes, { relativeLinkResolution: 'legacy' })
  ],
  providers: [
    Title,
    ViewService,
    ConsoleService,
    JsonService,
    FileAdminService,
    ConnectionsService,
    ParamsService,
    MoConfigService,
    MoControlService,
    CollaborativeService,
    SocketOne
  ],
  entryComponents: [
    MoldeojsViewComponent,
    PageNotFoundComponent,
    MoControl,
    MoDefaultComponent,
    MoErase,
    MoIcon
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private library: FaIconLibrary) {
    library.addIcons(faSquare, faCheckSquare, farSquare,
      farCheckSquare, faStackOverflow, faGithub,
      faMedium, faCamera, faGlobeAmericas,
      faVideo, faInfo, faShare, faDownload);
  }
}
