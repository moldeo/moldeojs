import * as THREE from "three";
import * as math  from "mathjs";
//var math = require("mathjs");

import { moAbstract } from "./mo-abstract";
import { NULL, MOint, MOuint, MOlong, MOulong, MOdouble, MOfloat } from "./mo-types";
import { moResource } from "./mo-resource";
import { moMoldeoObject } from "./mo-moldeo-object";
import { moText } from "./mo-text";
import { moConfig } from "./mo-config";
import { moData } from "./mo-value";
import { moParams, moParam } from "./mo-param";
import { moInlet } from "./mo-connectors";
import {
  moTimer, moGetTicks, moGetTicksAbsolute,
  moTimerAbsolute, moTimerState, moContinueTimer,
  moSetDuration, moStopTimer, moIsTimerPaused,
  moIsTimerPlaying, moIsTimerStarted, moIsTimerStopped
} from "./mo-timer";

import Vector = THREE.Vector;
import Vector2 = THREE.Vector2;
import Vector3 = THREE.Vector3;
import Vector4 = THREE.Vector4;
import Matrix = THREE.Matrix;
import Matrix3 = THREE.Matrix3;
import Matrix4 = THREE.Matrix4;

export type moVector = Vector;
export type moMatrix = Matrix;

export class moVector2 extends Vector2 {};
export class moVector2f extends Vector2 {};
export class moVector3f extends Vector3 {};
export class moVector4f extends Vector4 {};
export class moVector2i extends Vector2 {};
export class moVector3i extends Vector3 {};
export class moVector4i extends Vector4 {};
export class moMatrix3f extends Matrix3 {};
export class moMatrix4f extends Matrix4 {};

export type moVector2fArray = moVector2f[];
export type moVector3fArray = moVector3f[];
export type moVector4fArray = moVector4f[];
export type moVector3iArray = moVector3i[];
export type moMatrix3fArray = moMatrix3f[];



function sin( val : number ) : number {
  return Math.sin(val);
}

function cos( val : number ) : number {
  return Math.cos(val);
}
/*
function abs(val: number): number {
  return Math.abs(val);
}
*/
export class moMathVariable {
  /**
     * Almacena el nombre de la variable.
	 */
    m_name : moText = "";
	/**
     * Almacena el valor actual de la variable.
	 */
    m_value : MOdouble = 0.0;

    /**
    *   External param data retreival, name must match!!!!
    */
    m_pParam : moParam = null;

    /**
    *   External inlet data retreival, name must match!!!!
    */
    m_pInlet: moInlet = null;

  constructor( p_variable : moParam );
  constructor( p_variable: moInlet);
  constructor( p_variable : moText, p_value0: MOdouble );
  constructor( p_variable : any , p_value0 : MOdouble = 0.0) {
    if (typeof p_variable == "object") {
      if ( p_variable.constructor ) {
        if (p_variable.constructor.name) {
          if (p_variable.constructor.name == "moParam") {
            this.SetParam(p_variable);
          }
          else if (p_variable.constructor.name == "moInlet") {
            this.SetInlet(p_variable);
          }
        }
      }
    } else {
      this.m_name = p_variable;
      this.m_value = p_value0;
      this.m_pInlet = null;
      this.m_pParam = null;
    }
  }

  SetParam(p_Param: moParam): void {
    this.m_pParam = p_Param;
    this.m_name = p_Param.GetParamDefinition().GetName();
    this.GetValue();
  }
  SetInlet(p_Inlet: moInlet): void {
    this.m_pInlet = p_Inlet;
    this.m_name = p_Inlet.GetConnectorLabelName();
    this.GetValue();
  }

	/**
     * Asigna el nombre de la variable.
	 * @param p_name el nuevo nombre de la variable.
	 */
	SetName( p_name: moText) : void { this.m_name = p_name; }
	/**
     * Devuelve el nombre de la variable.
	 * @return El nombre de la variable.
	 */
	GetName() : moText { return this.m_name; }

