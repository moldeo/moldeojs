import { MOlong } from "./mo-types";
import { moAbstract } from "./mo-abstract";
import { moText } from "./mo-text";
import { moMoldeoObject } from './mo-moldeo-object';
import { moMoldeoObjectType } from './mo-moldeo-object-type.enum';
import { moResourceType } from './mo-resource-type.enum';
//export { moResourceType } from './mo-resource-type.enum';


/// Recurso
/**
 * ( objeto para cargar y manipular objetos físicos de datos de imágenes,
 * audio, video, 3d, 2d, fuentes, shaders y de cualquier otro tipo extendible por un plugin )
 *  Los recursos son aquellos objetos que implementan funciones de tratamiento de datos, generalmente
 *  localizados en dispositivos físicos, locales o remotos,o que tienen por destino algún tipo de representación.
 *
 *  Aquellos recursos predeterminados dentro de la librería de Moldeo conforman la columna vertebral de las funcionalidades
 *  del Core de Moldeo.
 *  Estos son: moRenderManager, moGLManager, moTextureManager, mo3dModelManager, moShaderManager,
 *  moVideoManager, moSoundManager, moScriptManager, moTimeManager, moFBManager, moMathManager
 *
 *  Un plugin derivado de moResourcePlugin es usado típicamente para acceder a archivos de distintos formatos para luego
 *  administrar estos contenidos en un arreglo interno dinámico evitando redundancias de datos.
 *
 *  Un ejemplo sería el moTextureManager, que administrar la carga de imágenes en texturas de opengl.
 *
 *  Otro ejemplo sería el mo3dModelManager, que administrar la carga de objeto 3d,
 * en este caso del formato .3ds. El mo3dModelManager a su vez
 *  depende del moTextureManager para cargar las texturas especificadas
 * por los materiales de los modelos tridimensionales. Mantener esta coherencia
 *  de los datos en Moldeo es una de las características importantes de su arquitectura.
 * @see moResourceType
 * @see moMoldeoObject
 * @see moTextureManager
 * @see mo3dModelManager
 */
export class moResource extends moMoldeoObject {

  m_ResourceType : moResourceType = moResourceType.MO_RESOURCETYPE_UNDEFINED;
  m_ResourceName : moText = "";

  constructor() {
    super();
    //console.log("moResource::Constructor");
    this.SetType(moMoldeoObjectType.MO_OBJECT_RESOURCE);
  }

  Init(callback?:any): boolean {    
    return super.Init(callback);
  }

  GetResourceType(): moResourceType {
    return this.m_ResourceType;
  }

  SetResourceType( p_restype : moResourceType ): void {
    this.m_ResourceType = p_restype;
  }

};

export type moResources = moResource[];

export class moResourceElement extends moAbstract {
}

export class moAttribute extends moResourceElement {
  buffer : void;
  itemsize : MOlong;
  length : MOlong;
}

export type moAttributeArray = moAttribute[];
