
import { moAbstract } from "./mo-abstract";
import { moScript } from "./mo-script";
import { moMoldeoObjectType, moMoldeoObjectTypeStr } from "./mo-moldeo-object-type.enum";
export { moMoldeoObjectType, moMoldeoObjectTypeStr } from "./mo-moldeo-object-type.enum";
import {
  MOswitch, MOint,
  MO_ACTIVATED, MO_DEACTIVATED, MO_OFF, MO_ON,
  MO_FALSE, MO_TRUE
} from "./mo-types";
import { moText } from "./mo-text";
import { moConfig, moConfigDefinition, MO_CONFIG_OK } from "./mo-config";
import { moSlash } from "./mo-file-manager";
import { moFileManager } from "./mo-file-manager";
import { moResourceManager } from "./mo-resource-manager";

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

  GetTypeToName(p_type: moMoldeoObjectType) : moText {
    return moMoldeoObjectTypeStr[p_type];
  }

  GetMobIndex() : moMobIndex  {
    return this.m_MobIndex;
  }


}

export class moMoldeoObject extends moScript {
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
  m_pFileManager: moFileManager;//para leer archivos de configuracion locales y remotos
/*
  /// Conectores de salida, Arreglo de moOutlet's
  m_Outlets : moOutlets;

  /// Conectores de entrada, Arreglo de moInlet's
  m_Inlets : moInlets;

  InletScreenWidth : moInlet;
  InletScreenHeight : moInlet;
  InletTimeabs : moInlet;
  InletPreconfig : moInlet;
*/
  m_bConnectorsLoaded : boolean = false;

  __iscript : MOint;

  constructor() {
    super();

    this.m_pResourceManager = null;
    //this.m_Script = "";
    this.m_Config = new moConfig();
    this.m_MobDefinition = new moMobDefinition();
    this.m_MobState = new moMobState();
  }


