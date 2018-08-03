import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';

import { AppComponent } from './app.component';
import { ThreeviewerComponent } from './threeviewer/threeviewer.component';
import { MoldeojsViewComponent } from './moldeojs-view/moldeojs-view.component';
import { RouterModule, Routes } from '@angular/router';

import { AppBoostrapModule } from './app-boostrap/app-boostrap.module';

import { ConsoleService } from "./console.service";
import { ViewService } from "./view.service";

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
    AppBoostrapModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [ViewService,ConsoleService, JsonService, FileAdminService ],
  entryComponents: [AppComponent, MoldeojsViewComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private injector: Injector) {
    const el = createCustomElement(AppComponent, { injector });
    customElements.define('moldeojs-viewer', el);
  }
  ngDoBootstrap() {}
}
