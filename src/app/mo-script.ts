import { moAbstract } from "./mo-abstract";
import { moText } from "./mo-text";
import { moTimer } from "./mo-timer";
import { moFileManager } from "./mo-file-manager";

export class moScript extends moAbstract {

  m_fullscript: moText;
  m_run_selected: moText;
  m_pFileManager: moFileManager;//para leer archivos de configuracion locales y remotos
  Script: any = {
    "moTimer": moTimer
  };
  ScriptParams: any = [];

  constructor() {
    super();
  }

  IsInitialized(): boolean {
    return true;
    /*
    if (this.m_fullscript)
      if (this.m_fullscript.length > 0)
        return true;
    return false;
    */
  }

  Init(): boolean {
    //console.log("moScript::Init");
    return super.Init();
  }

  InitScript(): void {

  }

  CompileFile( strFilename :  moText, callback?: any ) : boolean {
    //load file
    console.log("CompileFile", strFilename);
    if (this.m_pFileManager) {
      this.m_pFileManager.Load(strFilename, false, (res) => {
        console.log("CompileFile > Loaded > name: ", res);
        if (res._body) this.m_fullscript = res._body;
        else this.m_fullscript = res;
        //eval( ""+this.m_fullscript );
        try {
          this._compile.call(this);
          if (callback) callback(res);
        } catch (err) {
          console.error(err);
          if (callback) callback(err);
        }
      } );
    }
    return false;
  }

  _compile() {
    eval("" + this.m_fullscript);
  }

  SelectScriptFunction(fname: moText) {
    this.ScriptParams = [];
    this.m_run_selected = fname;
  }

  RegisterFunction( strFuncName: moText, fun : any ): number {
    return -1;
  }

  RegisterBaseFunction(strFuncName: moText, fun : any) {

  }

  ScriptHasFunction(strScriptName: moText): boolean {
    if (this.Script["" + strScriptName]) {
      return true;
    }
    return false;
  }

  AddFunctionParam(val: any) {
    this.ScriptParams.push(val);
  }



  RunSelectedFunction( nReturns?: number ) : boolean {
    if (this.m_run_selected) {
      if (this.ScriptHasFunction(""+this.m_run_selected)) {
        this.Script[""+this.m_run_selected].apply(this, this.ScriptParams);
      }
    }
    return false;
  }

  CompileBuffer() {

  }

}
