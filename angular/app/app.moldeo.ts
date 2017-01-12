import { Component } from '@angular/core';
//import AbstractForm from '../components/AbstractForm';


var MO_PI = 3.1415926535897932384626433832795
var MO_ON	=	1
var MO_OFF = -1
var MO_ACTIVATED =   1
var MO_DEACTIVATED = -1
var MO_FALSE = 0
var MO_TRUE = 1
var MO_PRESSED = 1
var MO_PULSED = 1
var MO_RELEASED = 0

var MO_SUCCESS = 0
var MO_NOERROR = 0
var MO_ERROR = 65535
var MO_FAIL =	65535
var MO_UNDEFINED = -1

var MO_MAX_DEBUG = 4096
var MO_MAX_TEXTURAS =	512
var MO_MAX_MODELOS = 256

type MOboolean = boolean;
type MOfloat = number;
type MOdouble = number;
type MOulong = number;
type MOlong = number;
type MOint = number;
type MOuint = number;
type MOchar = number;
type MOuchar = number;
type MOswitch = number;

enum moDataType {
  MO_DATA_UNDEFINED=-1,
	MO_DATA_NUMBER,
	MO_DATA_NUMBER_CHAR,
	MO_DATA_NUMBER_INT,
	MO_DATA_NUMBER_LONG,
	MO_DATA_NUMBER_DOUBLE,
	MO_DATA_NUMBER_FLOAT,
	MO_DATA_NUMBER_MIDI,
	MO_DATA_FUNCTION,
	MO_DATA_POINTER,//may be a pointer to struct or to class
	MO_DATA_VECTOR2I,//array of values
	MO_DATA_VECTOR3I,//array of values
	MO_DATA_VECTOR4I,//array of values
	MO_DATA_VECTOR2F,//array of values
	MO_DATA_VECTOR3F,//array of values
	MO_DATA_VECTOR4F,//array of values
	MO_DATA_IMAGESAMPLE,//pointer to an imagesample pointer
	MO_DATA_IMAGESAMPLE_FILTERED,//pointer to a TextureFilter
  MO_DATA_IMAGESAMPLE_TEXTUREBUFFER,//pointer to a texturebuffer pointer
	MO_DATA_SOUNDSAMPLE,//pointer to a soundsample pointer
	MO_DATA_VIDEOSAMPLE,//pointer to a videosample pointer: video buffer
	MO_DATA_FONTPOINTER,
	MO_DATA_3DMODELPOINTER,
	MO_DATA_TEXT,//text,
	MO_DATA_MESSAGE,
	MO_DATA_MESSAGES
};

type moNumber = number;


export class moText extends String {
}

export class moTextHeap {
  array : moText[];
}

type moTextArray = moText[];

export class moDebug {
  moTextHeap;
}

export class moAbstract {

  m_bInitialized: boolean;
  constructor() { this.m_bInitialized = false; }
  Init(): boolean { console.log("moAbstract::Init"); this.m_bInitialized = true; return true; }
  Finish(): boolean { console.log("moAbstract::Finish"); this.m_bInitialized = false; return true; }
  Initialized(): boolean { return this.m_bInitialized; }
}

export class moTextFilterParam {


};

/**
 * moValue
 *
 * All basic data and value definitions
 *
 */

export class moData {

  m_DataType : moDataType;
  m_Number : moNumber;
  m_Text : moText;
  m_DataSize : MOulong;


  m_bFilteredAlpha : boolean;
  m_bFilteredParams : boolean;
  m_AlphaFilter : MOfloat;
  m_pFilterParam : moTextFilterParam;/**pointer or reference*/
  m_pAlphaFilter : moData;/**pointer or reference*/

  m_LastEval : MOdouble;


}

type moDatas = moData[];
type moDataMessage = moDatas;
type moDataMessages = moDataMessage[];

/**
 * moResourceManager
 *
 * All basic resource classes and definitions
 *
 */