	/**
     * Asigna un nuevo valor flotante para la variable.
	 * @param p_name el nuevo valor de la variable.
	 */
  SetValue(p_value: MOdouble): void {
    this.m_value = p_value;
  }
	/**
     * Devuelve el valor actual de la variable.
	 * @return El valor de la variable.
	 */
  GetValue(): MOdouble {
    if (this.m_pParam) {
      var pData: moData = this.m_pParam.GetData();
      if (pData) {
        this.m_value = pData.Double();
      } else {
        console.error("moMathVariable: no data?", this, this.m_pParam);
      }
    } else if (this.m_pInlet) {
      //console.log("moMathVariable GetValue", this.m_pInlet);
      var pData: moData = this.m_pInlet.GetData();
      //console.log("moMathVariable GetValue data", pData);
      if (pData) {
        //console.log("moMathVariable GetValue data.Double()", pData.Double());
        this.m_value = pData.Double();
      } else {
        console.error("moMathVariable: no data?", this, this.m_pInlet);
      }
    }

    return this.m_value;
  }

	/**
     * Devuelve el puntero a la variable privada de la clase que almacena el valor flotante actual.
	 * @return El puntero a la variable 'm_value'.
	 * @see m_value
	 */
  GetValuePointer() : void {
    return null;
  }


}
export type moMathVariables = moMathVariable[];


/**
 * Clase de creación de variables. Las variables son clasificadas en dos tipos:
 * variables propiamente dichas, como t en la expresión sin(t), y parámetrso,
 * que se identifican con el prefijo "_": sin(_w * t). Esta distinción, que para
 * muParser es totalmente arbitraria, permite distingir entre valores que son
 * actualizados con mucha frecuencia (variables) y aquellos que solo cambian
 * unas pocas veces (parámetros).
 */
export class moMathVariableFactory extends moAbstract
{

  m_pParArray : moMathVariables = [];
  m_pVarArray : moMathVariables = [];
  m_pVarMap: any = {};

	/**
     * Constructor donde se especifican las listas de parámetros y variables.
	 * @param p_pParArray puntero a la lista de variables.
	 * @param p_pParArray puntero a la lista de parámetros.
	 */
	constructor( p_pParArray : moMathVariables, p_pVarArray : moMathVariables, p_pVarMap : any )
	{
    super();
		this.m_pParArray = p_pParArray;
		this.m_pVarArray = p_pVarArray;
    this.m_pVarMap = p_pVarMap;
	}

	/**
     * Agrega una nueva variable o parámetro (uno u otro dependiendo de la presencia
	 * del prefijo "_" en el nombre.
	 * @param p_pNewName nombre de la variable.
	 * @return puntero double donde se almacena el valor de la variable.
   * MOdouble*  CreateNewVariable( p_pNewName : moText )
   */

    CreateNewVariable( p_pNewName : moText ) : MOdouble
	{
		var pvar : moMathVariable = new moMathVariable(p_pNewName, 0.0);
    //console.log("CreateNewVariable:",p_pNewName);
		if (p_pNewName.length>0) {
			if (p_pNewName[0] == '_') this.m_pParArray.push(pvar); // Agregando parámetro.
      else this.m_pVarArray.push(pvar);                      // Agregando variable.
      this.m_pVarMap[""+p_pNewName] = pvar;

		}

    //return pvar.GetValuePointer();
    return pvar.GetValue();
	}

  CreateVariables( p_Node: any ) : any {

    //create all variables that exist in function? so we can assign them to Parameters
    // and others...
    var self = this;
    try {
      //console.log( p_Node.type);
      if (p_Node.type=='SymbolNode') {
        self.CreateNewVariable( p_Node.name );
      } else {
        p_Node.forEach(function (node, path, parent) {
          switch (node.type) {
            case 'FunctionNode':
              //console.log(path,node.type, node.fn);
              self.CreateVariables(node);
              break
            case 'OperatorNode':
              //console.log(path, node.type, node.op);
              self.CreateVariables(node);
              break
            case 'ConstantNode':
              //console.log(path, node.type, node.value);
              break
            case 'SymbolNode':
              //console.log(path, node.type, node.name);
              if (path!="fn") {
                /*console.log(path, node.type, node.name)*/
                self.CreateNewVariable( node.name );
              }
              break
            case 'ParenthesisNode':
              //console.log(path,node.type, node.fn);
              self.CreateVariables(node);
              break
            default:
              console.log(node.type)
          }
        });
      }

    }
    catch(error) {
      console.log( self, error );
    }

    /*var filtered = p_Node.filter(function (node) {
      //node.isSymbolNode && node.name == 'x';
      console.log(node);
      if (node.isSymbolNode) {
        return true;
      }
      return false;
    });
    console.log("filtered:", filtered);
    for (var i = 0; i < filtered.length; i++){
      var node = filtered[i];
      console.log("node or var: ", node.name, node);
      this.CreateNewVariable( node.name );
    }*/
    return this.m_pVarMap;

  }

