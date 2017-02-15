


import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { ThreeviewerComponent } from './threeviewer/threeviewer.component';
import { MoldeojsViewComponent } from './moldeojs-view/moldeojs-view.component';
import { MoldeoControlComponent } from './moldeo-control/moldeo-control.component';
import { ControlProjectContent } from './moldeo-control/control-project-content/control-project-content.component';
import { RouterModule, Routes } from '@angular/router';

import { ConsoleService } from "./console.service";



const appRoutes: Routes = [
  //{ path: 'about', component: AboutComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    ThreeviewerComponent,
    MoldeojsViewComponent,
    MoldeoControlComponent,
    ControlProjectContent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [Uploader, ConsoleService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