enum moResourceType {
	/*UNDEFINED*/
	MO_RESOURCETYPE_UNDEFINED = 0,
	/*INTERNAL CORE*/
	MO_RESOURCETYPE_FILE,
	MO_RESOURCETYPE_VIDEO,
	MO_RESOURCETYPE_NET,
	MO_RESOURCETYPE_FILTER,
	MO_RESOURCETYPE_TIME,
	MO_RESOURCETYPE_DATA,
	MO_RESOURCETYPE_TEXTURE,
	MO_RESOURCETYPE_SOUND,
	MO_RESOURCETYPE_MODEL,
	MO_RESOURCETYPE_FONT,
	MO_RESOURCETYPE_GUI,
	MO_RESOURCETYPE_RENDER,
	MO_RESOURCETYPE_GL,
	MO_RESOURCETYPE_FB,
	MO_RESOURCETYPE_SHADER,
	MO_RESOURCETYPE_SCRIPT,
	MO_RESOURCETYPE_MATH,
	MO_RESOURCETYPE_DEBUG,
	/*EXTRAS*/
	MO_RESOURCETYPE_TEXT,
	MO_RESOURCETYPE_MEMORY,
	MO_RESOURCETYPE_XML,
	MO_RESOURCETYPE_DB,
	MO_RESOURCETYPE_DYNAMICENGINE,
	MO_RESOURCETYPE_DECODER,

	/*RESERVED*/
	MO_RESOURCETYPE_RESERVED1,
	MO_RESOURCETYPE_RESERVED2,
	MO_RESOURCETYPE_RESERVED3,
	MO_RESOURCETYPE_RESERVED4
};

export class moResourceElement extends moAbstract {
}

export class moAttribute extends moResourceElement {
  buffer : void;
  itemsize : MOlong;
  length : MOlong;
}

type moAttributeArray = moAttribute[];


/**
 * moGUIManager
 *
 * All geometry and graphics primitives class
 *
 */

enum moGeometryType {
  MO_GEOMETRY_UNDEFINED=-1,
  MO_GEOMETRY_POINT=0,
  MO_GEOMETRY_BOX=1,
  MO_GEOMETRY_CIRCLE=2,
  MO_GEOMETRY_CYLINDER=3,
  MO_GEOMETRY_SHAPE=4,
  MO_GEOMETRY_PLANE=5,
  MO_GEOMETRY_EXTRUDE=6,
  MO_GEOMETRY_RING=7,
  MO_GEOMETRY_SPHERE=8,
  MO_GEOMETRY_POLYHEDRON=9,
  MO_GEOMETRY_ICOSAHEDRON=10,
  MO_GEOMETRY_DODECAHEDRON=11,
  MO_GEOMETRY_TETRAHEDRON=13,
  MO_GEOMETRY_TEXT=14,
  MO_GEOMETRY_TUBE=15,
  MO_GEOMETRY_MAX=16
};

export class moGeometry extends moResourceElement {
  /*
      moText        m_Name;
        moGeometryType m_Type;

        moPointArray m_Vertices;
        moTCoordArray m_VerticesUvs;
        moVertexArray m_Normals;
        moColorArray    m_Colors;

        MOfloat*       m_VerticesBuffer;
        MOfloat*       m_NormalsBuffer;
        MOfloat*       m_VerticesUVBuffer;
        MOfloat*       m_ColorBuffer;

        moFaceArray m_Faces;//array of triangles, 3 points referencing each an index of m_Vertices.
        moTCoordArray m_FaceVertexUvs;//array of texture coordinates for each vertex, corresponding to each face from m_Faces
        moAttributeArray m_Attributes;
        */
}


export class moPath extends moResourceElement {
}

export class moMaterialBase extends moResourceElement {
}

export class moMaterial extends moMaterialBase {
}

/**
 * mo3dModelManager
 *
 * Managing all 3d scene nodes
 */

export class moSceneNode extends moAbstract {
  /*
      void*   SceneNodeImplementation;

        moGLMatrixf  m_ProjectionMatrix;
        moGLMatrixf  m_ModelMatrix;

        moSceneNodePointerArray m_Childrens;
        moSceneNode* m_Parent;
        MOulong     m_Id;
        moText   m_Name;
  */
}

type moSceneNodeArray = moSceneNode[];

export class moObject3D extends moSceneNode {
}

export class moBone extends moObject3D {
}

export class moSprite extends moObject3D {
}

export class moLine extends moObject3D {
}

export class moLineSegments extends moObject3D {
}

export class moPoints extends moObject3D {
}

export class moLOD extends moObject3D {
}

export class moSkinnedMesh extends moObject3D {
}

