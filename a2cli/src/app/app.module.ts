


import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Uploader }      from 'angular2-http-file-upload';

import { AppComponent } from './app.component';
import { ThreeviewerComponent } from './threeviewer/threeviewer.component';
import { MoldeojsViewComponent } from './moldeojs-view/moldeojs-view.component';
import { MoldeoControlComponent } from './moldeo-control/moldeo-control.component';
import { ControlProjectContent } from './moldeo-control/control-project-content/control-project-content.component';

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
    HttpModule
  ],
  providers: [Uploader],
  bootstrap: [AppComponent]
})
export class AppModule { }
