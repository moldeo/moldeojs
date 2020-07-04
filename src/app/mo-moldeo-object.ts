
import { moAbstract } from "./mo-abstract";
import { moScript } from "./mo-script";
import {
  moMoldeoObjectType, moMoldeoObjectTypeStr,
  moMoldeoObjectTypeToText
} from "./mo-moldeo-object-type.enum";
//export { moMoldeoObjectType, moMoldeoObjectTypeStr,
// moMoldeoObjectTypeToText } from "./mo-moldeo-object-type.enum";
import {
  MOswitch, MOint, MOboolean,
  MO_ACTIVATED, MO_DEACTIVATED, MO_OFF, MO_ON,
  MO_FALSE, MO_TRUE
} from "./mo-types";
import { moText } from "./mo-text";
import {
  moValueType, moValueTypeArr, moValueTypeStr,
  moValue, moValueBase, moValueDefinition,
  moValues, moValueBases, moDataType, moDataTypeStr
} from "./mo-value";
import {
  moParam, moParamType, moParams,
  moParamDefinition, moParamTypeStrs,
  moParamIndex, moParamIndexes, moParamDefinitions
} from "./mo-param";
import { moFile, moSlash, moFileManager } from "./mo-file-manager";
import { moConfig, moConfigDefinition, MO_CONFIG_OK } from "./mo-config";
import { moResourceManager } from "./mo-resource-manager";
import { moTextureManager } from "./mo-texture-manager";
import { moTexture, moTextureType, moTextureArray, moTextureBuffer } from "./mo-texture";
import { moMathManager, moMathFunction, moParserFunction } from "./mo-math-manager";
import {
  moOutlets, moOutlet,
  moInlets, moInlet,
  moConnection, moConnections
} from "./mo-connectors";
import { moGetDuration } from "./mo-timer";
import { moEventList } from "./mo-event-list";

import * as THREE from "three";
/**
 * Moldeo Object Constants
 */
export const MO_INLET_NAME = 0;
export const MO_INLET_TYPE = 1;

export const MO_OUTLET_NAME = 0;
export const MO_OUTLET_TYPE = 1;
export const MO_OUTLET_INLETS_OFFSET = 2;

export const MO_IODEVICE_KEYBOARD = 0;
export const MO_IODEVICE_MOUSE = 1;
export const MO_IODEVICE_MIDI = 2;
export const MO_IODEVICE_MIXER = 3;
export const MO_IODEVICE_JOYSTICK = 4;
export const MO_IODEVICE_NET_TCP_IN = 5;
export const MO_IODEVICE_NET_UDP_IN = 6;
export const MO_IODEVICE_NET_TCP_OUT = 7;
export const MO_IODEVICE_NET_UDP_OUT = 8;
export const MO_IODEVICE_LIVE = 9;
export const MO_IODEVICE_TRACKER = 10;

export const MO_IODEVICE_TABLET = 11;
export const MO_IODEVICE_TOUCH = 12;
export const MO_IODEVICE_MOBILE = 13;
export const MO_IODEVICE_CONSOLE = 20;
export const MO_IODEVICE_ANY = -1;

///Manteniendo compatibilidad con los id de dispositivos de versiones de 0.6.x
///los moldeo ID's empiezan en 100...
export const MO_MOLDEOOBJECTS_OFFSET_ID = 100;
///scene objects are recursive sub-scene-fx's
export const MO_MOLDEOSCENEOBJECTS_OFFSET_ID = 10000;

export const MO_MOLDEOOBJECT_UNDEFINED_ID = -1;

export class moMobState extends moAbstract {

  m_Activated : MOswitch = MO_OFF;
  m_Selected: MOswitch  = MO_OFF;

  constructor() {
    super();
  }

  Init(): boolean {
    return super.Init();
  }

  Activate() : void {
    this.m_Activated = MO_ON;
  }

  Deactivate() : void {
    this.m_Activated = MO_OFF;
  }

  Activated() : boolean {
    return (this.m_Activated==MO_ON);
  }


  Select() : void {
    this.m_Selected = MO_ON;
  }

  Unselect() : void {
    this.m_Selected = MO_OFF;
  }

  Selected() : boolean {
    return (this.m_Selected==MO_ON);
  }

}

export class moMobIndex {
  m_paramindex : MOint;
  m_valueindex: MOint;
  GetParamIndex() : MOint {
    return this.m_paramindex;
  }
  GetValueIndex() : MOint {
    return this.m_valueindex;
  }
}

export class moMobDefinition {

  m_MoldeoFatherId : MOint = -1;
  m_MoldeoFatherLabelName : moText = "";

  m_MoldeoId : MOint = -1; /// Identificador de objeto Moldeo
  m_MoldeoLabelName : moText = ""; /// Etiqueta o Identificador de texto de este objeto

  m_Type : moMoldeoObjectType = moMoldeoObjectType.MO_OBJECT_UNDEFINED; /// Tipo de Objeto
  m_Name : moText = ""; /// Nombre del objeto (relativo a la clase)
  m_ConfigName : moText = ""; /// Nombre del archivo de configuración
  m_Description : moText = "";/// Descripción del objeto