  ToScope(): any {
    var scope : any = {};
    for (let i = 0; i < this.m_pVarArray.length; i++){
      let Var: moMathVariable = this.m_pVarArray[i];
      scope[""+Var.GetName()] = Var.GetValue();
    }
    return scope;
  }


}


export class moMathFunction extends moAbstract {

  m_VarFactory: moMathVariableFactory;
  m_Expression : moText = "";
  m_isNumber: boolean = false;
  m_EmptyName: moText = "";
  m_Variables: moMathVariables = [];
  m_Variables_Map: any = {};
  m_Parameters: moMathVariables = [];
  m_pConfig: moConfig = null;
  m_pMOB: moMoldeoObject = null;
  m_LastEval : MOdouble = 0.0;
  m_Scope: any = {};

  constructor()
  {
    super();

  }

  Init(p_expr: moText = "", p_mob: moMoldeoObject = undefined ) : boolean {
    this.m_Expression = p_expr;
    this.m_pMOB = p_mob;
    return true;
  }

  GetExpression(): moText {
    return this.m_Expression;
  }
  OnFuncEval(): MOdouble {
    return 0.0;
  }

  Eval(): MOdouble {

    var num : MOint = this.m_Variables.length;

    if (num>0) {
        for (var i = 0; i < num; i++) {
            if (this.m_Variables[i]) {
                /// Values are updated from params and custom inlets
                this.m_Variables[i].GetValue();
            }
        }
    }


    return this.OnFuncEval();
  }

}

export class moParserFunction extends moMathFunction {

  m_Parser: any = {};
  m_ParserNode: any = {};
  m_ParserCode: any = {};

  constructor()
  {
    super();
  }