export class moSkeleton extends moObject3D {
}

export class moMesh extends moObject3D {
}

export class moShape extends moObject3D {
}

export class moBoxGeometry extends moGeometry {
}

export class moCircleGeometry extends moGeometry {
}

export class moCylinderGeometry extends moGeometry {
}

export class moPolyhedronGeometry extends moGeometry {
}

export class moDodecahedronGeometry extends moGeometry {
}


export class moIcosahedronGeometry extends moGeometry {
}


export class moTetrahedronGeometry extends moGeometry {
}

export class moShapeGeometry extends moGeometry {
}

export class moPlaneGeometry extends moGeometry {
}
export class moExtrudeGeometry extends moGeometry {
}
export class moRingGeometry extends moGeometry {
}
export class moSphereGeometry extends moGeometry {
}
export class moTextGeometry extends moGeometry {
}
export class moTubeGeometry extends moGeometry {
}
export class moAxis3D extends moGeometry {
}
export class moBoundingBox3D extends moGeometry {
}

export class moGuiObject extends moAbstract {
}
export class moWidget extends moGuiObject {
}
export class moWindow extends moWidget {
}
export class mo3dWidget extends moWidget {
}


/**
 * moActions
 */

export class moMoldeoActionType {

}

export class moAction {
  m_ActionType: moMoldeoActionType;
  m_Arguments: moDataMessages;

}

export class moValueBase extends moData {

}
type moValueBases = moValueBase[];

export class moValue {
  m_List: moValueBases;
  constructor(subvalues: Object) {
    this.m_List = [];
  }
}
type moValues = moValue[];


enum moParamType {
	MO_PARAM_ALPHA,			///value type: NUM or FUNCTION
	MO_PARAM_COLOR,			///value type: NUM[4] or FUNCTION[4] or
	MO_PARAM_BLENDING,		///value type: NUM or TEXT (to script or shader for chroma???)
	MO_PARAM_POLYGONMODE,	///value type: NUM or TEXT ( 0:FILL 1:LINE 2:POINT)
	MO_PARAM_SYNC,			///value type: NUM or FUNCTION
	MO_PARAM_PHASE,			///value type: NUM or FUNCTION
	MO_PARAM_TEXT,			///value type: TXT or LNK
	MO_PARAM_TEXTURE,		///value type: TXT or LNK
	MO_PARAM_TEXTUREFOLDER,	///value type: TXT or LNK
	MO_PARAM_FONT,          ///value type: TXT or LNK
	MO_PARAM_3DMODEL,		///value type: TXT or LNK
	MO_PARAM_FILE,		    ///value type: TXT or LNK
	MO_PARAM_MOLDEO_OBJECT,		///value type: TXT or LNK, or XML
	MO_PARAM_OBJECT,		///value type: TXT or LNK, or XML
  MO_PARAM_VIDEO,			///value type: TXT or LNK
	MO_PARAM_SOUND,			///value type: TXT or LNK
	MO_PARAM_NUMERIC,		///value type: NUM
	MO_PARAM_FUNCTION,		///value type: NUM or FUNCTION
	MO_PARAM_TRANSLATEX,    ///value type: NUM or FUNCTION
	MO_PARAM_TRANSLATEY,    ///value type: NUM or FUNCTION
	MO_PARAM_TRANSLATEZ,    ///value type: NUM or FUNCTION
	MO_PARAM_SCALEX,		///value type: NUM or FUNCTION
	MO_PARAM_SCALEY,		///value type: NUM or FUNCTION
	MO_PARAM_SCALEZ,		///value type: NUM or FUNCTION
	MO_PARAM_ROTATEX,		///value type: NUM or FUNCTION
	MO_PARAM_ROTATEY,		///value type: NUM or FUNCTION
	MO_PARAM_ROTATEZ,		///value type: NUM or FUNCTION
	MO_PARAM_SCRIPT,		///value type: TXT or LNK
	MO_PARAM_FILTER,        ///value type: TXT or LNK
	MO_PARAM_COMPOSE,        ///any composition of types
	MO_PARAM_VECTOR,    ///vector of one type
	MO_PARAM_INLET,			///value type: TXT or LNK
	MO_PARAM_OUTLET,			///value type: TXT or LNK
	MO_PARAM_UNDEFINED = -1
};