  m_MobIndex : moMobIndex = new moMobIndex(); /// Índice referente al archivo de configuración que describe a este objeto

  m_KeyName : moText = "";/// nombre de la tecla que activa el objeto
  m_Activate: boolean = true;/// activo al iniciar el proyecto

  constructor() {
  }

  SetName( p_name : moText ) {
    this.m_Name = p_name;
  }

  GetName(): moText {
    return this.m_Name;
  }

  GetType() : moMoldeoObjectType {
    return this.m_Type;
  }

  GetTypeStr(): moText {
    var typestr = moMoldeoObjectTypeToText[this.m_Type];
    return typestr;
  }

  SetType( p_type : moMoldeoObjectType  ) : void {
    this.m_Type = p_type;
  }

  SetConfigName( p_configname: moText) : void {
    this.m_ConfigName = p_configname;
  }

  GetConfigName(): moText {
    return this.m_ConfigName;
  }

  SetMoldeoId( p_id: MOint ) : void {
	  this.m_MoldeoId = p_id;
  }

  GetMoldeoId(): MOint {
    return this.m_MoldeoId;
  }



  SetLabelName( p_labelname: moText) : void {
    this.m_MoldeoLabelName = p_labelname;
  }

  GetLabelName(): moText {
    return this.m_MoldeoLabelName;
  }

  SetKeyName( p_keyname: moText) : void {
    this.m_KeyName = p_keyname;
  }

  GetKeyName(): moText {
    return this.m_KeyName;
  }

  SetDescription( p_description: moText) : void {
    this.m_Description = p_description;
  }

  GetDescription(): moText {
    return this.m_Description;
  }

  SetActivate( p_activate: boolean ) : void {
	  this.m_Activate = p_activate;
  }

  GetActivate(): boolean {
    return this.m_Activate;
  }

  // FATHER =======================


  SetFatherLabelName( p_labelname: moText) : void {
    this.m_MoldeoFatherLabelName = p_labelname;
  }

  GetFatherLabelName(): moText {
    return this.m_MoldeoFatherLabelName;
  }

  SetMoldeoFatherId( p_id: MOint ) : void {
	  this.m_MoldeoFatherId = p_id;
  }

  GetMoldeoFatherId(): MOint {
    return this.m_MoldeoFatherId;
  }

  SetConsoleParamIndex( p_paramindex: MOint ): void {
    this.m_MobIndex.m_paramindex = p_paramindex;
  }

  SetConsoleValueIndex( p_valueindex: MOint ): void {
    this.m_MobIndex.m_valueindex = p_valueindex;
  }

  GetTypeToName(p_type: moMoldeoObjectType, for_console_param?: MOboolean ) : moText {
    var str : moText = moMoldeoObjectTypeToText[p_type];
    if (for_console_param) {
      if (p_type==moMoldeoObjectType.MO_OBJECT_RESOURCE) str = "resources";
      if (p_type==moMoldeoObjectType.MO_OBJECT_IODEVICE) str = "devices";
    }
    return str;
  }

  GetMobIndex() : moMobIndex  {
    return this.m_MobIndex;
  }


}



export class moMoldeoObject extends moScript {

  THREE : any;

  moid: number;
  name: string;
  label: string;

  /// Configuración de parámetros del objeto
  m_Config: moConfig;

  /// Texto del script
  m_Script : moText = "";

  /// \if spanish Definición del objeto \endif \if english Object definition \endif
  m_MobDefinition : moMobDefinition;

  /// Moldeo Object State
  m_MobState : moMobState;

  /// Puntero al administrador de recursos
  m_pResourceManager : moResourceManager;

  /// Conectores de salida, Arreglo de moOutlet's
  m_Outlets : moOutlets = [];
  m_OutletsStr: any = {};

  /// Conectores de entrada, Arreglo de moInlet's
  m_Inlets : moInlets = [];
  m_InletsStr: any = {};

  InletScreenWidth : moInlet;
  screen_width : number;
  InletScreenHeight : moInlet;
  screen_height : number;
  InletScreenProportion : moInlet;
  screen_proportion : number;
  InletTimeabs : moInlet;
  InletPreconfig : moInlet;

  m_bConnectorsLoaded : boolean = false;

  __iscript : MOint;

  constructor() {
    super();
    this.THREE = THREE;

    this.m_pResourceManager = null;
    //this.m_Script = "";
    this.m_Config = new moConfig();
    this.m_MobDefinition = new moMobDefinition();
    this.m_MobState = new moMobState();
  }


