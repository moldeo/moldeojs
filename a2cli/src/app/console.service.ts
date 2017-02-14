import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import {  BehaviorSubject }    from 'rxjs/BehaviorSubject';
import { Http } from "@angular/http";

import { moConsole } from './mo-console';
import { moResourceManager } from './mo-resource-manager';
import { moIODeviceManager } from './mo-iodevice-manager';



@Injectable()
export class ConsoleService {

  //m_ResourceManager: moResourceManager;
  m_pIODeviceManager: moIODeviceManager;
  m_Console: moConsole;

  private updated = new BehaviorSubject(false);
  updated$ = this.updated.asObservable();

  constructor( private http: Http ) {
    this.m_Console = new moConsole( http  );
    this.m_pIODeviceManager = new moIODeviceManager();
    window["Moldeo"] = {
      "Console": this.m_Console,
      "IODeviceManager": this.m_pIODeviceManager
    };
   }

  Init(options?: any) : boolean {
    if (options["start_loading"] == undefined)
      options["start_loading"] = (result) => {
        this.m_Console.ConsolePlay();
        this.updated.next(true);
      };

    if (options["config_open"] == undefined)
      options["config_open"] = (result) => {
        console.log("Config opened ok.", result);
      };

    if (options["config_loaded"] == undefined)
      options["config_loaded"] = (result) => {
        console.log("Config Loaded! Start Playing!", result);
      };

    if (options["effects_loaded"] == undefined)
      options["effects_loaded"] = (result) => {
        console.log("ALL Effects Loaded!", result);
      };

    if (options["effects_started"] == undefined)
      options["effects_started"] = (result) => {
        console.log("ALL Effects Started!", result);
      };

    var consoled: boolean = this.m_Console.Init(options);
    if (consoled) {
      //console.log("Loading...");
    } else {
      console.error("Something happened");
    }

    return consoled;
  }



}