export class moParam extends moAbstract {

}

type moParams = moParam[];

export class moPreconfig extends moAbstract {
}
type moPreConfigs = moPreconfig[];

enum moTimerState {
  MO_TIMERSTATE_STOPPED,/// Parado, Detenido
  MO_TIMERSTATE_PLAYING,/// Corriendo
  MO_TIMERSTATE_PAUSED/// Pausado
};

export class moTimerAbsolute {
  on : MOboolean;
  pause_on : MOboolean;

  start_tick : MOlong;
  start_last : MOlong;

  duration : MOlong;

  last_duration : MOlong;
  state_str : moText;
  last_step_interval: MOlong;

  state: moTimerState;
  Start() {

  }
  Pause() {

  }
  Stop() {

  }
  State() : moTimerState  {
    return this.state;
  }
  Duration(): MOlong {
    return this.last_duration;
  }
}

export class moTimer extends moTimerAbsolute {

}


enum moParamInterpolationFunction {
    MO_INTERPOLATION_NONE=0,
    MO_INTERPOLATION_LINEAR,
    MO_INTERPOLATION_EASE,
    MO_INTERPOLATION_EASEIN,
    MO_INTERPOLATION_EASEOUT,
    MO_INTERPOLATION_EASEINOUT,
    MO_INTERPOLATION_STEPSTART,
    MO_INTERPOLATION_STEPEND,
    MO_INTERPOLATION_CUBICBEZIER,
    MO_INTERPOLATION_EXPRESSION,
    MO_INTERPOLATION_EASEINOUTQUAD,
    MO_INTERPOLATION_EASEINOUTSIN,
    MO_INTERPOLATION_EASEINOUTCUBIC
};

export class moParamInterpolation {
  m_bIsOn : boolean;
  m_Timer : moTimer;
  m_Duration : MOlong; //in milliseconds
  m_Function : moParamInterpolationFunction;

  m_DataIn : moData;
  m_DataOut : moData;
  m_DataInterpolated : moData;

  m_ValueIn : moValue;
  m_ValueOut : moValue;
  m_ValueInterpolated : moValue;
}

export class moParamDefinition extends moAbstract {
  m_Name : moText;
  m_Type : moParamType;//type of parameter ()
  m_Index : MOint;//index of this parameter on moConfig parameters array

  m_Property : moText;//published or not
  m_Group : moText;
  m_DefaultValue : moValue;
  m_Options : moTextArray;
  m_OptionsStr : moText;
  m_Interpolation : moParamInterpolation;
}
type moParamDefinitions = moParamDefinition[];

export class moParamIndex {
  index: MOint;
  constructor(index: MOint) {
    this.index = index;
  }
}
type moParamIndexes = moParamIndex[];

export class moConfigDefinition extends moAbstract {

  m_ParamDefinitions : moParamDefinitions;
  m_ParamIndexes : moParamIndexes;
  m_ObjectName : moText;
	m_ObjectClass : moText;
}
//type moPreConfigs = moPreconfig[];

export class moConfig extends moAbstract {

    m_ConfigLoaded : MOboolean;
		m_Params : moParams;//los parametros del config
		m_PreConfigs : moPreConfigs;
		m_ConfigDefinition : moConfigDefinition;

		m_MajorVersion : MOint;
		m_MinorVersion : MOint;
		m_FileName : moText;

		m_CurrentParam : MOint;// el indice que indica cual es el parametro actual.
		m_PreconfParamNum : MOint;
		m_PreconfActual: MOint;

    ///solo para poder devolver una referencia
    /*
    static moFont*         m_pFont;
		static moMathFunction* m_pFun;
		static moTextureBuffer* m_pTextureBuffer;
		static moSceneNode*            m_pModel;
		static moVector2d*             m_pVector2d;
		static moVector2i*             m_pVector2i;
		static moVector3d*             m_pVector3d;
		static moVector3i*             m_pVector3i;
		static moVector4d*             m_pVector4d;
		static moVector4i*             m_pVector4i;
		static moDataMessage*          m_pMessage;
		static moDataMessages*         m_pMessages;
		static moSound*                m_pSound;
		static moTexture*              m_pTexture;
    */
}

export class moMobState {

  m_Activated : MOswitch;
  m_Selected: MOswitch;

};

