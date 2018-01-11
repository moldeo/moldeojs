import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { ThreeviewerComponent } from './threeviewer/threeviewer.component';
import { MoldeojsViewComponent } from './moldeojs-view/moldeojs-view.component';
import { RouterModule, Routes } from '@angular/router';

import { ConsoleService } from "./console.service";

import { JsonService } from './json.service';
import { FileAdminService } from './fileadmin.service';

const appRoutes: Routes = [
  //{ path: 'about', component: AboutComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    ThreeviewerComponent,
    MoldeojsViewComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [ConsoleService, JsonService, FileAdminService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