  Init(callback?: any ): boolean {
    //console.log(`[${this.GetName()}] moMoldeoObject::Init()`);

    if (this.m_pFileManager == undefined) {
      if (this.m_pResourceManager) {
        if (this.m_pResourceManager.GetFileMan())
          this.m_pFileManager = this.m_pResourceManager.GetFileMan();
      }
    }
    //console.log(this.m_MobDefinition);


    this.InletScreenWidth = new moInlet();
    if (this.InletScreenWidth) {
      this.InletScreenWidth.Init( "screen_width", this.m_Inlets.length, "DOUBLE" );
      this.m_Inlets.push(this.InletScreenWidth);
      this.m_InletsStr["screen_width"] = this.InletScreenWidth;
    }

    this.InletScreenHeight = new moInlet();
    if (this.InletScreenHeight) {
      this.InletScreenHeight.Init( "screen_height", this.m_Inlets.length, "DOUBLE" );
      this.m_Inlets.push( this.InletScreenHeight );
      this.m_InletsStr["screen_height"] = this.InletScreenHeight;
    }

    this.InletScreenProportion = new moInlet();
    if (this.InletScreenProportion) {
      this.InletScreenProportion.Init( "screen_proportion", this.m_Inlets.length, "DOUBLE" );
      this.m_Inlets.push(this.InletScreenProportion);
      this.m_InletsStr["screen_proportion"] = this.InletScreenProportion;
    }

    this.InletTimeabs = new moInlet();
    if (this.InletTimeabs) {
      this.InletTimeabs.Init( "timeabs", this.m_Inlets.length, "DOUBLE" );
      this.m_Inlets.push(this.InletTimeabs);
      this.m_InletsStr["timeabs"] = this.InletTimeabs;
    }

    this.InletPreconfig = new moInlet();
    if (this.InletPreconfig) {
      this.InletPreconfig.Init( "preconfig", this.m_Inlets.length, "INT" );
      this.m_Inlets.push(this.InletPreconfig);
      this.m_InletsStr["preconfig"] = this.InletPreconfig;
    }

    var confignamecompleto : moText = "";
    this.GetDefinition();

    if ( this.GetType() == moMoldeoObjectType.MO_OBJECT_CONSOLE ) {
      confignamecompleto = this.GetConfigName();
      //console.log("confignamecompleto:", confignamecompleto);
    } else if (
      this.GetType() == moMoldeoObjectType.MO_OBJECT_PREEFFECT
      || this.GetType() == moMoldeoObjectType.MO_OBJECT_EFFECT
      || this.GetType() == moMoldeoObjectType.MO_OBJECT_POSTEFFECT
      || this.GetType() == moMoldeoObjectType.MO_OBJECT_MASTEREFFECT
      || this.GetType() == moMoldeoObjectType.MO_OBJECT_RESOURCE
    || this.GetType() == moMoldeoObjectType.MO_OBJECT_IODEVICE ) {
      if (this.m_pResourceManager) {
        var datap: moText = this.m_pResourceManager.GetDataMan().GetDataPath();
        //confignamecompleto = "" + this.m_pResourceManager.GetDataMan().GetDataPath();
        var cname : moText = this.GetConfigName();
        if (cname == "") return false;
        confignamecompleto = `${datap}${this.GetConfigName()}.cfg`;
      }

    } else {
      return false;
    }

    /*else {

      if (this.m_pResourceManager) {
        if (this.m_pResourceManager.GetDataMan()) {
          confignamecompleto = "" + this.m_pResourceManager.GetDataMan().GetDataPath();
          confignamecompleto +=  "" + moSlash + this.GetConfigName();
          confignamecompleto +=  ".cfg";
        } else {
          this.MODebug2.Error("moMoldeoObject::Init > DataManager undefined > object: " + this.GetName()
            + " config: " + this.GetConfigName()
            + " label:" + this.GetLabelName());
            return false;
        }
      } else {
        this.MODebug2.Error("moMoldeoObject::Init > ResourceManager undefined > object: " + this.GetName()
          + " config: " + this.GetConfigName()
          + " label:" + this.GetLabelName());
          return false;
      }
    }*/

  this.MODebug2.Message(`***** Initializing ${this.GetName()} ***** ${confignamecompleto}`);
    if (confignamecompleto != undefined && confignamecompleto + "" != "" ) {
      this.m_pFileManager.Load(confignamecompleto, true, (res) => {
        //console.log("loaded file .. OK");
        if (this.m_Config.LoadConfig(res, (config_res) => {
          //console.log("CONFIG LOADED!", config_res);

          /**
          DefineParamIndexes
          */
          //m_Config.Indexation();
          this.__iscript = this.m_Config.GetParamIndex("script");
          /*if(this.__iscript==MO_PARAM_NOT_FOUND)
            this.MODebug2.Error(moText("moMoldeoObject::Init > config: "+GetConfigName()
          + " config: " + GetConfigName() + " label: "+GetLabelName()+" script parameter missing"));
          */

          this.InitScript();
          this.RegisterFunctions();

          if (callback) callback(config_res);

        } ) != MO_CONFIG_OK ) {
          this.MODebug2.Error("moMoldeoObject::Init > Config file invalid or not found > object: " + this.GetName()
            + " config:" + confignamecompleto + " label: " + this.GetLabelName());
          return false;//bad
        }
      });
    }


    return super.Init();
  }

