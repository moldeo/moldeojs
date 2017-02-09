
export type moText = moText0 | string | String;

export class moText0 {

  _str: moText;

  Explode(separator: moText): moTextArray {
    var S = new String(this._str);
    //console.log( "S:",S);
    var ta: moTextArray = [];
    var sp : string[] = S.split(""+separator);
    //console.log("str:",this._str," split:", sp);
    for (var idx in sp) {
      var txt: string = sp[idx];
      var motxt: moText = txt;
      ta.push( motxt );
    }
    return ta;
  }

  constructor( str?: any ) {
    this._str = str;
    // = "" + text;
  }

  get length() {
    return this._str.length;
  }

  indexOf(sep: string, num?: number) : number {
    return this._str.indexOf(sep, num);
  }

  lastIndexOf(sep: string) : number {
    return this._str.lastIndexOf(sep);
  }

  substring(a: number, b: number) : string {
    return this._str.substring(a, b);
  }

  substr(a: number, l: number) : string {
    return this._str.substr(a, l);
  }
}


export class moTextHeap {
  array : moText[];
}

export type moTextArray = moText[];
