import { Injectable } from '@angular/core';

@Injectable()
export class ParamsService {

  constructor() { }

  public createParam(name:string, values:any): any{
    return [name, values];
  }

}