  CreateConnectors() : boolean {
    //console.log( `moMoldeoObject.CreateConnectors > ${this.GetConfigName()}`);
    /*
        if (m_pResourceManager == NULL) {
        MODebug2->Error("moMoldeoObject::CreateConnectors > ResourceManager is NULL!!! Can't continue. Sorry for object: "
        +GetName()+ " config: " + GetConfigName() + " label:"+GetLabelName() );
        return false;
      }
    */
    if (this.m_bConnectorsLoaded) {
      this.MODebug2.Error("moMoldeoObject::CreateConnectors > Calling twice."
        + " Can't continue. Sorry for object: "
        + this.GetName()
        + " config: " + this.GetConfigName() + " label:" + this.GetLabelName());
      return false;
    }
    /*
      MODebug2->Message("moMoldeoObject::CreateConnectors > Calling once. object: "
      +GetName()+ " config: " + GetConfigName() + " label:" + GetLabelName() );
    */

  	///crea los Inlets adicionales a los parámetros: definidos en el parámetro "inlet"

    var pinlets : moParam = this.m_Config.GetParam("inlet");

    for (let i = 0; i < pinlets.GetValuesCount(); i++) {
      let InletName = pinlets.GetValue(i).GetSubValue(MO_INLET_NAME).Text();
      let InletType = pinlets.GetValue(i).GetSubValue(MO_INLET_TYPE).Text();
      if ( this.GetInletIndex( InletName )==-1 ) {
        var Inlet : moInlet = new moInlet();
        if (Inlet) {
          Inlet.SetMoldeoLabelName( this.GetLabelName() );
          ///lo creamos si y solo si no existe como parámetro....
          if (this.m_Config.GetParamIndex(InletName) == -1) {
            Inlet.Init( InletName, this.m_Inlets.length, ""+InletType );
            this.m_Inlets.push( Inlet );
          }
        }
      }
  	}

  	///Inicializa las funciones matemáticas del config
  	///así como los inlets y outlets por cada parámetro
  	///así como las texturas
  	for( var p=0;p<this.m_Config.GetParamsCount();p++) {

      var param: moParam = this.m_Config.GetParam(p);
      /*
      		this.MODebug2.Log( moText("moMoldeoObject::CreateConnectors > Init param type ")
          + param.GetParamDefinition().GetTypeStr() + moText(" name: ")
          + param.GetParamDefinition().GetName() );
      */
      ///CREAMOS UN INLET POR CADA PARAMETRO
      var inletidx : MOint = this.GetInletIndex(param.GetParamDefinition().GetName());
      if (inletidx==-1) {
        var Inlet : moInlet = new moInlet();
        if (Inlet) {
          var iname = param.GetParamDefinition().GetName();
          Inlet.Init( iname, this.m_Inlets.length, param );
          this.m_Inlets.push(Inlet);
          this.m_InletsStr[""+iname] = Inlet;
        }
      }

  		for( var v=0;v<param.GetValuesCount();v++) {
        this.ResolveValue( param, v );

  		}
  	}
    /*
      MODebug2->Message("moMoldeoObject::CreateConnectors > loaded params & values for Object: "
      + GetName() + " config:" + GetConfigName() + " label:" + GetLabelName() );
    */
        /** VERIFICAR ESTO!!!!*/
        /**
        Solo se crean los outlets declarados en el xml.
        */
    /*
        /// Crea aquellos Outlets definidos dentro del parámetro "outlet"
        /// y conecta aquellos nombrados que ya existen como parámetros de este config
    	moParam& poutlets = m_Config[moText("outlet")];

    	for( MOuint i=0; i<poutlets.GetValuesCount(); i++ ) {
        if ( GetOutletIndex(poutlets[i][MO_OUTLET_NAME].Text())==-1 ) {
          moOutlet* Outlet = new moOutlet();
          if (Outlet) {
            Outlet->SetMoldeoLabelName( GetLabelName() );
            ///Buscamos el parametro asociado al outlet
            ///para asociar un parametro a un outlet debe simplemente tener el mismo nombre...
            moText OutletName = poutlets[i][MO_OUTLET_NAME].Text();

            if ( m_Config.GetParamIndex(OutletName) > -1 ) {
              ///CREAMOS UN OUTLET nuevo para este parametro....
              MODebug2->Log( moText("moMoldeoObject::CreateConnectors > ")
              + this->GetLabelName() + moText(" creating Outlet as parameter \"") + OutletName + "\""  );
              Outlet->Init( OutletName, i, m_Config.GetParam(OutletName).GetPtr());
            } else {
              ///CREAMOS UN OUTLET desde el .cfg, teniendo en cuenta los tipos...
              MODebug2->Log( moText("moMoldeoObject::CreateConnectors > ")
              + this->GetLabelName() + moText(" Init > creating outlet not as param.") + OutletName  );
              Outlet->Init( OutletName, i, poutlets[i][MO_OUTLET_TYPE].Text() );
            }
            m_Outlets.Add( Outlet );

            /// Creamos sus conecciones
            /// las conecciones viene de a pares: object label name + object inlet name
            for( MOuint j=MO_OUTLET_INLETS_OFFSET; j<poutlets[i].GetSubValueCount(); j+=2 ) {
              moText objectname = poutlets[i][j].Text();
              moText inletname = poutlets[i][j+1].Text();
              moConnection* Connection = new moConnection( objectname, inletname );
              if (Connection)
                Outlet->GetConnections()->Add(Connection);
            }
          }
        }
    	}
    */
    this.m_bConnectorsLoaded = true;

    ///Una vez establecidos los conectores, podemos inicializar el script a su vez....
  	//moMoldeoObject::ScriptExeInit();
  	this.ScriptExeInit();
    /*
    MODebug2->Message("moMoldeoObject::CreateConnectors > OK! Object: "
    + GetName() + " config:" + GetConfigName() + " label: " + GetLabelName() );

    */
  	return this.m_bConnectorsLoaded;
  }

