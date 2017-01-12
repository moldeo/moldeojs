
import { moAbstract } from "./mo-abstract";
import { moMoldeoObjectType } from "./mo-moldeo-object-type.enum";
import { MOswitch, MOint } from "./mo-types";
import { moText } from "./mo-text";
import { moConfig } from "./mo-config";


export class moMobState {

  m_Activated : MOswitch;
  m_Selected: MOswitch;

};

export class moMobIndex {
  m_paramindex : MOint;
  m_valueindex : MOint;
};

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

};

export class moMoldeoObject extends moAbstract {
  moid: number;
  name: string;
  label: string;
  m_Config: moConfig;

  constructor() {
    super();
  }
  Update() {}

}