  Init( p_Expression: moText, p_pMOB: moMoldeoObject = undefined ) : boolean {
    this.m_pMOB = p_pMOB;
    if (this.m_pMOB) this.m_pConfig = this.m_pMOB.GetConfig();
    //this.m_Parser = new math.parser();

    if (this.m_VarFactory==undefined)
      this.m_VarFactory =
        new moMathVariableFactory( this.m_Parameters, this.m_Variables, this.m_Variables_Map);
/*
    if (pParser) {
        pParser.SetVarFactory(AddParserVariableFunction, pVarFactory);
*/

    this.m_isNumber = !isNaN(Number(""+p_Expression));
    //console.log("isNumber?",p_Expression,"=>", this.m_isNumber);

    this.AddMathFunctions();
    this.AddMathConstants();

    this.m_Expression = p_Expression;

    if (this.m_isNumber)
      return true;

    try {
      //Parser.parse(this.m_Expression);
      //Parser.compile();
      this.m_ParserNode = math.parse("" + this.m_Expression);
      //console.log("moParserFunction:Init > m_ParserNode:", this.m_ParserNode, this.m_Expression);
      this.m_VarFactory.CreateVariables( this.m_ParserNode );
      this.m_ParserCode = this.m_ParserNode.compile();
    }
    catch (msgerror) {
      /*
        moText msgexpr = (char*)Exc.GetExpr().c_str();
        moText msgerror = (char*)Exc.GetMsg().c_str();
        moText mobname = "undefined MOB";
        MODebug2->Error( mobname + moText(" > ") + (moText)msgexpr + moText(":") + (moText)msgerror );
        delete pVarFactory;
        return false;
        */
        var mobname : moText = "undefined MOB";
        if (p_pMOB) mobname = p_pMOB.GetLabelName();
        this.MODebug2.Error( mobname + " > " + ":" + msgerror );
        console.log("this.m_VarFactory:",this.m_VarFactory);
    }

        //delete pVarFactory;
/*
    }
*/
    ///ASSOCIATE VARIABLES WITH CONFIG PARAMETERS....

    if ( this.m_pConfig ) {
        var Params : moParams =  this.m_pConfig.GetParams();
        for( var i=0; i < this.m_Variables.length; i++ ) {

            var pVariable : moMathVariable = this.m_Variables[i];



            ///check for variable in config parameters
            for( var p=0; p<Params.length; p++  ) {

                var param : moParam = Params[p];

                if ( param.GetParamDefinition().GetName() == pVariable.GetName() ) {

                    ///assign pointer to variable!!!!
                    /*
                  this.MODebug2.Log(moText("moParserFunction::Init > assigning variable [")
                    + pVariable ->GetName() + moText(" to parameter with the same name."));
                    */

                    pVariable.SetParam( param );
                    //console.log("assigned param to variable:", pVariable);

                }

            }

            ///check for variable in object inlets
            for( var m=0; m<this.m_pMOB.GetInlets().length; m++ ) {

              var pInlet  : moInlet = this.m_pMOB.GetInlets()[m];

              if ( pInlet.GetConnectorLabelName() == pVariable.GetName() ) {
                  /*MODebug2->Log( moText("moParserFunction::Init > assigning variable [")
                  + pVariable->GetName() + moText("] to inlet with the same name. Inlet index is: " + IntToStr(m)) );*/
                pVariable.SetInlet(pInlet);
                //console.log("assigned inlet to variable:", pVariable);
              }


            }

            if (pVariable.m_pInlet == undefined && pVariable.m_pParam == undefined) {
              console.log("Error with variable:", pVariable, this );
            }

        }

    }

    this.m_Scope = this.m_VarFactory.ToScope();

//    console.log("Init Variables: ", this.m_Variables, this.m_Variables_Map, this.m_VarFactory, this.m_Scope );
	  return this.CheckVariables();
  }

  AddMathFunctions() : any {

    var customFunctions = {
      UnitRandom: function(seed) {
        return Math.random();
      },
      SymmetricRandom: function(seed) {
        return Math.random()-0.5;
      },
      IntervalRandom: function(seed) {
        return Math.random();
      }
    };
    this.m_Scope = Object.assign(this.m_Scope, customFunctions);
    return customFunctions;
/*
    math.import(customFunctions, {
      override: true
    });
  */
  }

  AddMathConstants() : any {
    var customConstants = {
      PI: 3.14,
      TWO_PI: 6.0
    };
    this.m_Scope = Object.assign(this.m_Scope,  customConstants);
    return customConstants;
  }

  CheckVariables(): boolean {
    var iNumVar : MOint;
    var nvar: MOint;
    var npar : MOint;
    nvar = npar = 0;
/*
    mu::Parser* pParser = (mu::Parser*) m_pParser;

    if (pParser) {

        mu::varmap_type variables = pParser->GetVar();
        iNumVar = (int)variables.size();
        mu::varmap_type::const_iterator item = variables.begin();

        for (; item!=variables.end(); ++item)
        {
            if (item->first[0] == '_')
            {
                npar++;
            }
            else
            {
                nvar++;
            }
        }

        if (nvar != (MOint)m_Variables.Count())
        {
            MODebug2->Push("Error in number of parser variables.");
            return false;
        }

        if (npar != (MOint)m_Parameters.Count())
        {
            MODebug2->Push("Error in number of parser parameters.");
            return false;
        }
        return true;
    }
    return false;
    */
    return true;
  }