  Update( p_Event : moEventList ): void {

    if (this.InletScreenWidth) {
      if (this.InletScreenWidth.GetData())
          this.InletScreenWidth.GetData().SetDouble( this.m_pResourceManager.GetRenderMan().ScreenWidth());
      this.screen_width = this.InletScreenWidth.GetData().Double();
    }

    if (this.InletScreenHeight) {
      if (this.InletScreenHeight.GetData())
        this.InletScreenHeight.GetData().SetDouble( this.m_pResourceManager.GetRenderMan().ScreenHeight());
      this.screen_height = this.InletScreenHeight.GetData().Double();
    }

    if (this.InletScreenProportion) {
      if (this.InletScreenProportion.GetData())
        this.InletScreenProportion.GetData().SetDouble( this.m_pResourceManager.GetRenderMan().ScreenProportion());
      this.screen_proportion = this.InletScreenProportion.GetData().Double();
    }

    if (this.InletTimeabs) {
      if (this.InletTimeabs.GetData())
          this.InletTimeabs.GetData().SetDouble(moGetDuration());
    }

    if (this.InletPreconfig) {
        if (this.InletPreconfig.GetData())
          this.InletPreconfig.GetData().SetInt( this.m_Config.GetCurrentPreConf() );
    }


    /**
    	moEvent *actual,*tmp;
    	moMessage *pmessage;

    	actual = p_EventList->First;

    	///Procesamos los eventos recibidos
    	/// de los MoldeoObject Outlets
    	while(actual!=NULL) {
    		tmp = actual->next;
    		///procesamos aquellos Outlet q estan dirigidos a este objeto

    		if (actual->deviceid == GetId() && actual->reservedvalue3 == MO_MESSAGE) {

    			///pSample = (moVideoSample*)actual->pointer;
    			pmessage = (moMessage*)actual;

    			///process message:
    			MOint inletid = pmessage->m_InletIdDest;
    			moData pdata = pmessage->m_Data;
          //MODebug2->Message("Receiving outlet message to inlet: ");
    			///buscar el inlet...
    			if (inletid>=0 && inletid<(int)m_Inlets.Count() ) {
    				moInlet* pinlet = m_Inlets[inletid];
            //MODebug2->Message("Updating inlet: object: " + GetLabelName() + " inlet: " + pinlet->GetConnectorLabelName()
            //                  + " outlet_data: " + pdata.ToText() );

    				///Only create Data if this is a custom Inlet
    				if (pinlet->GetData()==NULL)
              pinlet->NewData();

            ///si tiene un dato (por ejemplo es el dato referencia de un moParam)
            /// copia directamente (ya que se refleja directamente en: pinlet->m_pParam->Data
            /// sin embargo al estar interpolado
    				if (pinlet->GetConnectorLabelName()=="control_roll_angle") pinlet->GetInternalData()->Copy(pdata);
    				else if (pinlet->IsParameterDependent()) pinlet->GetInternalData()->Copy(pdata);
    				else pinlet->GetData()->Copy(pdata);


    				pinlet->Update();///notifica al inlet que ya esta actualizado...

            //MODebug2->Message("Updating inlet: object: " + GetLabelName() + " inlet: " + pinlet->GetConnectorLabelName()
            //                  + " outlet_data: " + pinlet->GetData()->ToText() );

    			}

    		} else if (actual->reservedvalue3 == MO_MESSAGE) {
    		    ///Broadcasting: borra su propio mensaje....

    			pmessage = (moMessage*)actual;

    			///se fija si es un mensaje generado por este objeto
    			if (pmessage->m_MoldeoIdSrc == GetId() ) {
    				p_EventList->Delete(pmessage);
    			}

    		}
    		///pasamos al siguiente
    		actual = tmp;
    	}
    */
    /**
    	///generamos los mensajes emergentes de los Outlets
    	for( MOuint i=0; i<m_Outlets.Count() ; i++) {
    		moOutlet* poutlet = m_Outlets[i];

        if (poutlet) {


          bool forcingParameterEmition = false;
          if (  poutlet->IsParameterDependent()
                &&
                poutlet->GetConnections()->Count()>0) {
              ///TODO: chequear encadenamiento
              /// ( outlet (object2) >> inlet (thisobject) (translatex)
              /// outlet (thisobject) (translatex) >> inlet (object3)
              forcingParameterEmition = true;
          }

          ///Emit the internal Outlet's data
          if ( poutlet->Updated() || forcingParameterEmition ) {
            ///solo notificamos a los inlets si los outlets estan Updated() importante revisar esto...
            ///puede  deba ser algo condicional: claramente lo es, sobre todo para los Outlets que asociados a
            ///parámetros, por ejemplo el alpha.. o el translatex

            //MODebug2->Message( poutlet->GetConnectorLabelName() + moText(" outlet updated. MOB : ") + this->GetLabelName() );

            moData pdata = (*(poutlet->GetData()));
            moConnections* pconnections = poutlet->GetConnections();
            for(MOuint j=0; j<pconnections->Count(); j++) {
              moConnection* pconnection = pconnections->Get(j);
              pmessage = new moMessage( pconnection->GetDestinationMoldeoId(),
                                        pconnection->GetDestinationConnectorId(),
                                        GetId(),
                                        pdata );
              p_EventList->Add( (moEvent*) pmessage );
              //if (pmessage) delete pmessage;
              //MODebug2->Message(moText("added outlet message for:") + IntToStr(pconnection->GetDestinationMoldeoId())  );
            }
            ///reset to update false, so it doesnt continue sending!
            poutlet->Update(false);
          }
        }
      }*/
    this.ScriptExeUpdate();

  }