  Init(callback?: any ): boolean {
    console.log(`[${this.GetName()}] moMoldeoObject::Init()`);

    if (this.m_pFileManager == undefined) {
      if (this.m_pResourceManager) {
        if (this.m_pResourceManager.GetFileMan())
          this.m_pFileManager = this.m_pResourceManager.GetFileMan();
      }
    }
    //console.log(this.m_MobDefinition);

    /*
    InletScreenWidth = new moInlet();
    if (InletScreenWidth) {
      ((moConnector*)InletScreenWidth)->Init( moText("screen_width"), m_Inlets.Count(), MO_DATA_NUMBER_DOUBLE );
      m_Inlets.Add(InletScreenWidth);
    }

    InletScreenHeight = new moInlet();
    if (InletScreenHeight) {
      ((moConnector*)InletScreenHeight)->Init( moText("screen_height"), m_Inlets.Count(), MO_DATA_NUMBER_DOUBLE );
      m_Inlets.Add(InletScreenHeight);
    }

    InletTimeabs = new moInlet();
    if (InletTimeabs) {
      ((moConnector*)InletTimeabs)->Init( moText("timeabs"), m_Inlets.Count(), MO_DATA_NUMBER_DOUBLE );
      m_Inlets.Add(InletTimeabs);
    }

    InletPreconfig = new moInlet();
    if (InletPreconfig) {
      ((moConnector*)InletPreconfig)->Init( moText("preconfig"), m_Inlets.Count(), MO_DATA_NUMBER_INT );
      m_Inlets.Add(InletPreconfig);
    }
*/
    var confignamecompleto : moText;
    this.GetDefinition();

    if ( this.GetType() == moMoldeoObjectType.MO_OBJECT_CONSOLE ) {
      confignamecompleto = this.GetConfigName();
      console.log("confignamecompleto:", confignamecompleto);
    } else if (
      this.GetType() == moMoldeoObjectType.MO_OBJECT_PREEFFECT
      || this.GetType() == moMoldeoObjectType.MO_OBJECT_EFFECT) {

      var datap: moText = this.m_pResourceManager.GetDataMan().GetDataPath();
      //confignamecompleto = "" + this.m_pResourceManager.GetDataMan().GetDataPath();
      confignamecompleto = `${datap}${this.GetConfigName()}.cfg`;

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
    if (confignamecompleto != undefined && confignamecompleto + "" != "") {
      this.m_pFileManager.Load(confignamecompleto, true, (res) => {
        console.log("loaded file .. OK", res);
        if (this.m_Config.LoadConfig(res._body, (config_res) => {
          console.log("CONFIG LOADED!", config_res);

          /**
          DefineParamIndexes
          */
          //m_Config.Indexation();
          /*
          __iscript = m_Config.GetParamIndex("script");
          if(__iscript==MO_PARAM_NOT_FOUND)
          MODebug2->Error(moText("moMoldeoObject::Init > config: "+GetConfigName()
          + " config: " + GetConfigName() + " label: "+GetLabelName()+" script parameter missing"));


          InitScript();
          RegisterFunctions();*/
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
    console.log( `moMoldeoObject.CreateConnectors > ${this.GetConfigName()}`);
/*
    if (m_pResourceManager == NULL) {
    MODebug2->Error("moMoldeoObject::CreateConnectors > ResourceManager is NULL!!! Can't continue. Sorry for object: "+GetName()+ " config: " + GetConfigName() + " label:"+GetLabelName() );
    return false;
  }

  if (m_bConnectorsLoaded) {
    MODebug2->Error("moMoldeoObject::CreateConnectors > Calling twice. Can't continue. Sorry for object: "+GetName()+ " config: " + GetConfigName() + " label:"+GetLabelName() );
    return false;
  }

  MODebug2->Message("moMoldeoObject::CreateConnectors > Calling once. object: "+GetName()+ " config: " + GetConfigName() + " label:" + GetLabelName() );


	///crea los Inlets adicionales a los parámetros: definidos en el parámetro "inlet"

	moParam& pinlets = m_Config[moText("inlet")];

	for( MOuint i=0; i<pinlets.GetValuesCount(); i++ ) {
    if ( GetInletIndex(pinlets[i][MO_INLET_NAME].Text())==-1 ) {
      moInlet* Inlet = new moInlet();
      if (Inlet) {
        Inlet->SetMoldeoLabelName( GetLabelName() );
        moText InletName = pinlets[i][MO_INLET_NAME].Text();
        ///lo creamos si y solo si no existe como parámetro....
        if ( m_Config.GetParamIndex(InletName)==-1 ) {
          ((moConnector*)Inlet)->Init( InletName, m_Inlets.Count(), pinlets[i][MO_INLET_TYPE].Text() );
          m_Inlets.Add( Inlet );
        }
      }
    }
	}

	///Inicializa las funciones matemáticas del config
	///así como los inlets y outlets por cada parámetro
	///así como las texturas
	for( MOint p=0;p<m_Config.GetParamsCount();p++) {

		moParam	&param( m_Config[p] );

		MODebug2->Log( moText("moMoldeoObject::CreateConnectors > Init param type ") + param.GetParamDefinition().GetTypeStr() + moText(" name: ") + param.GetParamDefinition().GetName() );


    ///CREAMOS UN INLET POR CADA PARAMETRO
    int inletidx = GetInletIndex(param.GetParamDefinition().GetName());
    if (inletidx==-1) {
      moInlet* Inlet = new moInlet();
      if (Inlet) {
        Inlet->Init( param.GetParamDefinition().GetName(), m_Inlets.Count(), param.GetPtr() );
        m_Inlets.Add(Inlet);
      }
    }

		for( MOuint v=0;v<param.GetValuesCount();v++) {
      ResolveValue( param, v );

		}
	}

  MODebug2->Message("moMoldeoObject::CreateConnectors > loaded params & values for Object: " + GetName() + " config:" + GetConfigName() + " label:" + GetLabelName() );
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
          MODebug2->Log( moText("moMoldeoObject::CreateConnectors > ") + this->GetLabelName() + moText(" creating Outlet as parameter \"") + OutletName + "\""  );
          Outlet->Init( OutletName, i, m_Config.GetParam(OutletName).GetPtr());
        } else {
          ///CREAMOS UN OUTLET desde el .cfg, teniendo en cuenta los tipos...
          MODebug2->Log( moText("moMoldeoObject::CreateConnectors > ") + this->GetLabelName() + moText(" Init > creating outlet not as param.") + OutletName  );
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

  m_bConnectorsLoaded = true;

  ///Una vez establecidos los conectores, podemos inicializar el script a su vez....
	//moMoldeoObject::ScriptExeInit();
	ScriptExeInit();

  MODebug2->Message("moMoldeoObject::CreateConnectors > OK! Object: " + GetName() + " config:" + GetConfigName() + " label: " + GetLabelName() );

  */
  	return this.m_bConnectorsLoaded;
  }

  Update(): void {

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
/*
    p_configdefinition.GetParamDefinitions().Empty();
    p_configdefinition.ParamIndexes().Empty();

    p_configdefinition.Set( GetName(), m_MobDefinition.GetTypeStr() );

    p_configdefinition.Add( moText("inlet"), MO_PARAM_INLET );
    p_configdefinition.Add( moText("outlet"), MO_PARAM_OUTLET );
    p_configdefinition.Add(moText("script"), MO_PARAM_SCRIPT);
*/
    return p_configdefinition;
  }

  ScriptExeRun(): void {
    //console.log("moMoldeoObject.ScriptExeRun()");
  }

  ToJSON(): any {
    //super.ToJSON();
    return {};
  }

}

export type moMoldeoObjects = moMoldeoObject[];