  OnFuncEval(): MOdouble {

    if (this.m_isNumber) {
      this.m_LastEval = Number(this.m_Expression);
      return this.m_LastEval;
    }

    var sss: string = "";
    //var rep : string = (this.m_Expression+"").replace(/time/g, "_this_fun_.time");
    //var _this_fun_ = this.m_Variables_str;
    //_this_fun_["time"] = 0.5;
    //var time = moGetTicks() / 1000.0;
    if (this.m_ParserCode) {
      try {
        this.m_Scope = this.m_VarFactory.ToScope();
        //console.log("Eval Parser with variables", this.m_Expression, this.m_Variables_Map, this.m_Scope );

        this.m_LastEval = this.m_ParserCode.evaluate(this.m_Scope);
        return this.m_LastEval;
      } catch (err) {
        //console.error("parser error", err, this.m_Scope, this);
        return err;
      }
    }


    var sf = "(() => {"
      //+ " var time = 1.0/1000.0;"
      + " var result = 0.0;"
      + " result = " + this.m_Expression + ";"
      + " return result;"
      + "})();";

    try {
      sss = " this.m_LastEval = " + sf;
      eval("" + sss);
      //console.log("sss:", sss);
    } catch (err) {

      //console.error("moParserFunction.OnFuncEval", err.message);
      //console.log("OnFuncEval", this.OnFuncEval.prototype);
/*
      var startvar = 0;
      var endfunc = err.message.indexOf("is not a function");
      var endvar = err.message.indexOf("is not defined");

      console.log("startvar", startvar, "endfunc", endfunc, "endvar", endvar);
      if (endvar>0) {
        var errvar = err.message.substring(startvar, endvar).trim();
        this.MODebug2.Message("[" + errvar + "] will be set to 0.0 to prevent errors.");
        eval("window." + errvar + " = 0.0; ");
      }
      if (endfunc>0) {
        var errfun = err.message.substring(startvar, endfunc).trim();
        console.log("[" + errfun + "]", "will be set to function(x) { return x; } to prevent errors.");
        eval("window." + errfun + " = function(x) { return (x);}; ");
      }
      */
    }
    return this.m_LastEval;
  }

}

function BuiltInMathFunctionFactory( p_expr : moText ) : moMathFunction {
  //if (p_expr == "CubicInterpolant(x)") return new moCubicInterpolant();
	//if (p_expr == "TautInterpolant(x)") return new moTautInterpolant();
  return null;
}


export type moMathFunctions = moMathFunction[];
export type moMathFunctionArray = moMathFunctions;

export class moMathManager extends moResource {

  m_functions : moMathFunctionArray = [];
  m_functions_str: any = {};
  math : any;
  
  constructor() {
    super();
    this.SetName("_mathmanager_");
    this.math = math;
  }

  GetFunction( p_idx : MOint ) : moMathFunction {
    return this.m_functions[p_idx];
  }

  GetFunctionIdx(p_expr: moText) : MOint {
    if (this.m_functions_str[""+p_expr]) {
      return this.m_functions_str[""+p_expr];
    }
    return -1;
  }

  AddFunction(p_expr: moText,
    p_force_new: boolean = false,
    p_pMOB: moMoldeoObject = undefined): MOint {

    var idx: MOint = -1;
    var pre_idx_mob: string = "";

    if ( p_expr.length == 0 || p_expr==undefined ) {
          //return idx;
      p_expr = "0";//default empty to zero function constants
    }

    if (p_pMOB) pre_idx_mob = "__" + p_pMOB.GetLabelName() + "__";

    if (!p_force_new)
    {

      idx = this.GetFunctionIdx(pre_idx_mob+p_expr);
      if (-1 < idx) return idx; // La función ya existe.
    }

    var p_math_fun : moMathFunction;
    var p_parser_fun : moParserFunction; // Función de parseado.

    p_math_fun = BuiltInMathFunctionFactory(p_expr);
    if (p_math_fun == undefined)
    {
      p_parser_fun = new moParserFunction();
      p_math_fun = p_parser_fun;
    }

    if (p_math_fun != undefined)
    {
        var res : boolean = p_math_fun.Init( p_expr, p_pMOB );
      if (res)
      {
        this.m_functions.push(p_math_fun);
        this.m_functions_str[pre_idx_mob + p_expr] = p_math_fun;
        //console.log("moMathManager.AddFunction", p_math_fun, p_parser_fun, this.m_functions_str, this.m_functions);
        //double check = p_math_fun->Eval(0);
        return this.m_functions.length - 1;
      }
      else
      {
        p_math_fun = null;
        return -1;
      }
    }
    else return -1;
  }

};