  SetName( p_name : moText ) {
    this.m_MobDefinition.SetName(p_name);
  }

  GetName(): moText {
    return this.m_MobDefinition.GetName();
  }

  GetType() : moMoldeoObjectType {
    return this.m_MobDefinition.GetType();
  }

  SetType( p_type : moMoldeoObjectType  ) : void {
    this.m_MobDefinition.SetType(p_type);
  }

  GetId() : MOint {
	  return this.m_MobDefinition.GetMoldeoId();
  }

  SetId( p_id: MOint ) : void {
	  this.m_MobDefinition.SetMoldeoId( p_id );
  }

  SetConfigName( p_configname: moText) : void {
    this.m_MobDefinition.SetConfigName( p_configname );
  }

  GetConfigName() : moText {
    return this.m_MobDefinition.GetConfigName();
  }

  SetLabelName( p_labelname: moText) : void {
    this.m_MobDefinition.SetLabelName( p_labelname );
  }

  GetLabelName() : moText {
    return this.m_MobDefinition.GetLabelName();
  }

  SetResourceManager( p_resourcemanager : moResourceManager ) : void {
    this.m_pResourceManager = p_resourcemanager;
  }

  GetResourceManager(): moResourceManager {
    return this.m_pResourceManager;
  }

  Save(): MOint {
    return -1;
  }

  SetMobDefinition( p_definition: moMobDefinition ) : void {
    this.m_MobDefinition = p_definition;
  }

  GetMobDefinition() : moMobDefinition {
    return this.m_MobDefinition;
  }

  GetDefinition(p_configdefinition?: moConfigDefinition): moConfigDefinition {
    if ( p_configdefinition==undefined ) {
      p_configdefinition = this.m_Config.GetConfigDefinition();
    }

    p_configdefinition.Empty();
    p_configdefinition.Set( this.GetName(), this.m_MobDefinition.GetTypeStr() );

    p_configdefinition.Add( "inlet", moParamType.MO_PARAM_INLET );
    p_configdefinition.Add( "outlet", moParamType.MO_PARAM_OUTLET );
    p_configdefinition.Add( "script", moParamType.MO_PARAM_SCRIPT);
    //console.log("definitions:", p_configdefinition);
    return p_configdefinition;
  }

