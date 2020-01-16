import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ThreeviewerComponent } from './threeviewer/threeviewer.component';
import { MoldeojsViewComponent } from './moldeojs-view/moldeojs-view.component';
import { RouterModule, Routes } from '@angular/router';

import { AppBoostrapModule } from './app-boostrap/app-boostrap.module';

import { ConsoleService } from "./console.service";
import { ViewService } from "./view.service";

import { JsonService } from './json.service';
import { FileAdminService } from './fileadmin.service';
import { PageNotFoundComponent } from './page-not-found.component';

const appRoutes: Routes = [
  /*{ path: '', component: AppComponent, pathMatch: 'full' },*/
  { path: 'moldeojs', component: PageNotFoundComponent },
  { path: '**', component: PageNotFoundComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    ThreeviewerComponent,
    MoldeojsViewComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppBoostrapModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [ViewService,ConsoleService, JsonService, FileAdminService ],
  entryComponents: [MoldeojsViewComponent,PageNotFoundComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
