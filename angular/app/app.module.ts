import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppMoldeo }   from './app.moldeo';
@NgModule({
  imports:      [ BrowserModule ],
  declarations: [ AppComponent,AppMoldeo ],
  bootstrap:    [ AppComponent,AppMoldeo ]
})
export class AppModule { }