  ResolveValue( param : moParam, value_index : MOint, p_refresh: boolean = false ) : boolean {

    var idx : MOint = -1;
    var value : moValue = param.GetValue(value_index);
    var param_type : moParamType = param.GetParamDefinition().GetType();
    //MODebug2->Message( moText("+Init value #") + IntToStr(v) );

    ///RESUELVE LAS FUNCIONES!!!!
    ///esto debe hacerse antes de aplicar filtros y otros...

    for( var ivb=0; ivb<value.GetSubValueCount(); ivb++) {
        var VB : moValueBase  = value.GetSubValue( ivb );
        if (VB.GetType() == moValueType.MO_VALUE_FUNCTION ) {
            idx = -1;
            if (p_refresh)
              if (this.m_pResourceManager.GetMathMan())
                idx = this.m_pResourceManager.GetMathMan().AddFunction( VB.Text(), true, this );

            if (this.m_pResourceManager.GetMathMan())
              idx = this.m_pResourceManager.GetMathMan().AddFunction( VB.Text(), true, this );
            if (idx>-1) {
              var Fun : moMathFunction = this.m_pResourceManager.GetMathMan().GetFunction(idx);
                VB.SetFun( Fun );
                if (Fun.m_isNumber == false) {
                  //this.MODebug2.Message("function defined: " + VB.Text());
                  //console.log( "function defined: " + VB.Text(), Fun );
                }
            } else {
              this.MODebug2.Error("moMoldeoObject::CreateConnectors > function couldn't be defined: "
                                + VB.Text()
                                + " object: "+this.GetName()
                                + " config: " + this.GetConfigName()
                                + " label:" + this.GetLabelName()
                                + " param:" + param.GetParamDefinition().GetName());
            }
        }
    }


    //

    if (value.GetSubValueCount()<=0) return false;

    var valuebase0 : moValueBase = value.GetSubValue(0);
    var idx: MOint = -1;
    var TexMan: moTextureManager = this.m_pResourceManager.GetTextureMan();

    switch( param_type ) {

        case moParamType.MO_PARAM_TEXTUREFOLDER:
            ///es una carpeta pero puede tener otros parametros
            ///
            if ( ! (""+valuebase0.Text() == "") ) {
                ///si tenemos un segundo parametro deberia ser el formato del buffer (JPG o PNG)
                if (p_refresh) {

                }
                idx = this.m_pResourceManager.GetTextureMan().GetTextureBuffer(
                  valuebase0.Text(),
                  true,
                  "PNG");

                if (idx>-1) {

                    var pTextureBuffer : moTextureBuffer = this.m_pResourceManager.GetTextureMan().GetTextureBuffer(idx);
                    valuebase0.SetTextureBuffer( pTextureBuffer );
                    return true;
                }
                return false;

            }


            break;

        case moParamType.MO_PARAM_VIDEO:
            ///ojo aquí el video es tratado por el VideoManager si quiere ser tratado realamente
            /// como video y no como texturaanimada....

            break;

        case moParamType.MO_PARAM_TEXTURE:
        case moParamType.MO_PARAM_FILTER:
            var s: String = new String(valuebase0.Text());
            if ( ! (s.trim() == "") ) {

                if (p_refresh) {
                  idx = TexMan.GetTextureMOId( valuebase0.Text(), true, true );
                }

                idx = TexMan.GetTextureMOId( valuebase0.Text(), true );
                if (idx>-1) {
                    var pTexture : moTexture = TexMan.GetTexture(idx);
                    valuebase0.SetTexture( pTexture );

                    if (pTexture.GetType()!=moTextureType.MO_TYPE_TEXTURE_MULTIPLE && value.GetSubValueCount()>1) {
                      /*
                        idx = m_pResourceManager->GetShaderMan()->GetTextureFilterIndex()->LoadFilter( &value );
                        moTextureFilter*  pTextureFilter = m_pResourceManager->GetShaderMan()->GetTextureFilterIndex()->Get(idx-1);
                        valuebase0.SetTextureFilter( pTextureFilter );
                        */
                    }
  /*
                    if (value.GetSubValueCount()==4) {
                        valuebase0.SetTextureFilterAlpha( value.GetSubValue(3).GetData() );
                    }
  */
  /*
                    if (value.GetSubValueCount()>=5) {
                        //valuebase.SetTextureFilterParam( value.GetSubValue(4).GetData() );
                    }
  */
                    //MODebug2->Message( moText("moMoldeoObject::CreateConnectors > ") + valuebase0.Text());

                }
            } else {
              this.MODebug2.Error("moMoldeoObject::UpdateValue > VALUE BASE EMPTY: "
                                  + valuebase0.Text()
                                /*+ moText(" Param name:") +param.GetParamDefinition().GetName()*/ );
                return false;
            }
            break;

        case moParamType.MO_PARAM_FONT:
  /*
            moFont* pFont;
            moFontType fonttype;
            moFontSize  fontsize;

            if ( value.GetSubValueCount()==3 ) {
                if ( valuebase0.Text().Trim() == moText("Default") ) {
                  pFont = m_pResourceManager->GetFontMan()->GetFont(0);
                } else if ( ! (valuebase0.Text().Trim() == moText("")) ) {

                    if ( value.GetSubValue(1).GetType()==MO_VALUE_TXT) {
                        moText fonttypeT = value.GetSubValue(1).Text();
                        fonttype = m_pResourceManager->GetFontMan()->GetFontType(fonttypeT);
                    } else {
                        fonttype = (moFontType)value.GetSubValue(1).Int();
                    }

                    if ( value.GetSubValue(2).GetType()==MO_VALUE_NUM ) {
                        fontsize = value.GetSubValue(2).Int();
                    } else if ( value.GetSubValue(2).GetType()==MO_VALUE_FUNCTION ) {
                        fontsize = 12;
                    }

                    pFont = m_pResourceManager->GetFontMan()->AddFont( valuebase0.Text(), fonttype, fontsize);
                    if (pFont==NULL) {
                      MODebug2->Error( moText("moMoldeoObject::CreateConnectors > FONT NOT FOUND: Using Default")
                      + valuebase0.Text() + moText(" Param name:") +param.GetParamDefinition().GetName() );
                      pFont = m_pResourceManager->GetFontMan()->GetFont(0);
                    }
                } else {
                    MODebug2->Error( moText("moMoldeoObject::CreateConnectors > VALUE BASE EMPTY: Using Default")+ valuebase0.Text()
                    + moText(" Param name:") +param.GetParamDefinition().GetName() );
                    pFont = m_pResourceManager->GetFontMan()->GetFont(0);
                }

                if (pFont) {
                    valuebase0.SetFont( pFont );
                    return true;
                }
                return false;
            } else {
                MODebug2->Error( moText("moMoldeoObject::UpdateValue > MISSING VALUES: ")
                + valuebase0.Text() + moText(" Param name:")
                +param.GetParamDefinition().GetName() );
                return false;
            }
            */
            break;

        case moParamType.MO_PARAM_3DMODEL:
        case moParamType.MO_PARAM_OBJECT:
        /*
            if (value.GetSubValueCount()>0) {
                ///TODO: PROBAR!!!!!
                moSceneNode* pModel = m_pResourceManager->GetModelMan()->Get3dModel( valuebase0.Text(),
                true //force load !!
                  );
                valuebase0.SetModel( pModel );
                return false;
            }
            */
            break;

        case moParamType.MO_PARAM_SOUND:
        /*
            if (value.GetSubValueCount()>0) {
              if (valuebase0.Text()!="") {
                moSound* pSound = m_pResourceManager->GetSoundMan()->GetSound( valuebase0.Text() );
                if (pSound) {
                    valuebase0.SetSound( pSound );
                    return true;
                }
                return false;
              }
            }*/
            break;
        default:
          break;

    }//fin siwtch

    return false;
  }