export class moMobIndex {
  m_paramindex : MOint;
  m_valueindex : MOint;
};

/// Modos de combinación
/**
*   Modos de combinación predeterminados
*   Estos valores son referencias para los modos de combinación de colores que suelen usarse y están ya implementados
*   bajo OpenGL a través de la función glBlend()
*/
enum moBlendingModes {
   MO_BLENDING_TRANSPARENCY = 0, /// transparencia
   MO_BLENDING_ADDITIVEALPHA = 1, /// aditivo según transparencia
   MO_BLENDING_MIXING = 2, /// mezcla
   MO_BLENDING_MULTIPLY = 3, /// multipliación
   MO_BLENDING_EXCLUSION = 4, /// exclusión
   MO_BLENDING_ADDITIVE = 5, /// aditivo por color
   MO_BLENDING_OVERLAY = 6, /// sobrecarga
   MO_BLENDING_SUBSTRACTIVE = 7, /// sustracción
   MO_BLENDING_SATURATE = 8, /// saturación
   MO_BLENDINGS = 9 /// cantidad de modos
};

/// Modos de dibujado de polígonos
/**
*   Modos de dibujado de polígonos
*   Estos modos son aquellos predeterminados bajo OpenGL
*
*/
enum moPolygonModes {
   MO_POLYGONMODE_FILL = 0, /// relleno
   MO_POLYGONMODE_LINE = 1, /// sólo líneas
   MO_POLYGONMODE_POINT = 2, /// sólo puntos
   MO_POLYGONMODES = 3 /// cantidad de modos
};

enum moMoldeoObjectType {
	MO_OBJECT_UNDEFINED = -1, /// Objeto indefinido
	MO_OBJECT_EFFECT = 0, /// Objeto dibujable, efecto ( efectos en el orden de dibujado )
	MO_OBJECT_PREEFFECT = 1,/// Objeto dibujable, pre-efecto ( primeros efectos en el orden de dibujado )
	MO_OBJECT_POSTEFFECT = 2,/// Objeto dibujable, post-efecto ( últímos efectos en el orden de dibujado )
	MO_OBJECT_MASTEREFFECT = 3,/// Objeto dibujable, efecto-maestro ( puede controlar otros efectos )
	MO_OBJECT_IODEVICE = 4,/// Dispositivo de entrada/salida, típicamente, interfaces humanas de IO y datos ( teclado, mouse, tableta, tcp, udp, serial )
	MO_OBJECT_RESOURCE = 5,/// Recursos de datos, objetos, imágenes, videos y funcionalidades múltiples
	MO_OBJECT_CONSOLE = 6,/// Objeto principal de administración y dibujado de objetos de Moldeo
	MO_OBJECT_TYPES = 7 /// referencia para la cantidad de tipos de objetos
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

export class moObject extends moAbstract {
  moid: number;
  name: string;
  label: string;
  m_Config: moConfig;

  constructor() {
    super();
  }
  Update() {}

}

export class moTempo extends moAbstract {

};

export class moEffectState extends moMobState {
  /** moTempo, registro del beat del efecto */
  tempo: moTempo;
  /** on, efecto apagado o prendido, apagado: -1, prendido: 1 */
	on : MOswitch;

  /** synchronized, efecto sincronizado con el estado y beat de la consola, en sincro: 1, sin sincro: -1 */
  synchronized: MOswitch;
  /** enabled (OBSOLETO: moEffectState desciende de moMobState que tiene el miembro m_Activated ), si está activo o no, activado: 1 , desactivado: -1*/
  enabled: MOswitch;
  magnitude: MOfloat;
	amplitude : MOfloat;
  /** alpha: nivel de opacidad del efecto [0..1], opaco: 1, transparente: 0 */
  alpha : MOfloat;

  /** tint: nivel de brillo [0..1], luz: 1, oscuridad: 0, */
  tint: MOfloat;  //brillo 0..1

  /** tinr: nivel de rojo de la tinta [0..1], rojo puro: 1, sin rojo: 0 */
  tintr: MOfloat; //rojo 0..1

  /** ting: nivel de verde de la tinta [0..1], verde puro: 1, verde rojo: 0*/
  tintg : MOfloat; //verde 0..1

  /** tinb: nivel de azul de la tinta [0..1], azul puro: 1, azul rojo: 0*/
  tintb: MOfloat; //azul 0..1

