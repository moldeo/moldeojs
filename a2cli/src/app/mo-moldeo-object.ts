
import { moAbstract } from "./mo-abstract";
import { moScript } from "./mo-script";
import { moMoldeoObjectType } from "./mo-moldeo-object-type.enum";
export { moMoldeoObjectType } from "./mo-moldeo-object-type.enum";
import { MOswitch, MOint } from "./mo-types";
import { moText } from "./mo-text";
import { moConfig, moConfigDefinition } from "./mo-config";
import { moResourceManager } from "./mo-resource-manager";

export class moMobState {

  m_Activated : MOswitch;
  m_Selected: MOswitch;

}

export class moMobIndex {
  m_paramindex : MOint;
  m_valueindex : MOint;
}

export class moMobDefinition {

  m_MoldeoFatherId : MOint;
  m_MoldeoFatherLabelName : moText;

  m_MoldeoId : MOint; /// Identificador de objeto Moldeo
  m_MoldeoLabelName : moText; /// Etiqueta o Identificador de texto de este objeto

  m_Type : moMoldeoObjectType; /// Tipo de Objeto
  m_Name : moText; /// Nombre del objeto (relativo a la clase)
  m_ConfigName : moText; /// Nombre del archivo de configuración
  m_Description : moText;/// Descripción del objeto

  m_MobIndex : moMobIndex; /// Índice referente al archivo de configuración que describe a este objeto

  m_KeyName : moText;/// nombre de la tecla que activa el objeto
  m_Activate: boolean;/// activo al iniciar el proyecto

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
/*
  /// Conectores de salida, Arreglo de moOutlet's
  m_Outlets : moOutlets;

  /// Conectores de entrada, Arreglo de moInlet's
  m_Inlets : moInlets;

  InletScreenWidth : moInlet;
  InletScreenHeight : moInlet;
  InletTimeabs : moInlet;
  InletPreconfig : moInlet;

  m_bConnectorsLoaded : MOboolean;

  __iscript : MOint;
*/
  constructor() {
    super();

    this.m_pResourceManager = null;
    //this.m_Script = "";
    this.m_Config = new moConfig();
    this.m_MobDefinition = new moMobDefinition();
    this.m_MobState = new moMobState();
  }

  Init(): boolean {
    console.log("moMoldeoObject::Init > ", this.m_MobDefinition);
    return super.Init();
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

  GetConfigName() : void {
    this.m_MobDefinition.GetConfigName();
  }

  SetLabelName( p_labelname: moText) : void {
    this.m_MobDefinition.SetLabelName( p_labelname );
  }

  GetLabelName() : void {
    this.m_MobDefinition.GetLabelName();
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

  GetDefinition( p_configdefinition?: moConfigDefinition) : moConfigDefinition {
    return this.m_Config.GetConfigDefinition();
  }

  ToJSON(): any {
    //super.ToJSON();
    return {};
  }

}