  GetInletIndex( p_connector_name : moText ): MOint {

    return -1;
  }

  GetInlets(): moInlets {
    return this.m_Inlets;
  }

  AddInlet( name : string, type : any ) : moInlet {
    var newInlet : moInlet = new moInlet();
    if (newInlet) {
      newInlet.Init( name, this.m_Inlets.length, type );
      this.m_Inlets.push(newInlet);
      this.m_InletsStr[name] = newInlet;
      return this.m_InletsStr[name];
    }
    return null;
  }

  GetOutlets(): moOutlets {
    return this.m_Outlets;
  }

  GetConfig(): moConfig {
    return this.m_Config;
  }

  /// \if spanish Carga las definiciones de parámetros del archivo de configuración \endif
  // \if english Loads parameter's config definitions \endif
  LoadDefinition(): void {

  }

  /// Corre la funcion de script Run o Compila el nuevo script
  ScriptExeInit() : void {
    if (super.IsInitialized()) {
        this.ScriptExeUpdate();
        if (this.ScriptHasFunction("Init")) {
            this.SelectScriptFunction("Init");
            this.RunSelectedFunction();
        }
    }
  }
  ScriptExeRun(): void {
    if (super.IsInitialized()) {
        if (this.ScriptHasFunction("Update")) {
            this.SelectScriptFunction("Update");
            this.RunSelectedFunction();
        }
    }
  }

  ScriptExeUpdate(): void {
     var cs : moText;
     //cs = this.m_Config.Text( this.__iscript );
     cs = this.m_Config.Text( "script" );
     //console.log("ScriptExeUpdate", cs);
  ///Reinicializamos el script en caso de haber cambiado
	if ( this.m_Script!=cs && super.IsInitialized()) {

        this.m_Script = cs;
        var path_fullscript : moText = ""+this.m_pResourceManager.GetDataMan().NameToPath( ""+this.m_Script );
        var f: moFile;// = new moFile( path_fullscript );
/*        if (f.Exists()) {
*/
          //MODebug2->Message( GetLabelName() +  moText(" script loading : ") + (moText)fullscript );

        if (this.CompileFile(path_fullscript, (res) => {
            this.SelectScriptFunction("Init");
            this.RunSelectedFunction();
          } ) ) {

              //MODebug2->Message( GetLabelName() + moText(" script loaded : ") + (moText)fullscript );

              ///Reinicializamos el script

            //this.SelectScriptFunction("Init");

              /**TODO: revisar uso de offset, para multipantallas
              moText toffset=moText("");

              toffset = m_Config[moR(CONSOLE_SCRIPT)][MO_SELECTED][1].Text();
              if (toffset!=moText("")) {
                  m_ScriptTimecodeOffset = atoi( toffset );
              } else {
                  m_ScriptTimecodeOffset = 0;
              }
              AddFunctionParam( (int)m_ScriptTimecodeOffset );
              */

              //this.RunSelectedFunction();

          }// else MODebug2->Error( moText("Couldn't compile lua script ")
          //+ (moText)fullscript + " config:" + GetConfigName() + " label: " + GetLabelName() );
/*
        }
        //else MODebug2 ->Message("Script file not present. " + (moText)fullscript
        // + " config: " + GetConfigName() + " label:" + GetLabelName());
 */
	}


  ///Si tenemos un script inicializado... corremos la funcion Run()
    if (super.IsInitialized()) {
        if (this.ScriptHasFunction("Run")) {
            this.SelectScriptFunction("Run");
            this.RunSelectedFunction();
        }
    }

  }

  ScriptExeFinish() : void {

  }

  SetScript( p_script : moText ) : void {
    this.m_Script = p_script;
  }

  RegisterFunctions() : void {

  }

  GetState() : moMobState {
    return this.m_MobState;
  }

  SetState( p_mobstate : moMobState ) {
    Object.assign( this.m_MobState, p_mobstate );
  }

  Activate() : void {

      //var mobstate : moMobState = this.GetState();

      //mobstate.Activate();
      //this.SetState( mobstate );
    this.GetState().Activate();
  }

  Deactivate() :void {

      //var mobstate : moMobState = this.GetState();

     // mobstate.Deactivate();
      //this.SetState( mobstate );
      this.GetState().Deactivate();
  }

  Activated() {
    return this.m_MobState.Activated();
  }

  ToJSON(): any {
    //super.ToJSON();
    return {};
  }

}

export type moMoldeoObjects = moMoldeoObject[];