  /** tinc: crominancia [0..1], 0: 0, 360: 1 */
  tintc: MOfloat;

  /** tints: saturación [0..1], 0: 0, 100%: 1 */
  tints: MOfloat; ///saturación

  /** fulldebug: información adicional para corrección de errores, descativado: -1, activado: 1 */
  fulldebug: MOswitch;

  /** 3d stereo capable: capacitado para diferenciar visión entre ojo izquierdo y derecho, profundidad, descativado: -1, activado: 1*/
  /*stereo: MOswitch;*/

  Init() {
    this.on = MO_DEACTIVATED;
    this.synchronized = MO_ACTIVATED;
    this.enabled = MO_ACTIVATED;
    this.magnitude = 1.0;
    this.amplitude = 1.0;
		this.alpha = 1.0;

    this.tintr = 1.0;
		this.tintg = 1.0;
		this.tintb = 1.0;

		this.tint = 1.0;
		this.tintc = 0.0;
		this.tints = 0.0;
/*
		this.stereo = MO_DEACTIVATED;
		this.stereoside = MO_STEREO_NONE;
		*/
		this.fulldebug = MO_DEACTIVATED;

		this.tempo.Init();
  }
}

export class moEffect extends moObject {
	m_EffectState: moEffectState;
	Draw() {}
}

export class moPreEffect extends moEffect {
	Draw() {}
}
export class moPostEffect extends moEffect {
	Draw() {}
}
export class moMasterEffect extends moEffect {
	Draw() {}
}

export class moIODevice extends moObject {
}

export class moResource extends moObject {
}

/**
 * Managers ALL
 *
 */

type moResources = moResource[];

export class moFileManager extends moResource { }
export class moVideoManager extends moResource { }
export class moFilterManager extends moResource { }
export class moNetManager extends moResource { }
export class moTimeManager extends moResource { }
export class moDataManager extends moResource { }
export class moFBManager extends moResource { }
export class moGLManager extends moResource { }
export class moRenderManager extends moResource { }
export class moShaderManager extends moResource { }
export class moMathManager extends moResource { }
export class moFontManager extends moResource { }
export class moGUIManager extends moResource { }
export class moScriptManager extends moResource { }
export class moTextureManager extends moResource { }
export class moSoundManager extends moResource { }
export class mo3dModelManager extends moResource { }
export class moDebugManager extends moResource { }
export class moDecoderManager extends moResource { }


export class moResourceManager extends moAbstract {
    MOFileMan : moFileManager;
		MOVideoMan : moVideoManager;
		MOFilterMan : moFilterManager;
		MONetMan : moNetManager;
		MOTimeMan : moTimeManager;
		MODataMan : moDataManager;
		MOFBMan : moFBManager;
		MOGLMan : moGLManager;
		MORenderMan : moRenderManager;
		MOShaderMan : moShaderManager;
		MOMathMan : moMathManager;
		MOFontMan : moFontManager;
		MOGuiMan : moGUIManager;
		MOScriptMan : moScriptManager;
		MOTextureMan : moTextureManager;
		MOSoundMan : moSoundManager;
		MOModelMan : mo3dModelManager;
		MODebugMan : moDebugManager;
		MODecoderMan : moDecoderManager;
		m_Resources : moResources;
 }




export class moEffectParticlesSimple extends moEffect {
	Draw() {}
}

enum moConsoleMode {

  MO_CONSOLE_MODE_LIVE=0,
  MO_CONSOLE_MODE_RECORD_SESSION=1,
  MO_CONSOLE_MODE_PLAY_SESSION=2,
  MO_CONSOLE_MODE_RENDER_SESSION=3,

};

export class moConsoleState {



}

export class moConsole extends moObject {
  m_ConsoleState: string;
  m_Config: moConfig;
  constructor() {
    super();
    this.name = "__console__";
  }
  Init() : boolean {
    return super.Init();
  }

}


@Component({
  selector: 'moldeo',
  template: '<h1>Moldeo Ready</h1>'
})

export class AppMoldeo {
  m_Console: moConsole;
  constructor() {
    console.log("AppMoldeo>constructor");
    this.m_Console = new moConsole();
    console.log(this.m_Console.name);
    this.m_Console.Init();
  }
}
