import { Injectable } from '@angular/core';
import * as xmljs from "xml-js";

@Injectable()
export class MoConfigService {

  constructor() { }

  loadXML(configtext: string): any {
    let result: any = xmljs.xml2js( configtext, {alwaysArray: true, compact: true, ignoreComment: true, alwaysChildren: false});

    return result;
  }

  createMOJS(moconfig: any): any {
    let mojs: any;
    let moobjects: any = moconfig.nativeElement.children;
    let obJS: any = {
      MOCONFIG: [
        {
          CONFIGPARAMS: [],
          DEFINITION: [{
            _attributes:{
              name: "__console__",
              class: "moConsole"
            }
          }],
          PRECONFIG: [{}],
          UPDATE: [{}],
          _attributes:{
            majorversion: "0",
            minorversion: "0"
          }
        }
      ],
      _declaration: {
        _attributes: { version: "1.0", encoding: "ISO-8859-1"}}
    };
    console.log("Copia: ", obJS);

    return mojs;
  }

  createCFG(moconfig: any): any {

  }
}
