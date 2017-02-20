import * as MO from "moldeojs";
import {
  NULL, moIsTimerStopped,
  MOdouble, MOfloat, MOint, MOuint, MOlong, MOulong, MObyte,
  moVector2f, moVector3f, moVector4f, moMath, moMathd,
  moColor, moText, _m, moSlash, moData, moDataType, moValue, moParam, moParamType,
  moTimer, moGetTicks,
  moAbstract, moMesh, moMaterial, moMaterialBase, moMaterialBasic,
  moInlet, moOutlet, moTempo, moEffectState,
  moTexture, moTextureType, moTextureAnimated, moTextureMemory,
  moTextureBuffer, moTextureManager,
  moGLManager, moGLMatrixf, moRenderManager
}
  from "moldeojs";

var THREE = MO.three;

///Emitter Type
/**
* \if spanish
* <b>"emittertype"</b>: <em>Tipo de emisor</em>
* Parámetro del efecto @ref moParticlesSimple
* El tipo de emisor es la configuración geométrica del espacio dónde nacen las partículas. Algo así como la incubadora de las partículas.
*
* \else
* <b>"emittertype"</b>: <em>Emitter Type is a parameter of the ParticlesSimple Effect Plugin @ref moParticlesSimple</em>
* Parameter of @ref moParticlesSimple
* The emitter type is the geometric base configuration where the particles can be born.
* \endif
*
* \if spanish <h4>Nombre del parámetro:</h4> \else <h4>Parameter name</h4> \endif @ref emittertype
* \if spanish <h4>Todos los parámetros:</h4> \else <h4>All parameters:</h4> \endif @ref ParticlesSimpleParameters
*
* @see moParticlesSimple
* @see moEffectParticlesSimple
*/
export enum moParticlesSimpleEmitterType {
  /// 0: \if spanish Grilla (un rectángulo de "width" x "height") 2D \else  Grid shape emitter 2D \endif
  PARTICLES_EMITTERTYPE_GRID = 0,
  /// 1: \if spanish Esfera (una esfera de "width" longitudes y
  // "height" latitudes) 3D \else Sphere shape emitter ( x=width, y=height, z=depth ) 3D \endif
  PARTICLES_EMITTERTYPE_SPHERE = 1,
  /// 2: \if spanish 2: Tubo ( un tubo de "width" facetas y "height" segmentos) 3D \else Tube shape emitter (3C) \endif
  PARTICLES_EMITTERTYPE_TUBE = 2,
  /// 3: \if Chorro ( colapsados en una línea ) \else Line shape emitter (3d) vector line (x,y,z) \endif
  PARTICLES_EMITTERTYPE_JET = 3,
  /// 4: \if spanish Punto ( colapsados en un punto ) \else point shape, position (x,y,z) \endif
  PARTICLES_EMITTERTYPE_POINT = 4,
  /// 5: \if spanish Trackeador ( reservado para información de sensado ) \else emitter is a connected tracker \endif
  PARTICLES_EMITTERTYPE_TRACKER = 5,
  /// 6: \if spanish Trackeador2 ( reservado para información de sensado ) \else emitter is a secondary connected tracker \endif
  PARTICLES_EMITTERTYPE_TRACKER2 = 6,
  /// 7: \if spanish Espiral ( forma de espiral, "width" ángulos que forman "height" ciclos ) \else Emitter is a spiral \endif
  PARTICLES_EMITTERTYPE_SPIRAL = 7,
  /// 8: \if spanish Círculo ( una ronda de "width"X"height" partículas  ) \else emitter is a circle \endif
  PARTICLES_EMITTERTYPE_CIRCLE = 8
};
export var EMIT = moParticlesSimpleEmitterType;

///Folder Shot Type
/**
*   Folder
*/
export enum moParticlesSimpleFolderShotType {
  /// 0: filename screenshot has a random id
  PARTICLES_SHOTTYPE_FOLDER_RANDOM = 0,
  /// 0: filename screenshot is date based
  PARTICLES_SHOTTYPE_FOLDER_SEQUENTIAL_BY_FILEDATE = 1,
  /// 0: filename screenshot is name based
  PARTICLES_SHOTTYPE_FOLDER_SEQUENTIAL_BY_FILENAME = 2
};
export var SHOTTYPE = moParticlesSimpleFolderShotType;


///Attractor Type
export enum moParticlesSimpleAttractorType {
  /// 0: each particle attract diretly to the same point
  PARTICLES_ATTRACTORTYPE_POINT = 0,
  /// 1: each particle attract perp to a face of the grid
  PARTICLES_ATTRACTORTYPE_GRID = 1,
  /// 2: each particle attract perp to a face of the grid
  PARTICLES_ATTRACTORTYPE_SPHERE = 2,
  ///  3: each particle attract perp to a face of the grid
  PARTICLES_ATTRACTORTYPE_TUBE = 3,
  /// 4: each particle attract perpendicular to jet vector
  PARTICLES_ATTRACTORTYPE_JET = 4,
  /// 5: each particle attract each one to a dot of the tracker
  PARTICLES_ATTRACTORTYPE_TRACKER = 5,
  /// 6: each particle attract each one to a dot of the tracker
  PARTICLES_ATTRACTORTYPE_VERTEX = 6
};
export var ATTYPE = moParticlesSimpleAttractorType;

///Attractor Mode
export enum moParticlesSimpleAttractorMode {
  /// 0: accelerate with no stop
  PARTICLES_ATTRACTORMODE_ACCELERATION = 0,
  /// 1: accelerate, reach and stop instantly
  PARTICLES_ATTRACTORMODE_STICK = 1,
  /// 2: accelerate and bounce....(inverse direction)
  PARTICLES_ATTRACTORMODE_BOUNCE = 2,
  /// 3: accelerate and breaks (generate debris on place)
  PARTICLES_ATTRACTORMODE_BREAKS = 3,
  /// 4: accelerate then brake and slowdown slowly
  PARTICLES_ATTRACTORMODE_BRAKE = 4,
  /// 5: constant speed to attractortype
  PARTICLES_ATTRACTORMODE_LINEAR = 5
};
export var ATTMODE = moParticlesSimpleAttractorMode;

///Behaviour Mode
export enum moParticlesSimpleBehaviourMode {
  /// 0: las partículas son atraídas entre ellas
  PARTICLES_BEHAVIOUR_COHESION = 0,
  /// 1: las partículas son libres y mantienen una distancia mínima de separación
  PARTICLES_BEHAVIOUR_SEPARATION = 1,
  /// 2: las partículas son repelidas entre ellas
  PARTICLES_BEHAVIOUR_AVOIDANCE = 2,
  /// 3: las partículas se alinean y acomodan cristalmente
  PARTICLES_BEHAVIOUR_ALIGNMENT = 3
};
export var BEHAMODE = moParticlesSimpleBehaviourMode;


///Texture Mode
export enum moParticlesSimpleTextureMode {
    /// 0: One Same Texture Image for each Particle (taken from texture)
    PARTICLES_TEXTUREMODE_UNIT = 0,
    /// 1: Same Texture Image Divided In Different Fragments for each Particle (taken from texture, divided in width*height)
    PARTICLES_TEXTUREMODE_PATCH = 1,
    /// 2: Many Different Textures Image for each Particle ( taken from texturefolder )
    PARTICLES_TEXTUREMODE_MANY = 2,
    /// 3: Many textures/particle to construct a patched texture one
    // ( taken from texturefolder, build the one defined on texture parameter,
    // or from a folder, call to Shot(source) then ReInit to build... )
    PARTICLES_TEXTUREMODE_MANY2PATCH = 3,
    /// 4: Many Different Textures Image for each Particle ( taken from texturefolder in loading order! )
    PARTICLES_TEXTUREMODE_MANYBYORDER = 4

};
export var TEXMODE = moParticlesSimpleTextureMode;

export const TextureModeOptions: MO.moTextArray = [];

///Creation Method
export enum moParticlesCreationMethod {
    /// 0: \if spanish Alineado. Los lugares de nacimientos están alineados
    // con el orden de los vertices del emisor.  \else Aligned. Particles birth
    // position follow the emitter vertices order. \endif
    PARTICLES_CREATIONMETHOD_LINEAR=0,
    /// 1: \if spanish Superficial. Los lugares de nacimientos están diseminados
    // sobre la superficie del emisor aleatoriamente.  \else Surface. Particles
    // birth position follow randomly the surface of the emitter. \endif
    PARTICLES_CREATIONMETHOD_PLANAR=1,
    ///  2: \if spanish Volumétrico. Los lugares de nacimientos están diseminados
    //  dentro del volumen del emisor aleatoriamente.  \else Volumetric. Particles
    // birth position are into the volume of the emitter. \endif
    PARTICLES_CREATIONMETHOD_VOLUMETRIC=2,
    /// 3: \if spanish Central. Los lugares de nacimiento están colapsados en
    // el centro del emisor. \else Central. Particles birth position are collapsed
    // into the emitter center position. \endif
    PARTICLES_CREATIONMETHOD_CENTER=3
};
export var CREAMODE = moParticlesCreationMethod;

///Random Method
export enum moParticlesRandomMethod {
    ///  0: \if spanish Ruidoso. \else Noisy \endif
    PARTICLES_RANDOMMETHOD_NOISY=0,
    ///  1: \if spanish Co-Lineal. \else Co-Linear \endif
    PARTICLES_RANDOMMETHOD_COLINEAR=1,
    ///  2: \if spanish Perpendicular. \else Perpendicular. \endif
    PARTICLES_RANDOMMETHOD_PERPENDICULAR=2
};
export var RANDMODE = moParticlesRandomMethod;

///Orientation Method
export enum moParticlesOrientationMode {
    /// 0: \if spanish Fijo. \else Default position. \endif
    PARTICLES_ORIENTATIONMODE_FIXED=0,
    /// 1: \if spanish De frente al observador. \else Facing camera. \endif
    PARTICLES_ORIENTATIONMODE_CAMERA=1,
    /// 2: \if spanish Según el vector velocidad. \else Following motion direction. \endif
    PARTICLES_ORIENTATIONMODE_MOTION=2,
    /// 3: \if spanish Según el vector aceleración. \else Following acceleration
    // direction vector. \endif
    PARTICLES_ORIENTATIONMODE_ACCELERATION=3,
    /// 4: \if spanish Según la normal de la generatriz \else Following generator
    // normal vector \endif
    PARTICLES_ORIENTATIONMODE_NORMAL=4,
    /// 5: \if spanish Según la normal personalizada en los parametros
    // NORMAL_PARTICLEX|Y|Z \else Following generator normal vector defined
    // in parameters NORMAL_PARTICLEX|Y|Z \endif
    PARTICLES_ORIENTATIONMODE_CUSTOMNORMAL=5
};
export var ORIMODE = moParticlesOrientationMode;

export enum moParticlesOrderingMode {
    /// 0: \if spanish Sin reordenamiento espacial, sigue el orden de la matriz
    // WxH. \else no reordering for drawing \endif
    PARTICLES_ORDERING_MODE_NONE=0,
    /// 1: \if spanish Ordenamiento por profundidad de pixel (ZBuffer) \else
    // Ordering using depth field (ZBuffer) \endif
    PARTICLES_ORDERING_MODE_ZDEPTHTEST=1,
    /// 2: \if spanish Ordenamiento por coordenada Z \else Ordering using z
    // coordinate \endif
    PARTICLES_ORDERING_MODE_ZPOSITION=2,
    /// 3: \if spanish Ordenamiento por distancia a la cámara \else Ordering
    // using camera distance to particle \endif
    PARTICLES_ORDERING_MODE_COMPLETE=3
};
export var ORDMODE = moParticlesOrderingMode;


export enum moParticlesSimpleLightMode {
  /// 0: \if spanish Sin luces. \else No lights \endif
  PARTICLES_LIGHTMODE_NONE=0,
  /// 1: point \if spanish Luz omnidireccional \else Omnidirectional light \endif
  PARTICLES_LIGHTMODE_OMNI=1,
  /// 1: spot \if spanish Luz direccional \else Directional light \endif
  PARTICLES_LIGHTMODE_SPOT=2
};
export var LIGHTMODE = moParticlesSimpleLightMode;


export enum moParticlesSimpleParamIndex {
  PARTICLES_INLET=0,
  PARTICLES_OUTLET,
  PARTICLES_SCRIPT,
	PARTICLES_ALPHA,
	PARTICLES_COLOR,
	PARTICLES_SYNC,
	PARTICLES_PHASE,
	PARTICLES_PARTICLECOLOR,
	PARTICLES_FONT,
	PARTICLES_TEXT,
	PARTICLES_ORTHO,

	PARTICLES_TEXTURE,
	PARTICLES_FOLDERS,
	PARTICLES_TEXTUREMODE,
	PARTICLES_BLENDING,

	PARTICLES_WIDTH,
	PARTICLES_HEIGHT,
	PARTICLES_SIZEX,
	PARTICLES_SIZEY,
	PARTICLES_SIZEZ,

	PARTICLES_GRAVITY,
	PARTICLES_VISCOSITY,

	PARTICLES_MAXAGE,
	PARTICLES_EMITIONPERIOD,
	PARTICLES_EMITIONRATE,
	PARTICLES_DEATHPERIOD,
  PARTICLES_SCRIPT2,

	PARTICLES_FADEIN,
	PARTICLES_FADEOUT,
	PARTICLES_SIZEIN,
	PARTICLES_SIZEOUT,

	PARTICLES_RANDOMMETHOD,
	PARTICLES_CREATIONMETHOD,
	PARTICLES_ORIENTATIONMODE,

	PARTICLES_RANDOMPOSITION,
	PARTICLES_RANDOMPOSITION_X,
	PARTICLES_RANDOMPOSITION_Y,
	PARTICLES_RANDOMPOSITION_Z,

	PARTICLES_RANDOMVELOCITY,
	PARTICLES_RANDOMVELOCITY_X,
	PARTICLES_RANDOMVELOCITY_Y,
	PARTICLES_RANDOMVELOCITY_Z,

	PARTICLES_RANDOMMOTION,
	PARTICLES_RANDOMMOTION_X,
	PARTICLES_RANDOMMOTION_Y,
	PARTICLES_RANDOMMOTION_Z,


	PARTICLES_EMITTERTYPE,
	PARTICLES_EMITTERVECTOR_X,
	PARTICLES_EMITTERVECTOR_Y,
	PARTICLES_EMITTERVECTOR_Z,

	PARTICLES_ATTRACTORTYPE,
	PARTICLES_ATTRACTORMODE,
	PARTICLES_ATTRACTORVECTOR_X,
	PARTICLES_ATTRACTORVECTOR_Y,
	PARTICLES_ATTRACTORVECTOR_Z,

	PARTICLES_ROTATEX_PARTICLE,
	PARTICLES_ROTATEY_PARTICLE,
	PARTICLES_ROTATEZ_PARTICLE,
  PARTICLES_SCALEX_PARTICLE,
	PARTICLES_SCALEY_PARTICLE,
	PARTICLES_SCALEZ_PARTICLE,

	PARTICLES_TIMETOREVELATION,
	PARTICLES_TIMEOFREVELATION,
	PARTICLES_TIMETORESTORATION,
	PARTICLES_TIMEOFRESTORATION,
	PARTICLES_DRAWINGFEATURES,

	PARTICLES_TRANSLATEX,
	PARTICLES_TRANSLATEY,
	PARTICLES_TRANSLATEZ,
  PARTICLES_SCALEX,
	PARTICLES_SCALEY,
	PARTICLES_SCALEZ,
	PARTICLES_ROTATEX,
	PARTICLES_ROTATEY,
	PARTICLES_ROTATEZ,
	PARTICLES_EYEX,
	PARTICLES_EYEY,
	PARTICLES_EYEZ,
	PARTICLES_VIEWX,
	PARTICLES_VIEWY,
	PARTICLES_VIEWZ,
	PARTICLES_UPVIEWX,
	PARTICLES_UPVIEWY,
	PARTICLES_UPVIEWZ,
  PARTICLES_ORDERING_MODE,
  PARTICLES_LIGHTMODE,
  PARTICLES_LIGHTX,
  PARTICLES_LIGHTY,
  PARTICLES_LIGHTZ
};
export var PAR = moParticlesSimpleParamIndex;
export var PARS = { "inlet": 0, "outlet": 1 };
export var PARA = { "0": "inlet", "1": "outlet" };
export function moR(idx: number) : moText {
  var str = "";
  str = PARA[""+idx];
  return str;
}
export function moDefineParamIndex(idx: number, name : moText ) {
  PARS["" + name] = idx;
  PARA[""+idx] = ""+name;
}

export class moParticlesSimple extends moAbstract {

  Geometry : any;
  Material : any;
  Mesh : any;
  Model: any;

  Pos3d : moVector3f = new moVector3f(0.0,0.0,0.0); ///Position absolute
  Destination : moVector3f = new moVector3f(0.0,0.0,0.0); ///Destination
  Velocity : moVector3f = new moVector3f(0.0,0.0,0.0);///Speed or Velocity vector
  Force: moVector3f = new moVector3f(0.0, 0.0, 0.0);///Self force (propulsion) of the particle

  ///particle orientation
    /**
        Dependant on Orientation Mode

    */
  U : moVector3f = new moVector3f(0.0,0.0,0.0);
  V : moVector3f = new moVector3f(0.0,0.0,0.0);
  W: moVector3f = new moVector3f(0.0, 0.0, 0.0);

  ///Differentials of position (speed) and velocity (acceleration)
  dpdt : moVector3f = new moVector3f(0.0,0.0,0.0);
  dvdt : moVector3f = new moVector3f(0.0,0.0,0.0);


  ///position relative to grid...
  /**
      Works for indexation on a grid relative geometry ( bidimentional array )
      X > i [0..width]
      Y > j [0..height]
  */
  Pos : moVector2f = new moVector2f(0.0,0.0);///Particles Vectors indexation on a grid relative geometry ( bidimentional array )
  TCoord : moVector2f = new moVector2f(0.0,0.0);///texture coordinate
  TCoord2 : moVector2f = new moVector2f(0.0,0.0);///texture coordinate
  ///particle size
  /**
      This size is dependent on particles number and Emitter size
      Size.X > EmitterSize.x / m_cols
      Size.Y > EmitterSize.y / m_rows
  */
  Size: moVector2f = new moVector2f(0.0, 0.0);///particle size
  TSize : moVector2f = new moVector2f(0.0,0.0);///particle texture size
  TSize2 : moVector2f = new moVector2f(0.0,0.0);///particle texture size
  Color : moColor = new moColor(1.0,1.0,1.0);

  Mass: MOdouble = 1.0;  ///Mass in g of the particle
  Alpha : MOdouble = 1.0;///Transparency of the particle

  Scale: MOdouble = 1.0;    ///Scale of the particle
  Rotation : moVector3f = new moVector3f(0.0,0.0,0.0);///Angle of the particle

  ImageProportion: MOdouble = 1.0;
  ImageIndex : MOint = 0;

  ///No motion
  Fixed: boolean = false;

  ///Exists but is invisible
  Visible: boolean = false;
  ///Captured
  /**
      Captured by the general script, out of normal flow
  */
  Captured : boolean = false;

  /* Graphics  */
  ///Unique ID of OpenGL Texture
  GLId : MOint = -1;///para asociar la textura al momento de la creación
  GLId2 : MOint = -1;
  pTextureMemory : MO.moTexture = NULL;

  MOId : MOint = -1;

  ActualFrame : MOuint = 0;
  FrameCount : MOuint = 0;
  FramePS : MOuint = 0;

  FrameForced : boolean = false;

  ///Texture image proportion Width / Height ....
  Age: moTimer = new moTimer();

  ///Age of the particle
  MaxAge : MOdouble = 0; //depends on Physics.MaxAge first....


  ViewDepth: MOdouble;

  constructor() {
    super();
    this.Age.Stop();
  }

};

class moParticlesSimplePhysics extends moAbstract {

  constructor() {
    super();
    this.m_GravityCenter = new moVector3f(0.0,0.0,0.0);
    this.m_GravityVector = new moVector3f(0.0,0.0,0.0);
    this.m_GravityDisc = new moVector3f(0.0,0.0,0.0);

    this.m_Plane = new moVector3f(0.0,0.0,0.0);

    this.m_MaxAge = 0;
    this.m_EmitionPeriod = 0;
    this.m_EmitionRate = 0;
    this.m_DeathPeriod = 0;

    this.m_CreationMethod = CREAMODE.PARTICLES_CREATIONMETHOD_LINEAR;
    this.m_RandomMethod = RANDMODE.PARTICLES_RANDOMMETHOD_NOISY;
    this.m_OrientationMode = ORIMODE.PARTICLES_ORIENTATIONMODE_FIXED;
    this.m_OrderingMode = ORDMODE.PARTICLES_ORDERING_MODE_NONE;

    this.m_FadeIn = 0.0;
    this.m_FadeOut = 0.0;
    this.m_SizeIn = 0.0;
    this.m_SizeOut = 0.0;

    this.m_EmitterType = EMIT.PARTICLES_EMITTERTYPE_GRID;
    this.m_EmitterSize = new moVector3f( 0.0, 0.0, 0.0 );
    this.m_EmitterVector = new moVector3f( 0.0, 0.0, 0.0 );

    this.m_AttractorType = ATTYPE.PARTICLES_ATTRACTORTYPE_POINT;
    this.m_AttractorMode = ATTMODE.PARTICLES_ATTRACTORMODE_ACCELERATION;
    this.m_AttractorVector = new moVector3f( 0.0, 0.0, 0.0 );

    this.m_EyeVector = new moVector3f( 0.0, 0.0, 0.0 );

    this.m_RandomVelocity = 0.0;
    this.m_VelocityVector = new moVector3f( 0.0, 0.0, 0.0 );

    this.m_RandomPosition = 0.0;
    this.m_PositionVector = new moVector3f( 0.0, 0.0, 0.0 );

    this.m_RandomMotion = 0.0;
    this.m_MotionVector = new moVector3f( 0.0, 0.0, 0.0 );

    this.m_UpViewVector = new moVector3f( 0.0, 1.0, 0.0 );

    this.gravitational = 0.0;
    this.viscousdrag = 0.0;

    this.EmitionTimer = new moTimer();
    this.EmitionTimer.Stop();

    this.m_ParticleScript = "";

    this.m_pLastBordParticle = NULL;

  }

  m_GravityCenter : moVector3f;//x,y,z,intensity
  m_GravityVector : moVector3f;//x,y,z,intensity
  m_GravityDisc : moVector3f;//normal x, normal y, normal z,intensity

  m_Plane : moVector3f;

  m_MaxAge : MOlong;
  m_EmitionPeriod : MOlong;
  m_EmitionRate : MOlong;
  m_DeathPeriod : MOlong;

  m_CreationMethod : moParticlesCreationMethod;
  m_RandomMethod : moParticlesRandomMethod;
  m_OrientationMode : moParticlesOrientationMode;
  m_OrderingMode : moParticlesOrderingMode;

  m_FadeIn : MOdouble;
  m_FadeOut : MOdouble;
  m_SizeIn : MOdouble;
  m_SizeOut : MOdouble;

  m_EmitterType : moParticlesSimpleEmitterType;
  m_EmitterVector : moVector3f;
  m_EmitterSize : moVector3f;

  m_AttractorType : moParticlesSimpleAttractorType;
  m_AttractorMode : moParticlesSimpleAttractorMode;
  m_AttractorVector : moVector3f;

  m_EyeVector : moVector3f;
  m_TargetViewVector : moVector3f;
  m_UpViewVector : moVector3f;
  m_SourceLightVector : moVector3f;
  m_SourceLighMode : moParticlesSimpleLightMode;

  m_RandomVelocity : MOdouble;
  m_VelocityVector : moVector3f;

  m_RandomPosition : MOdouble;
  m_PositionVector : moVector3f;

  m_RandomMotion : MOdouble;
  m_MotionVector : moVector3f;

  gravitational : MOdouble;
  viscousdrag : MOdouble;

  EmitionTimer : moTimer;

  m_ParticleScript : moText;

  m_pLastBordParticle : moParticlesSimple;


};


export enum enumRevelationStatus {

    PARTICLES_FULLRESTORED = 0,
    PARTICLES_REVEALING = 1,
    PARTICLES_REVEALINGALL = 2,
    PARTICLES_FULLREVEALED = 3,
    PARTICLES_RESTORING = 4,
    PARTICLES_RESTORINGALL = 5
};
export var REVSTA = enumRevelationStatus;

export type moParticlesSimpleArray = moParticlesSimple[];

//typedef std::map< double, moParticlesSimple* > TMapDepthToParticleSimple;
export type TMapDepthToParticleSimple = {};

export class moEffectParticlesSimple extends MO.moEffect {

  mouse : moVector2f;
  raycaster: THREE.Raycaster;
  intersects : any;

  RM: MO.moRenderManager;
  GL: MO.moGLManager;

  Plane: MO.moPlaneGeometry;
  Mat: MO.moMaterialBasic;
  Camera: MO.moCamera3D;
  Model: MO.moGLMatrixf;
  Mesh: MO.moMesh;
  Scene: MO.moSceneNode;
  GroupedParticles: MO.moGroup;

  m_pParticleTime : moInlet;
  m_pParticleIndex : moInlet;

  m_ParticlesSimpleArrayOrdered : moParticlesSimpleArray = [];
  //std::vector < moParticlesSimple* >  m_ParticlesSimpleVector;
  m_ParticlesSimpleVector: moParticlesSimpleArray = [];

  m_ParticlesSimpleArray : moParticlesSimpleArray = [];
  m_ParticlesSimpleArrayTmp : moParticlesSimpleArray = [];
  m_Physics : moParticlesSimplePhysics =  new moParticlesSimplePhysics();

  m_bTrackerInit : boolean;
  //m_pTrackerData : moTrackerSystemData;
  m_InletTrackerSystemIndex : MOint;
/*
        #ifdef USE_TUIO
        moTUIOSystemData*       m_pTUIOData;
        MOint                   m_InletTuioSystemIndex;
        #endif
*/

  m_TrackerBarycenter : moVector2f;

  //setUpLighting() : void;

  m_rows : MOint;
  m_cols : MOint;
  normalf : MOfloat; ///width of full floor usually 100.0

  time_tofull_revelation : MOlong;
  time_tofull_restoration : MOlong;
  time_of_revelation : MOlong;
  time_of_restoration : MOlong;
  drawing_features : MOlong; /// 0: nothing 1: motion  2: all
  texture_mode : MOlong;


  ortho : boolean;

///internal
  MotionTimer : moTimer = new moTimer();

  TimerFullRevelation : moTimer = new moTimer(); ///begins on first motion activity!!!!
  TimerFullRestoration : moTimer = new moTimer();///begins on full revelation finished....
  TimerOfRevelation : moTimer = new moTimer(); ///begins on revealing all
  TimerOfRestoration : moTimer = new moTimer();///begins on restoring all

  FeatureActivity : moTimer = new moTimer();///start on first feature activity, ends on
  MotionActivity : moTimer = new moTimer();///start on first motion activity, ends on no motion
  NoMotionActivity : moTimer = new moTimer();///start on no motion, ends on first motion activity

  revelation_status : enumRevelationStatus; /// 5: full revealed 0: full hidden

  m_Rate : MOlong;

  last_tick : MOlong;

  //special for script
  pTextureDest : moTexture;
  pSubSample : moTexture;
  samplebuffer : MObyte[];

  glidori : MOint;
  glid : MOint;
  frame : MOint;

  original_width : MOint;
  original_height : MOint;
  original_proportion : MOfloat;

  emiper : MOlong;
  emiperi : MOlong;

  /*
    midi_red, midi_green, midi_blue;
    midi_maxage; //in millis
    midi_emitionperiod;//in millisec
    midi_emitionrate; // n per emitionperiod
    midi_randomvelocity; //inicial vel
    midi_randommotion; //motion dynamic
  */
    tx: MOdouble;
    ty: MOdouble;
    tz: MOdouble;
    sx: MOdouble;
    sy: MOdouble;
    sz: MOdouble;
    rx: MOdouble;
    ry: MOdouble;
    rz: MOdouble;

    m_Rot : moVector4f;//[4]
    m_TS : moVector4f;//[4]

    m_OrderedParticles : TMapDepthToParticleSimple;
    m_OrderingMode : moParticlesOrderingMode;

    dtrel : MOdouble;
    dt : MOdouble;
    gral_ticks : MOlong;

    constructor() {
      super();
      this.SetName("particlessimple");
    }

    Init(callback?:any): boolean {
      this.RM = this.m_pResourceManager.GetRenderMan();
      this.GL = this.m_pResourceManager.GetGLMan();

      ///IMPORTANT: add inlets before PreInit so inlets name are availables for function variables!!
      this.m_pParticleTime = new moInlet();

      if (this.m_pParticleTime) {
        this.m_pParticleTime.Init( "particletime", this.m_Inlets.length, "DOUBLE" );
        this.m_Inlets.push( this.m_pParticleTime );
        this.m_pParticleTime.GetData().SetDouble(0.0);
      }

      this.m_pParticleIndex = new moInlet();

      if (this.m_pParticleIndex) {
        this.m_pParticleIndex.Init( "particleindex", this.m_Inlets.length, "LONG" );
        this.m_Inlets.push( this.m_pParticleIndex );
        this.m_pParticleIndex.GetData().SetLong(0);
      }


      console.log(`moEffect${this.GetName()}.Init ${this.GetName()}`);
      if (this.PreInit((res) => {

        moDefineParamIndex( PAR.PARTICLES_INLET, _m("inlet") );
        moDefineParamIndex( PAR.PARTICLES_OUTLET, _m("outlet") );
        moDefineParamIndex( PAR.PARTICLES_SCRIPT, _m("script") );

        moDefineParamIndex( PAR.PARTICLES_ALPHA, _m("alpha") );
        moDefineParamIndex( PAR.PARTICLES_COLOR, _m("color") );
        moDefineParamIndex( PAR.PARTICLES_SYNC, _m("syncro") );
        moDefineParamIndex( PAR.PARTICLES_PHASE, _m("phase") );
        moDefineParamIndex( PAR.PARTICLES_PARTICLECOLOR, _m("particlecolor") );
        moDefineParamIndex( PAR.PARTICLES_FONT, _m("font") );
        moDefineParamIndex( PAR.PARTICLES_TEXT, _m("text") );
        moDefineParamIndex( PAR.PARTICLES_ORTHO, _m("ortho") );


        moDefineParamIndex( PAR.PARTICLES_TEXTURE, _m("texture") );
        moDefineParamIndex( PAR.PARTICLES_FOLDERS, _m("folders") );
        moDefineParamIndex( PAR.PARTICLES_TEXTUREMODE, _m("texture_mode") );
        moDefineParamIndex( PAR.PARTICLES_BLENDING, _m("blending") );

        moDefineParamIndex( PAR.PARTICLES_WIDTH, _m("width") );
        moDefineParamIndex( PAR.PARTICLES_HEIGHT, _m("height") );
        moDefineParamIndex( PAR.PARTICLES_SIZEX, _m("sizex") );
        moDefineParamIndex( PAR.PARTICLES_SIZEY, _m("sizey") );
        moDefineParamIndex( PAR.PARTICLES_SIZEZ, _m("sizez") );

        moDefineParamIndex( PAR.PARTICLES_GRAVITY, _m("gravity") );
        moDefineParamIndex( PAR.PARTICLES_VISCOSITY, _m("viscosity") );

        moDefineParamIndex( PAR.PARTICLES_MAXAGE, _m("maxage") );
        moDefineParamIndex( PAR.PARTICLES_EMITIONPERIOD, _m("emitionperiod") );
        moDefineParamIndex( PAR.PARTICLES_EMITIONRATE, _m("emitionrate") );
        moDefineParamIndex( PAR.PARTICLES_DEATHPERIOD, _m("deathperiod") );
        moDefineParamIndex( PAR.PARTICLES_SCRIPT2, _m("particlescript") );

        moDefineParamIndex( PAR.PARTICLES_FADEIN, _m("fadein") );
        moDefineParamIndex( PAR.PARTICLES_FADEOUT, _m("fadeout") );
        moDefineParamIndex( PAR.PARTICLES_SIZEIN, _m("sizein") );
        moDefineParamIndex( PAR.PARTICLES_SIZEOUT, _m("sizeout") );

        moDefineParamIndex( PAR.PARTICLES_RANDOMMETHOD, _m("randommethod") );
        moDefineParamIndex( PAR.PARTICLES_CREATIONMETHOD, _m("creationmethod") );
        moDefineParamIndex( PAR.PARTICLES_ORIENTATIONMODE, _m("orientationmode") );

        moDefineParamIndex( PAR.PARTICLES_RANDOMPOSITION, _m("randomposition") );
        moDefineParamIndex( PAR.PARTICLES_RANDOMPOSITION_X, _m("randompositionx") );
        moDefineParamIndex( PAR.PARTICLES_RANDOMPOSITION_Y, _m("randompositiony") );
        moDefineParamIndex( PAR.PARTICLES_RANDOMPOSITION_Z, _m("randompositionz") );

        moDefineParamIndex( PAR.PARTICLES_RANDOMVELOCITY, _m("randomvelocity") );
        moDefineParamIndex( PAR.PARTICLES_RANDOMVELOCITY_X, _m("randomvelocityx") );
        moDefineParamIndex( PAR.PARTICLES_RANDOMVELOCITY_Y, _m("randomvelocityy") );
        moDefineParamIndex( PAR.PARTICLES_RANDOMVELOCITY_Z, _m("randomvelocityz") );

        moDefineParamIndex( PAR.PARTICLES_RANDOMMOTION, _m("randommotion") );
        moDefineParamIndex( PAR.PARTICLES_RANDOMMOTION_X, _m("randommotionx") );
        moDefineParamIndex( PAR.PARTICLES_RANDOMMOTION_Y, _m("randommotiony") );
        moDefineParamIndex( PAR.PARTICLES_RANDOMMOTION_Z, _m("randommotionz") );

        moDefineParamIndex( PAR.PARTICLES_EMITTERTYPE, _m("emittertype") );
        moDefineParamIndex( PAR.PARTICLES_EMITTERVECTOR_X, _m("emittervectorx") );
        moDefineParamIndex( PAR.PARTICLES_EMITTERVECTOR_Y, _m("emittervectory") );
        moDefineParamIndex( PAR.PARTICLES_EMITTERVECTOR_Z, _m("emittervectorz") );

        moDefineParamIndex( PAR.PARTICLES_ATTRACTORTYPE, _m("attractortype") );
        moDefineParamIndex( PAR.PARTICLES_ATTRACTORMODE, _m("attractormode") );
        moDefineParamIndex( PAR.PARTICLES_ATTRACTORVECTOR_X, _m("attractorvectorx") );
        moDefineParamIndex( PAR.PARTICLES_ATTRACTORVECTOR_Y, _m("attractorvectory") );
        moDefineParamIndex( PAR.PARTICLES_ATTRACTORVECTOR_Z, _m("attractorvectorz") );


        moDefineParamIndex( PAR.PARTICLES_SCALEX_PARTICLE, _m("scalex_particle") );
        moDefineParamIndex( PAR.PARTICLES_SCALEY_PARTICLE, _m("scaley_particle") );
        moDefineParamIndex( PAR.PARTICLES_SCALEZ_PARTICLE, _m("scalez_particle") );
        moDefineParamIndex( PAR.PARTICLES_ROTATEX_PARTICLE, _m("rotatex_particle") );
        moDefineParamIndex( PAR.PARTICLES_ROTATEY_PARTICLE, _m("rotatey_particle") );
        moDefineParamIndex( PAR.PARTICLES_ROTATEZ_PARTICLE, _m("rotatez_particle") );

        moDefineParamIndex( PAR.PARTICLES_TIMETOREVELATION, _m("time_to_revelation") );
        moDefineParamIndex( PAR.PARTICLES_TIMEOFREVELATION, _m("time_of_revelation") );
        moDefineParamIndex( PAR.PARTICLES_TIMETORESTORATION, _m("time_to_restoration") );
        moDefineParamIndex( PAR.PARTICLES_TIMEOFRESTORATION, _m("time_of_restoration") );
        moDefineParamIndex( PAR.PARTICLES_DRAWINGFEATURES, _m("drawing_features") );

        moDefineParamIndex( PAR.PARTICLES_TRANSLATEX, _m("translatex") );
        moDefineParamIndex( PAR.PARTICLES_TRANSLATEY, _m("translatey") );
        moDefineParamIndex( PAR.PARTICLES_TRANSLATEZ, _m("translatez") );
        moDefineParamIndex( PAR.PARTICLES_SCALEX, _m("scalex") );
        moDefineParamIndex( PAR.PARTICLES_SCALEY, _m("scaley") );
        moDefineParamIndex( PAR.PARTICLES_SCALEZ, _m("scalez") );
        moDefineParamIndex( PAR.PARTICLES_ROTATEX, _m("rotatex") );
        moDefineParamIndex( PAR.PARTICLES_ROTATEY, _m("rotatey") );
        moDefineParamIndex( PAR.PARTICLES_ROTATEZ, _m("rotatez") );
        moDefineParamIndex( PAR.PARTICLES_EYEX, _m("eyex") );
        moDefineParamIndex( PAR.PARTICLES_EYEY, _m("eyey") );
        moDefineParamIndex( PAR.PARTICLES_EYEZ, _m("eyez") );
        moDefineParamIndex( PAR.PARTICLES_VIEWX, _m("viewx") );
        moDefineParamIndex( PAR.PARTICLES_VIEWY, _m("viewy") );
        moDefineParamIndex( PAR.PARTICLES_VIEWZ, _m("viewz") );
        moDefineParamIndex( PAR.PARTICLES_UPVIEWX, _m("upviewx") );
        moDefineParamIndex( PAR.PARTICLES_UPVIEWY, _m("upviewy") );
        moDefineParamIndex( PAR.PARTICLES_UPVIEWZ, _m("upviewz") );
        moDefineParamIndex( PAR.PARTICLES_ORDERING_MODE, _m("orderingmode") );
        moDefineParamIndex( PAR.PARTICLES_LIGHTMODE, _m("lightmode") );
        moDefineParamIndex( PAR.PARTICLES_LIGHTX, _m("lightx") );
        moDefineParamIndex( PAR.PARTICLES_LIGHTY, _m("lighty") );
        moDefineParamIndex( PAR.PARTICLES_LIGHTZ, _m("lightz") );

        //console.log("attractormode:", moR(PAR.PARTICLES_ATTRACTORMODE) );

        this.m_Physics.m_ParticleScript = "";

        this.m_Rate = 0;
        this.last_tick = 0;
        this.frame = 0;

        this.ortho = false;

        //this.m_bTrackerInit = false;
        //this.m_pTrackerData = NULL;


        this.UpdateParameters();

        this.ResetTimers();

        this.InitParticlesSimple(  this.m_Config.Int( "width" ), this.m_Config.Int( "height" ));


        this.pTextureDest = NULL;
        this.pSubSample = NULL;
        this.samplebuffer = NULL;

        this.glidori  = 0;
        this.glid = 0;
        this.original_width = 0;
        this.original_height = 0;
        this.original_proportion = 1.0;

        //console.log(`ParticlesSimple ${this.GetLabelName()}`, this );
        if (callback) callback(res);
      }) == false) {
        return false;
      }
/*
      midi_red = midi_green = midi_blue = 1.0;
      midi_maxage = 1.0; //in millis
      midi_emitionperiod = 1.0;//in millisec
      midi_emitionrate = 1.0; // n per emitionperiod
      midi_randomvelocity = 1.0; //inicial vel
      midi_randommotion = 1.0; //motion dynamic
      #ifdef USE_TUIO
      m_InletTuioSystemIndex = GetInletIndex("TUIOSYSTEM");
      #endif
      m_InletTrackerSystemIndex = GetInletIndex("TRACKERKLT");
*/
      return true;
    }


  ResetTimers() : void {

    this.TimerFullRevelation.Stop();
    this.TimerFullRestoration.Stop();
    this.TimerOfRevelation.Stop();
    this.TimerOfRestoration.Stop();

    this.FeatureActivity.Stop();
    this.MotionActivity.Stop();
    this.NoMotionActivity.Stop();
    this.m_Physics.EmitionTimer.Stop();

    for ( var i=0; i < this.m_ParticlesSimpleArray.length; i++ ) {
          var pPar : moParticlesSimple = this.m_ParticlesSimpleArray[i];
          pPar.Age.Stop();
          pPar.Age.SetRelativeTimer( this.m_EffectState.tempo );
          pPar.Visible = false;
    }

    this.m_Physics.m_pLastBordParticle = NULL;
  }

  ReInit(): void {


    /*
      MODebug2.Message("moEffectParticlesSimple::ReInit Face construction activated!!!!");

      i : MOint;
      int j;
      int lum = 0;
      int lumindex = 0;
      int contrast = 0;

      UpdateParameters();
      //ResetTimers();

      m_pResourceManager->GetTimeMan()->ClearByObjectId(  this->GetId() );


      //m_ParticlesSimpleArray.Init( p_cols*p_rows, NULL );
      //m_ParticlesSimpleArrayTmp.Init( p_cols*p_rows, NULL );

      for( i=0; i<m_cols ; i++) {
          for( j=0; j<m_rows ; j++) {
              var pPar : moParticlesSimple = this.m_ParticlesSimpleArray[i+j*m_cols];

              if (pPar) {

                  pPar.Pos = moVector2f(  i,  j);
                  pPar.ImageProportion = 1.0;
                  pPar.Color = new moVector3f(1.0,1.0,1.0);
                  pPar.GLId2 = 0;

                  if (texture_mode==PAR.PARTICLES_TEXTUREMODE_MANY2PATCH) {

                      ///take the texture preselected
                      moTextureBuffer* pTexBuf = this.m_Config[moR(PAR.PARTICLES_FOLDERS)][MO_SELECTED][0].TextureBuffer();

                      pPar.GLId = glidori;
                      pPar.GLId2 = glid;
                      //pPar.GLId2 = 0;

                      pPar.TCoord2 = moVector2f( 0.0, 0.0 );
                      pPar.TSize2 = moVector2f( 1.0, 1.0 );

                      pPar.TCoord = moVector2f(  (i ) /  m_cols,  (j) /  m_rows );
                      pPar.TSize = moVector2f( 1.0 /  m_cols, 1.0 /  m_rows );

                      ///calculamos la luminancia del cuadro correspondiente
                      //int x0, y0, x1, y1;
                      float lumf = 0.0;

                      if (pSubSample && samplebuffer) {

                          if (pSubSample->GetWidth()!=m_cols) this.MODebug2.Error(moText("pSubSample width doesnt match m_cols"));
                          if (pSubSample->GetHeight()!=m_rows) this.MODebug2.Error(moText("pSubSample height doesnt match m_rows"));

                          int r = samplebuffer[ (i + j*pSubSample->GetWidth() ) *3 ];
                          int g = samplebuffer[ (i+1 + j*pSubSample->GetWidth() ) *3 ];
                          int b = samplebuffer[ (i+2 + j*pSubSample->GetWidth() ) *3 ];
                          //this.MODebug2.Message(moText("r:")+IntToStr(r)+moText(" g:")+IntToStr(g)+moText(" b:")+IntToStr(b));

                          lum = (r+g+b)/3;

                          //lum = ( + samplebuffer[ (i+1 + j*pSubSample->GetWidth() ) *3 ]
                          // + samplebuffer[ (i+2 + j*pSubSample->GetWidth() ) *3 ] ) / 3;
                          lum = ((lum & 1) << 7) | ((lum & 2) << 5) | ((lum & 4) << 3) | ((lum & 8) << 1)
                          | ((lum & 16) >> 1) | ((lum & 32) >> 3) | ((lum & 64) >> 5) | ((lum & 128) >> 7);
                          if (lum<0) lum = 0;
                          //this.MODebug2.Message(moText("lum:")+IntToStr(lum));

                          if (lum>=0) {
                              lum = lum*1.2;

                              lumf = ( 100.0 * lum ) / 255.0;
                              lumindex = (int) lumf;
                              if (lumindex>99) lumindex = 99;
                              //this.MODebug2.Push( moText("## Lum Index R G B ##") +IntToStr(lum)+IntToStr(r)+IntToStr(g)+IntToStr(b));

                          } else {
                              this.MODebug2.Message(moText("ReInit error:## lum is negative!!! ##")+IntToStr(lum)
                                      +moText("subs: w:") + IntToStr(pSubSample->GetWidth())
                                      +moText("subs: h:") + IntToStr(pSubSample->GetHeight())
                              );
                              lumindex = 99;
                          }

                      } else this.MODebug2.Push(moText("ReInit error: no texture nor samplebuffer"));


                      if (pTexBuf && pTextureDest && samplebuffer) {

                          int nim = pTexBuf->GetImagesProcessed();

                          pPar.ImageProportion = 1.0;

                          if (nim>0) {

                              moTextureFrames& pTextFrames(pTexBuf->GetBufferLevels( lumindex, 0 ) );

                              int nc = pTextFrames.Count();
                              int irandom = -1;

                              irandom = (int)( moMath.UnitRandom() * nc );
                              //irandom = 0;

                              moTextureMemory* pTexMem = pTextFrames.GetRef( irandom );

                              if (pTexMem) {
                                  pPar.GLId = glidori;
                                  pTexMem->GetReference();
                                  pPar.GLId2 = pTexMem->GetGLId();
                                  pPar.pTextureMemory = pTexMem;
                                  if (pTexMem ->GetHeight() > 0)
                                    pPar ->ImageProportion =  pTexMem->GetWidth() /  pTexMem->GetHeight();
                              } else {
                                  #ifdef _DEBUG
                                  this.MODebug2.Message(moText("Sample not founded: lumindex:")
                                    + IntToStr(lumindex) + moText(" irandom:") + IntToStr(irandom));
                                  #endif
                                  pPar.GLId = glidori;
                                  pPar.GLId2 = pPar.GLId;
                                  pPar.Color.x = (lum )/ 255.0;
                                  pPar.Color.y = (lum )/ 255.0;
                                  pPar.Color.z = (lum )/ 255.0;
                                  pPar.Color.x*= pPar.Color.x;
                                  pPar.Color.y*= pPar.Color.y;
                                  pPar.Color.z*= pPar.Color.z;
                              }

                              //this.MODebug2.Push( moText("creating particle: irandom:")
                              // + IntToStr(irandom) + moText(" nc:") + IntToStr(nc)
                              //
                              // + moText(" count:") + IntToStr(pTexBuf->GetImagesProcessed())
                              // + moText(" glid:") + IntToStr(pPar.GLId) + moText(" glid2:") + IntToStr(pPar.GLId2) );

                          }

                      } else {
                          this.MODebug2.Error( moText("particles error creating texture") );
                      }


                      //this.MODebug2.Log( moText("i:") + IntToStr(i) + moText(" J:")
                      // + IntToStr(j) + moText(" lum:") + IntToStr(lum) + moText(" lumindex:")
                      // + IntToStr(lumindex) + moText(" glid:") + IntToStr(pPar.GLId)
                      // + moText(" glid2:") + IntToStr(pPar.GLId2));

                  }


                  pPar.Size = moVector2f( emitS.x /  m_cols,
                   emitS.y /  m_rows );
                  pPar.Force = new moVector3f( 0.0, 0.0, 0.0 );

                  SetParticlePosition( pPar );

                  if (this.m_Physics.m_EmitionPeriod>0) {
                      pPar.Age.Stop();
                      pPar.Visible = false;
                  } else {
                      pPar.Age.Stop();
                      pPar.Age.Start();
                      pPar.Visible = true;
                  }

                  ///Set Timer management
                  pPar.Age.SetObjectId( this->GetId() );
                  pPar.Age.SetTimerId( i + j*m_cols );
                  m_pResourceManager->GetTimeMan()->AddTimer( &pPar.Age );

                  m_ParticlesSimpleArray.Set( i + j*m_cols, pPar );

                  moParticlesSimple* pParTmp = this.m_ParticlesSimpleArrayTmp[i + j*m_cols];
                  pParTmp->Pos3d = pPar.Pos3d;
                  pParTmp->Velocity = pPar.Velocity;
                  pParTmp->Mass = pPar.Mass;
                  pParTmp->Force = pPar.Force;
                  pParTmp->Fixed = pPar.Fixed;
                  m_ParticlesSimpleArrayTmp.Set( i + j*m_cols, pParTmp );

              } else this.MODebug2.Error(moText("ParticleSimple::ReInit::no particle pointer"));
          }
      }

  */
  }


  UpdateDt() : void {

      /// 60 FPS = 16.666 milliseconds
      /// dtrel is frame relative where if dtrel = 1 = 1 frame (60fps)
      var dtrel = ( this.m_EffectState.tempo.ticks - this.last_tick ) / 16.666666;
      this.dt = this.m_Config.Eval(moR(PAR.PARTICLES_SYNC)) * dtrel * this.m_EffectState.tempo.delta / 100.0;
      this.last_tick = this.m_EffectState.tempo.ticks;
  }

  UpdateParameters() : void {

      this.UpdateDt();  // now in ::Update()

      //time_tofull_restoration = this.m_Config.Int( moR(PAR.PARTICLES_TIMETORESTORATION) );
      //time_of_restoration = this.m_Config.Int( moR(PAR.PARTICLES_TIMEOFRESTORATION) );

      //time_tofull_revelation = this.m_Config.Int( moR(PAR.PARTICLES_TIMETOREVELATION));
      //time_of_revelation = m_Config.Int( moR(PAR.PARTICLES_TIMEOFREVELATION) );

      this.ortho = (this.m_Config.Int( "ortho" ) != 0);

      if ( moIsTimerStopped() || !this.m_EffectState.tempo.Started() ) {
          this.ResetTimers();
          //this.MODebug2.Message("moEffectParticlesSimple::UpdateParameters  > ResetTimers!!!");
          console.log("moEffectParticlesSimple::UpdateParameters  > ResetTimers!!!");
      }

      //if script is modified... recompile
      /*
    if ( this.m_Physics.m_ParticleScript!=this.m_Config.Text( moR(PAR.PARTICLES_SCRIPT2) ) ) {

          this.m_Physics.m_ParticleScript = this.m_Config.Text( moR(PAR.PARTICLES_SCRIPT2) );
          var fullscript = this.m_pResourceManager.GetDataMan().GetDataPath()+ moSlash + this.m_Physics.m_ParticleScript;

          if ( this.CompileFile(fullscript) ) {

              //this.MODebug2.Message(moText("ParticlesSimple script loaded ") + (moText)fullscript );

              this.SelectScriptFunction( "Init" );
              //AddFunctionParam( m_FramesPerSecond );
              this.RunSelectedFunction();

          }// else this.MODebug2.Error(moText("ParticlesSimple couldnt compile lua script ") + (moText)fullscript );
    }

      if (moScript::IsInitialized()) {
          if (ScriptHasFunction("RunSystem")) {
              SelectScriptFunction("RunSystem");
              //passing number of particles
              AddFunctionParam( (int) ( m_rows*m_cols ) );
              AddFunctionParam(  dt );
              RunSelectedFunction(1);
          }
      }
*/
      this.drawing_features = this.m_Config.Int( moR(PAR.PARTICLES_DRAWINGFEATURES));
      this.texture_mode = this.m_Config.Int( moR(PAR.PARTICLES_TEXTUREMODE));

      this.m_Physics.m_EyeVector = new moVector3f(
                                          this.m_Config.Eval( moR(PAR.PARTICLES_EYEX)),
                                          this.m_Config.Eval( moR(PAR.PARTICLES_EYEY)),
                                          this.m_Config.Eval( moR(PAR.PARTICLES_EYEZ))
                                        );

      this.m_Physics.m_TargetViewVector = new moVector3f(
                                          this.m_Config.Eval( moR(PAR.PARTICLES_VIEWX)),
                                          this.m_Config.Eval( moR(PAR.PARTICLES_VIEWY)),
                                          this.m_Config.Eval( moR(PAR.PARTICLES_VIEWZ))
                                        );

      this.m_Physics.m_UpViewVector = new moVector3f(
                                          this.m_Config.Eval( moR(PAR.PARTICLES_UPVIEWX)),
                                          this.m_Config.Eval( moR(PAR.PARTICLES_UPVIEWY)),
                                          this.m_Config.Eval( moR(PAR.PARTICLES_UPVIEWZ))
                                        );

      this.m_Physics.m_SourceLighMode = this.m_Config.Int( moR(PAR.PARTICLES_LIGHTMODE)) as moParticlesSimpleLightMode;
      this.m_Physics.m_SourceLightVector = new moVector3f(
                                          this.m_Config.Eval( moR(PAR.PARTICLES_LIGHTX)),
                                          this.m_Config.Eval( moR(PAR.PARTICLES_LIGHTY)),
                                          this.m_Config.Eval( moR(PAR.PARTICLES_LIGHTZ))
                                        );

      this.m_Physics.gravitational = this.m_Config.Eval( moR(PAR.PARTICLES_GRAVITY));
      this.m_Physics.viscousdrag = this.m_Config.Eval( moR(PAR.PARTICLES_VISCOSITY));


      //emiper = this.m_Config[moR(PAR.PARTICLES_EMITIONPERIOD)][MO_SELECTED][0].Int();
      //emiper = emiper * midi_emitionperiod;
      //emiperi = (long) emiper;
      //this.MODebug2.Message(moText("Emiper:")+IntToStr(emiperi));

      //this.m_Physics.m_MaxAge = this.m_Config.Int( moR(PAR.PARTICLES_MAXAGE) );
      this.m_Physics.m_MaxAge = this.m_Config.Eval( moR(PAR.PARTICLES_MAXAGE) );
      //emiperi = this.m_Config[moR(PAR.PARTICLES_EMITIONPERIOD)][MO_SELECTED][0].Int() * midi_emitionperiod;
      //this.m_Physics.m_EmitionPeriod = emiperi;
      this.m_Physics.m_EmitionPeriod = this.m_Config.Eval( moR(PAR.PARTICLES_EMITIONPERIOD) );
      //this.m_Physics.m_EmitionPeriod = this.m_Config[moR(PAR.PARTICLES_EMITIONPERIOD)][MO_SELECTED][0].Int();
      //this.MODebug2.Message(moText("Emiperiod:")+IntToStr(this.m_Physics.m_EmitionPeriod));

      //this.m_Physics.m_EmitionRate = this.m_Config.Int( moR(PAR.PARTICLES_EMITIONRATE) );
      this.m_Physics.m_EmitionRate = this.m_Config.Eval( moR(PAR.PARTICLES_EMITIONRATE) );
      this.m_Physics.m_DeathPeriod = this.m_Config.Int( moR(PAR.PARTICLES_DEATHPERIOD) );


      this.m_Physics.m_RandomMethod = this.m_Config.Int( moR(PAR.PARTICLES_RANDOMMETHOD) ) as moParticlesRandomMethod;
      this.m_Physics.m_CreationMethod = this.m_Config.Int( moR(PAR.PARTICLES_CREATIONMETHOD) ) as moParticlesCreationMethod;

      this.m_Physics.m_OrientationMode = this.m_Config.Int( moR(PAR.PARTICLES_ORIENTATIONMODE) ) as moParticlesOrientationMode;

      this.m_Physics.m_FadeIn = this.m_Config.Eval( moR(PAR.PARTICLES_FADEIN));
      this.m_Physics.m_FadeOut = this.m_Config.Eval( moR(PAR.PARTICLES_FADEOUT));
      this.m_Physics.m_SizeIn = this.m_Config.Eval( moR(PAR.PARTICLES_SIZEIN));
      this.m_Physics.m_SizeOut = this.m_Config.Eval( moR(PAR.PARTICLES_SIZEOUT));

      this.m_Physics.m_RandomPosition = this.m_Config.Eval( moR(PAR.PARTICLES_RANDOMPOSITION));
      this.m_Physics.m_RandomVelocity = this.m_Config.Eval( moR(PAR.PARTICLES_RANDOMVELOCITY));
      this.m_Physics.m_RandomMotion = this.m_Config.Eval( moR(PAR.PARTICLES_RANDOMMOTION));


      this.m_Physics.m_EmitterType = this.m_Config.Int( moR(PAR.PARTICLES_EMITTERTYPE)) as moParticlesSimpleEmitterType;
      this.m_Physics.m_AttractorType = this.m_Config.Int( moR(PAR.PARTICLES_ATTRACTORTYPE)) as moParticlesSimpleAttractorType;

      this.m_Physics.m_PositionVector = new moVector3f(this.m_Config.Eval( moR(PAR.PARTICLES_RANDOMPOSITION_X)),
                                              this.m_Config.Eval( moR(PAR.PARTICLES_RANDOMPOSITION_Y)),
                                              this.m_Config.Eval( moR(PAR.PARTICLES_RANDOMPOSITION_Z)) );

      this.m_Physics.m_EmitterSize = new moVector3f(   this.m_Config.Eval( moR(PAR.PARTICLES_SIZEX)),
                                              this.m_Config.Eval( moR(PAR.PARTICLES_SIZEY)),
                                              this.m_Config.Eval( moR(PAR.PARTICLES_SIZEZ)));

      this.m_Physics.m_VelocityVector = new moVector3f(
        this.m_Config.Eval(moR(PAR.PARTICLES_RANDOMVELOCITY_X)),
        this.m_Config.Eval( moR(PAR.PARTICLES_RANDOMVELOCITY_Y)),
        this.m_Config.Eval( moR(PAR.PARTICLES_RANDOMVELOCITY_Z)));

      this.m_Physics.m_MotionVector = new moVector3f(
        this.m_Config.Eval(moR(PAR.PARTICLES_RANDOMMOTION_X)),
        this.m_Config.Eval( moR(PAR.PARTICLES_RANDOMMOTION_Y)),
        this.m_Config.Eval( moR(PAR.PARTICLES_RANDOMMOTION_Z)));

      this.m_Physics.m_EmitterVector = new moVector3f(
        this.m_Config.Eval(moR(PAR.PARTICLES_EMITTERVECTOR_X)),
        this.m_Config.Eval(moR(PAR.PARTICLES_EMITTERVECTOR_Y)),
        this.m_Config.Eval(moR(PAR.PARTICLES_EMITTERVECTOR_Z)) );

  /*
  if (this.m_bTrackerInit && this.m_Physics.m_EmitterType==PAR.PARTICLES_EMITTERTYPE_TRACKER2) {
          this.m_Physics.m_EmitterVector = new moVector3f( m_TrackerBarycenter.x
          *normalf, m_TrackerBarycenter.y*normalf, 0.0 );
      }
      */

      this.m_Physics.m_AttractorMode = this.m_Config.Int(moR(PAR.PARTICLES_ATTRACTORMODE)) as moParticlesSimpleAttractorMode;
/*
      console.log("moR(PAR.PARTICLES_ATTRACTORMODE)",
        moR(PAR.PARTICLES_ATTRACTORMODE),
        this.m_Config.Int(moR(PAR.PARTICLES_ATTRACTORMODE)));
*/
        this.m_Physics.m_AttractorVector = new moVector3f(
        this.m_Config.Eval(moR(PAR.PARTICLES_ATTRACTORVECTOR_X)),
        this.m_Config.Eval( moR(PAR.PARTICLES_ATTRACTORVECTOR_Y)),
        this.m_Config.Eval( moR(PAR.PARTICLES_ATTRACTORVECTOR_Z)));

      if (this.original_proportion!=1.0) {
              if (this.original_proportion>1.0) {
                  this.m_Physics.m_AttractorVector.y = this.m_Physics.m_AttractorVector.y / this.original_proportion;
              } else {
                  this.m_Physics.m_AttractorVector.x = this.m_Physics.m_AttractorVector.x * this.original_proportion;
              }
      }

      this.normalf = this.m_Physics.m_EmitterSize.x;

      this.m_OrderingMode = this.m_Config.Int( moR(PAR.PARTICLES_ORDERING_MODE) ) as moParticlesOrderingMode;
/*
      float ralpha,rbeta,rgama;

      ralpha = moMath.DegToRad( this.m_Config.Eval( moR(PAR.PARTICLES_ROTATEX) ) );
      rbeta = moMath.DegToRad( this.m_Config.Eval( moR(PAR.PARTICLES_ROTATEY) ) );
      rgama = moMath.DegToRad( this.m_Config.Eval( moR(PAR.PARTICLES_ROTATEZ) ) );

      float r01 = cos(rbeta)*cos(rgama);
      float r02 = cos(rgama)*sin(ralpha)*sin(rbeta) - cos(ralpha)*sin(rgama);
      float r03 = cos(ralpha)*cos(rgama)*sin(rbeta)+sin(ralpha)*sin(rgama);
      float r04 = 0;

      float r11 = cos(rbeta)*sin(rgama);
      float r12 = cos(ralpha)*cos(rgama) + sin(ralpha)*sin(rbeta)*sin(rgama);
      float r13 = -cos(rgama)*sin(ralpha) + cos(ralpha)*sin(rbeta)*sin(rgama);
      float r14 = 0;

      float r21 = -sin(rbeta);
      float r22 = cos(rbeta)*sin(ralpha);
      float r23 = cos(ralpha)*cos(rbeta);
      float r24 = 0;

      m_Rot[0] = moVector4f(  r01, r02, r03, r04 );
      m_Rot[1] = moVector4f(  r11, r12, r13, r14 );
      m_Rot[2] = moVector4f(  r21, r22, r23, r24 );
      m_Rot[3] = moVector4f(  0, 0, 0, 1 );


      m_TS[0] = moVector4f(  this.m_Config.Eval( moR(PAR.PARTICLES_SCALEX) ), 0, 0, this.m_Config.Eval( moR(PAR.PARTICLES_TRANSLATEX) ) );
      m_TS[1] = moVector4f(  0, this.m_Config.Eval( moR(PAR.PARTICLES_SCALEY) ), 0, this.m_Config.Eval( moR(PAR.PARTICLES_TRANSLATEY) ) );
      m_TS[2] = moVector4f(  0, 0, this.m_Config.Eval( moR(PAR.PARTICLES_SCALEZ) ), this.m_Config.Eval( moR(PAR.PARTICLES_TRANSLATEZ) ) );
      m_TS[3] = moVector4f(  0, 0, 0, 1 );
  */

      //console.log("UpdateParameters:", this.m_Physics);
  }

/**
 * Set Particle Position
*/
  SetParticlePosition( pParticle : moParticlesSimple ) : void {

      var emitV = this.m_Physics.m_EmitterVector;
      var emitS = this.m_Physics.m_EmitterSize;
      var Po : moVector2f = pParticle.Pos;
      var Si : moVector2f = pParticle.Size;

      var left : MOdouble =  - (emitS.x) / 2.0;
      var top : MOdouble =  emitS.y / 2.0;
      var randomvelx : MOdouble = 0;
      var randomvely : MOdouble = 0;
      var randomvelz : MOdouble = 0;
      var randomposx : MOdouble = 0;
      var randomposy : MOdouble = 0;
      var randomposz : MOdouble = 0;
      var alpha : MOdouble;
      var phi : MOdouble;
      var radius : MOdouble;
      var z : MOdouble;
      var radius1 : MOdouble;
      var radius2 : MOdouble;

      var len: MOdouble = 0;
      var index: MOint = 0;
      var index_normal: MOint = 0;
      //position
      var rpos : number = this.m_Physics.m_RandomPosition;
      var posV : moVector3f = this.m_Physics.m_PositionVector;
      var posV2: moVector3f = new moVector3f(); posV2.copy(posV);
      //velocity
      var rvel : number = this.m_Physics.m_RandomVelocity;
      var velV : moVector3f = this.m_Physics.m_VelocityVector;
      var velV2: moVector3f = new moVector3f(); velV2.copy(velV);

      var randompos: moVector3f = (moMath.fabs(rpos) > 0.0) ? posV2.multiplyScalar(rpos*(0.5-moMath.UnitRandom())): posV2;
      randomposx = randompos.x;
      randomposy = randompos.y;
      randomposz = randompos.z;

      var randomvel: moVector3f = (moMath.fabs(rvel) > 0.0) ? velV2.multiplyScalar(rvel * moMath.UnitRandom()) : velV2;
      randomvelx = randomvel.x;
      randomvely = randomvel.y;
      randomvelz = randomvel.z;
      //if (pParticle.Pos.x == 0 && pParticle.Pos.y == 0)
      //  console.log("randomvel:", randomvelx, randomvely, randomvelz);

      var fullcolor = this.m_Config.EvalColor( moR(PAR.PARTICLES_PARTICLECOLOR));
      pParticle.Color = new moColor( fullcolor.r, fullcolor.g, fullcolor.b );
      pParticle.Mass = 10.0;
      pParticle.Fixed = false;

      pParticle.U = new moVector3f( 1.0, 0.0, 0.0 );
      pParticle.V = new moVector3f( 0.0, 1.0, 0.0 );
      pParticle.W = new moVector3f( 0.0, 0.0, 1.0 );

      pParticle.dpdt = new moVector3f( 0.0, 0.0, 0.0 );
      pParticle.dvdt = new moVector3f( 0.0, 0.0, 0.0 );

      if (this.m_Physics.m_FadeIn > 0.0) {
        pParticle.Alpha = 0.0;///fade in ? to middle age?
      } else {
        pParticle.Alpha = fullcolor.a;
      }

      if (this.m_Physics.m_SizeIn > 0.0) {
        pParticle.Scale = 0.0;///fade in ? to middle age?
      } else {
        pParticle.Scale = 1.0;
      }

      switch(this.m_Physics.m_EmitterType) {

          case EMIT.PARTICLES_EMITTERTYPE_GRID:
              //GRID POSITION
            switch(this.m_Physics.m_CreationMethod) {
                  case CREAMODE.PARTICLES_CREATIONMETHOD_LINEAR:
                    pParticle.Pos3d =
                      new moVector3f( ( left+Po.x*Si.x  + Si.x*(1+randomposx) / 2.0 )*emitV.x,
                                      ( top -Po.y*Si.y  - Si.y*(1+randomposy) / 2.0 )*emitV.y,
                                      randomposz*emitV.z);
                    //console.log("pParticle", pParticle);
                      pParticle.Velocity = new moVector3f( randomvelx, randomvely, randomvelz );
                    break;

                  case CREAMODE.PARTICLES_CREATIONMETHOD_PLANAR:
                  case CREAMODE.PARTICLES_CREATIONMETHOD_VOLUMETRIC:
                    pParticle.Pos3d = new moVector3f(
                      (left + moMath.UnitRandom() * emitS.x + Si.x * (1+randomposx) / 2.0) * emitV.x,
                      ( top - moMath.UnitRandom()* emitS.y - Si.y*(1+randomposy)/2.0 )*emitV.y,
                      randomposz * emitV.z);

                      pParticle.Velocity = new moVector3f( randomvelx,
                                                        randomvely,
                                                        randomvelz );
                      break;
              }

              break;

          case EMIT.PARTICLES_EMITTERTYPE_SPHERE:
              //SPHERE POSITION
              switch(this.m_Physics.m_CreationMethod) {
                  case CREAMODE.PARTICLES_CREATIONMETHOD_LINEAR:
                      alpha = 2 * moMath.PI * Po.x / this.m_cols;
                      phi = moMath.PI * Po.y / this.m_rows;
                      radius = moMath.Sqrt( emitS.x*emitS.x+emitS.y*emitS.y) / 2.0;

                      pParticle.Pos3d = new moVector3f(
                        (radius * moMath.Cos(alpha) * moMath.Sin(phi)
                        + randomposx) * emitV.x,
                        (radius * moMath.Sin(alpha) * moMath.Sin(phi)
                          + randomposy ) * emitV.y,
                                                      (radius*moMath.Cos(phi) + randomposz ) * emitV.z );

                      pParticle.Velocity = new moVector3f( randomvelx,
                                                        randomvely,
                                                        randomvelz );
                      break;

                  case  CREAMODE.PARTICLES_CREATIONMETHOD_PLANAR:
                      alpha = 2 * (moMath.PI) * moMath.UnitRandom();
                      phi = moMath.PI * moMath.UnitRandom();
                      radius = moMath.Sqrt(emitS.x * emitS.x
                        + emitS.y * emitS.y) / 2.0;
                      pParticle.Pos3d = new moVector3f(
                                          (radius*moMath.Cos(alpha)*moMath.Sin(phi) + randomposx)* emitV.x,
                                          (radius*moMath.Sin(alpha)*moMath.Sin(phi) + randomposy)* emitV.y,
                                          (radius*moMath.Cos(phi) + randomposz)* emitV.z
                                          );
                      pParticle.Velocity = new moVector3f( randomvelx,
                                                        randomvely,
                                                        randomvelz );
                      break;

                  case  CREAMODE.PARTICLES_CREATIONMETHOD_VOLUMETRIC:
                      alpha = 2 * moMath.PI * moMath.UnitRandom();
                      phi = moMath.PI * moMath.UnitRandom();
                      radius = moMath.Sqrt(emitS.x * emitS.x
                        + emitS.y * emitS.y) * moMath.UnitRandom() / 2.0;

                      pParticle.Pos3d = new moVector3f((radius * moMath.Cos(alpha) * moMath.Sin(phi)
                        + randomposx) * emitV.x,
                        (radius * moMath.Sin(alpha) * moMath.Sin(phi)
                          + randomposy ) * emitV.y,
                                                      (radius*moMath.Cos(phi) + randomposz ) * emitV.z );

                      pParticle.Velocity = new moVector3f( randomvelx,
                                                        randomvely,
                                                        randomvelz );
                      break;
              }
              break;

          case EMIT.PARTICLES_EMITTERTYPE_TUBE:
              //SPHERE POSITION
              switch(this.m_Physics.m_CreationMethod) {
                  case CREAMODE.PARTICLES_CREATIONMETHOD_LINEAR:
                      alpha = 2 * moMath.PI * pParticle.Pos.x / this.m_cols;
                      radius1 = emitS.x / 2.0;
                      radius2 = emitS.y / 2.0;
                      z = emitS.z * ( 0.5 - ( pParticle.Pos.y / this.m_rows ) );

                      pParticle.Pos3d = new moVector3f(  ( radius1*moMath.Cos(alpha) + randomposx ) * emitV.x,
                                                      ( radius1*moMath.Sin(alpha) + randomposy ) * emitV.y,
                                                      ( z + randomposz ) * emitV.z );

                      pParticle.Velocity = new moVector3f( randomvelx,
                                                        randomvely,
                                                        randomvelz );
                      break;

                  case  CREAMODE.PARTICLES_CREATIONMETHOD_PLANAR:
                      alpha = 2 * moMath.PI * moMath.UnitRandom();
                      radius1 = emitS.x / 2.0;
                      radius2 = emitS.y / 2.0;
                      z = emitS.z * ( 0.5 - moMath.UnitRandom());

                      pParticle.Pos3d = new moVector3f(  ( radius1*moMath.Cos(alpha) + randomposx ) * emitV.x,
                                                      ( radius1*moMath.Sin(alpha) + randomposy ) * emitV.y,
                                                      ( z + randomposz ) * emitV.z );

                      pParticle.Velocity = new moVector3f( randomvelx,
                                                        randomvely,
                                                        randomvelz );
                      break;

                  case  CREAMODE.PARTICLES_CREATIONMETHOD_VOLUMETRIC:
                      alpha = 2 * moMath.PI * moMath.UnitRandom();
                      radius1 = emitS.x / 2.0;
                      radius2 = emitS.y / 2.0;
                      radius = radius1 + moMath.UnitRandom()*(radius2-radius1)*moMath.UnitRandom();
                      z = emitS.z * ( 0.5 - moMath.UnitRandom());

                      pParticle.Pos3d = new moVector3f(  ( radius*moMath.Cos(alpha) + randomposx ) * emitV.x,
                                                      ( radius*moMath.Sin(alpha) + randomposy ) * emitV.y,
                                                      ( z + randomposz ) * emitV.z );

                      pParticle.Velocity = new moVector3f( randomvelx,
                                                        randomvely,
                                                        randomvelz );
                      break;
              }
              break;

          case EMIT.PARTICLES_EMITTERTYPE_JET:
              //SPHERE POSITION
              switch(this.m_Physics.m_CreationMethod) {
                  case CREAMODE.PARTICLES_CREATIONMETHOD_LINEAR:

                      //z = emitS.z * moMath.UnitRandom();
                      len = emitV.length();
                      index = pParticle.Pos.x+pParticle.Pos.y*this.m_cols;
                      index_normal = 0.0; ///si no hay particulas siempre en 0

                      if (this.m_cols*this.m_rows) {
                          index_normal = index / (this.m_cols*this.m_rows);
                      }
                      z = index_normal;

                      pParticle.Pos3d = new moVector3f(  emitV.x*( z + randomposx ),
                                                      emitV.y*( z + randomposy ),
                                                      emitV.z*( z + randomposz) );

                      pParticle.Velocity = new moVector3f(   randomvelx,
                                                          randomvely,
                                                          randomvelz);
                      break;
                  case CREAMODE.PARTICLES_CREATIONMETHOD_PLANAR:
                  case CREAMODE.PARTICLES_CREATIONMETHOD_VOLUMETRIC:
                      z = emitS.z * moMath.UnitRandom();

                      pParticle.Pos3d = new moVector3f(  emitV.x*( z + randomposx ),
                                                      emitV.y*( z + randomposy ),
                                                      emitV.z*( z + randomposz) );

                      pParticle.Velocity = new moVector3f(   randomvelx,
                                                          randomvely,
                                                          randomvelz);
                      break;

              }
              break;

          case EMIT.PARTICLES_EMITTERTYPE_POINT:
              //SPHERE POSITION
              pParticle.Pos3d = new moVector3f(  randomposx+emitV.x,
                                              randomposy+emitV.y,
                                              randomposz+emitV.z );

              pParticle.Velocity = new moVector3f(   randomvelx,
                                                  randomvely,
                                                  randomvelz);

              break;

          case EMIT.PARTICLES_EMITTERTYPE_SPIRAL:
              //SPIRAL POSITION
              switch(this.m_Physics.m_CreationMethod) {
                  case CREAMODE.PARTICLES_CREATIONMETHOD_LINEAR:
                  case CREAMODE.PARTICLES_CREATIONMETHOD_PLANAR:
                  case CREAMODE.PARTICLES_CREATIONMETHOD_VOLUMETRIC:
                      alpha = 2 * moMath.PI * pParticle.Pos.x / this.m_cols;
                      radius1 = emitS.x / 2.0;
                      radius2 = emitS.y / 2.0;
                      z = emitS.z * (0.5 - (pParticle.Pos.y / this.m_rows )
                      - (pParticle.Pos.x / (this.m_cols * this.m_rows)) );

                      pParticle.Pos3d = new moVector3f(  ( radius1*moMath.Cos(alpha) + randomposx ) * emitV.x,
                                                      ( radius1*moMath.Sin(alpha) + randomposy ) * emitV.y,
                                                      ( z + randomposz ) * emitV.z );

                      pParticle.Velocity = new moVector3f( randomvelx,
                                                        randomvely,
                                                        randomvelz );
                      break;
              }
              break;

          case EMIT.PARTICLES_EMITTERTYPE_CIRCLE:
              //CIRCLE POSITION
              switch(this.m_Physics.m_CreationMethod) {
                  case CREAMODE.PARTICLES_CREATIONMETHOD_LINEAR:
                      alpha = 2 * moMath.PI *
                        (pParticle.Pos.x + pParticle.Pos.y * this.m_cols) / (this.m_cols * this.m_rows);
                      radius1 = emitS.x / 2.0;
                      radius2 = emitS.y / 2.0;
                      z = 0.0;
                      //z = emitS.z * ( 0.5f
                      // - ( pParticle.Pos.y / m_rows ) - (pParticle.Pos.x / (m_cols*m_rows)) );

                      pParticle.Pos3d = new moVector3f(  ( radius1*moMath.Cos(alpha) + randomposx ) * emitV.x,
                                                      ( radius1*moMath.Sin(alpha) + randomposy ) * emitV.y,
                                                      ( z + randomposz ) );

                      pParticle.Velocity = new moVector3f( randomvelx,
                                                        randomvely,
                                                        randomvelz );
                      break;
                  case  CREAMODE.PARTICLES_CREATIONMETHOD_PLANAR:
                  case  CREAMODE.PARTICLES_CREATIONMETHOD_VOLUMETRIC:
                      alpha = 2 * moMath.PI *  ( pParticle.Pos.x*this.m_rows + pParticle.Pos.y) / (this.m_cols*this.m_rows );
                      radius1 = emitS.x / 2.0;
                      radius2 = emitS.y / 2.0;
                      z = 0.0;
                      //z = emitS.z * ( 0.5f - ( pParticle.Pos.y / m_rows )
                      // - (pParticle.Pos.x / (m_cols*m_rows)) );
                      randomposx = randomposx + (radius1-radius2)*moMath.Cos(alpha);
                      randomposy = randomposy + (radius1-radius2)*moMath.Sin(alpha);
                      pParticle.Pos3d = new moVector3f(  ( radius1*moMath.Cos(alpha) + randomposx ) * emitV.x,
                                                      ( radius1*moMath.Sin(alpha) + randomposy ) * emitV.y,
                                                      ( z + randomposz ) );

                      pParticle.Velocity = new moVector3f( randomvelx,
                                                        randomvely,
                                                        randomvelz );
                      break;
              }
              break;


/*
          case EMIT.PARTICLES_EMITTERTYPE_TRACKER:
              switch(this.m_Physics.m_CreationMethod) {
                  case PARTICLES_CREATIONMETHOD_CENTER:
                      if (m_pTrackerData) {
                          pParticle.Pos3d = new moVector3f( (m_pTrackerData->GetBarycenter().x - 0.5)*normalf,
                          (-m_pTrackerData->GetBarycenter().y+0.5)*normalf, 0.0 );
                          pParticle.Pos3d+= new moVector3f( randomposx, randomposy, randomposz );
                          pParticle.Velocity = new moVector3f( randomvelx, randomvely, randomvelz );
                      }
                      break;

                  case PARTICLES_CREATIONMETHOD_LINEAR:
                  case PARTICLES_CREATIONMETHOD_PLANAR:
                  case PARTICLES_CREATIONMETHOD_VOLUMETRIC:



                      if (m_pTrackerData) {
                          bool bfounded = false;
                          int np =  (int) ( moMath.UnitRandom() * m_pTrackerData->GetFeaturesCount() );

                          moTrackerFeature *pTF = NULL;

                          pTF = m_pTrackerData->GetFeature( np );
                          if (pTF->valid) {
                              pParticle.Pos3d = new moVector3f( (pTF->x - 0.5)*normalf, (-pTF->y+0.5)*normalf, 0.0 );
                              bfounded = true;
                          }

                          np = 0;
                          //como no encontro un feature valido para usar de generador arranca desde el primero....
                          //error, deberia tomar el baricentro.... o tomar al azar otro...
                          int cn=0;
                          if (!bfounded) {
                              do {
                                  pTF = m_pTrackerData->GetFeature( np );
                                  if (pTF->valid) {
                                      pParticle.Pos3d = new moVector3f( (pTF->x - 0.5)*normalf, (-pTF->y+0.5)*normalf, 0.0 );
                                      bfounded = true;
                                  }
                                  np =  (int) ( moMath.UnitRandom() * m_pTrackerData->GetFeaturesCount() );
                                  cn++;
                              } while (!pTF->valid && np < m_pTrackerData->GetFeaturesCount() && cn<5 );
                              if (!bfounded) pParticle.Pos3d = new moVector3f( (m_pTrackerData->GetBarycenter().x - 0.5)*normalf,
                              (-m_pTrackerData->GetBarycenter().y+0.5)*normalf, 0.0 );
                          }


                      } else {
                          pParticle.Pos3d = new moVector3f( 0, 0, 0 );
                      }

                      pParticle.Pos3d+= new moVector3f( randomposx, randomposy, randomposz );

                      pParticle.Velocity = new moVector3f(   randomvelx,
                                                          randomvely,
                                                          randomvelz);
                      break;

              }
              break;
*/
      };


  }

  Shot(): void {

  }

  InitParticlesSimple( p_cols : MOint, p_rows : MOint, p_forced : boolean=true ) : void {

    var m_bNewImage : boolean = false;

    //Texture Mode MANY2PATCH takes a Shot "texture capture of actual camera"
    if (this.texture_mode==TEXMODE.PARTICLES_TEXTUREMODE_MANY2PATCH) {
        this.Shot();
    }

    //Reset timers related to this object: one for each particle.
    if (this.m_pResourceManager){
        if (this.m_pResourceManager.GetTimeMan()) {
          this.m_pResourceManager.GetTimeMan().ClearByObjectId(  this.GetId() );
        }
    }

    if (this.m_ParticlesSimpleArray.length>0) this.m_ParticlesSimpleArray = [];
    if (this.m_ParticlesSimpleArrayTmp.length>0) this.m_ParticlesSimpleArrayTmp = [];
    if (this.m_ParticlesSimpleArrayOrdered.length>0) this.m_ParticlesSimpleArrayOrdered = [];
    if (this.m_ParticlesSimpleVector.length ) {
      this.m_ParticlesSimpleVector = [];
    }
/*
    m_ParticlesSimpleVector.resize( p_cols*p_rows, NULL );
    m_ParticlesSimpleArrayOrdered.Init( p_cols*p_rows, NULL );
    m_ParticlesSimpleArray.Init( p_cols*p_rows, NULL );
    m_ParticlesSimpleArrayTmp.Init( p_cols*p_rows, NULL );
*/
    var orderindex : MOint = 0;
    for( var j=0; j<p_rows ; j++) {
      for( var i=0; i<p_cols ; i++) {

        var pPar : moParticlesSimple = new moParticlesSimple();
        this.m_ParticlesSimpleVector[orderindex] = pPar;
        orderindex++;

        pPar.ViewDepth = 0.0;
        pPar.Pos = new moVector2f( i, j);
        pPar.ImageProportion = 1.0;
        //pPar.Color = new moVector3f(1.0,1.0,1.0);
        var fullcolor = this.m_Config.EvalColor( moR(PAR.PARTICLES_PARTICLECOLOR));
        pPar.Color = new moColor(
                                  fullcolor.r,
                                  fullcolor.g,
                                  fullcolor.b );
        pPar.GLId2 = 0;

        if (this.texture_mode==TEXMODE.PARTICLES_TEXTUREMODE_UNIT) {

            pPar.TCoord = new moVector2f( 0.0, 0.0 );
            pPar.TSize = new moVector2f( 1.0, 1.0 );

        }
        else if (this.texture_mode==TEXMODE.PARTICLES_TEXTUREMODE_PATCH) {

            pPar.TCoord = new moVector2f( i * 1.0/p_cols, j * 1.0/p_rows );
            pPar.TSize = new moVector2f( 1.0 / p_cols, 1.0 / p_rows );

        }
        else if (this.texture_mode == TEXMODE.PARTICLES_TEXTUREMODE_MANY
          || this.texture_mode == TEXMODE.PARTICLES_TEXTUREMODE_MANYBYORDER) {

            pPar.TCoord = new moVector2f( 0.0, 0.0 );
            pPar.TSize = new moVector2f( 1.0, 1.0 );

        }
        else if (this.texture_mode==TEXMODE.PARTICLES_TEXTUREMODE_MANY2PATCH) {

          ///take the texture preselected
          var pTexBuf : moTextureBuffer = this.m_Config.TextureBuffer(moR(PAR.PARTICLES_FOLDERS));
            //moTextureBuffer

            pPar.GLId = this.glidori; //first id for Image reference to patch (and blend after)
            pPar.GLId2 = this.glid; //second id for each patch image

            pPar.TCoord2 = new moVector2f( 0.0, 0.0 ); //coords for patch
            pPar.TSize2 = new moVector2f( 1.0, 1.0 );

            pPar.TCoord = new moVector2f( i / p_cols, j / p_rows );//grid
            pPar.TSize = new moVector2f( 1.0 / p_cols, 1.0 / p_rows );//sizes
  /*
            ///calculamos la luminancia del cuadro correspondiente
            //int x0, y0, x1, y1;
            var lum : MOint = 0;
            var lumindex : MOint = 0;
            var contrast : MOint = 0;

            ///samplebuffer en la posicion i,j ?
            if (this.pSubSample && this.samplebuffer) {

                lum = (samplebuffer[ (i + j*pSubSample->GetWidth() ) *3 ]
                      + samplebuffer[ (i+1 + j*pSubSample->GetWidth() ) *3 ]
                      + samplebuffer[ (i+2 + j*pSubSample->GetWidth() ) *3 ]) / 3;

                if (lum<0) lum = -lum;
                ///pasamos de color a porcentaje 0..255 a 0..99
                if (lum>=0) {
                    lumindex = (int)( 100.0 * lum / 256)  - 1;
                    if (lumindex>99) lumindex = 99;
                }
            } else {
                this.MODebug2.Message(moText("pSubSample: ")+IntToStr((long)pSubSample) +
                                moText("samplebuffer: ")+IntToStr((long)samplebuffer));
            }
  */

            if (pTexBuf) {

                ///cantidad de imagenes en el buffer
                var nim : MOint = pTexBuf.GetImagesProcessed();

                pPar.ImageProportion = 1.0;


                if (nim>0) {

                    ///Tomamos de GetBufferLevels...
/*
                    moTextureFrames& pTextFrames(pTexBuf->GetBufferLevels( lumindex, 0 ) );
*/
                    var pTextFrames: moTexture[] = pTexBuf.m_Frames;
                    var nc = pTextFrames.length;
                    var irandom = -1;

                    irandom = moMath.UnitRandom() * nc;

                    var pTexMem : moTextureMemory = pTextFrames[irandom];

                    if (pTexMem) {
                        //pPar.GLId = glidori;
                        //pTexMem->GetReference();
                        //pPar.GLId2 = pTexMem->GetGLId();
                        pPar.pTextureMemory = pTexMem;
                        if (pTexMem.GetHeight() > 0)
                            pPar.ImageProportion =
                             pTexMem.GetWidth() /  pTexMem.GetHeight();
                    } else {
                        /*pPar.GLId = glidori;
                        pPar.GLId2 = pPar.GLId;
                        pPar.Color.x = (lum )/ 255.0;
                        pPar.Color.y = (lum )/ 255.0;
                        pPar.Color.z = (lum )/ 255.0;
                        pPar.Color.x*= pPar.Color.x;
                        pPar.Color.y*= pPar.Color.y;
                        pPar.Color.z*= pPar.Color.z;*/
                    }
                    //this.MODebug2.Push( moText("creating particle: irandom:") + IntToStr(irandom)
                    // + moText(" count:") + IntToStr(pTexBuf->GetImagesProcessed())
                    // + moText(" glid:") + IntToStr(pPar.GLId) );

                }

            } else this.MODebug2.Error( "particles error creating texture" );

        }

        pPar.Size = new moVector2f( this.m_Physics.m_EmitterSize.x / p_cols,
                                    this.m_Physics.m_EmitterSize.y / p_rows );
        pPar.Force = new moVector3f( 0.0, 0.0, 0.0 );

        this.m_pParticleIndex.GetData().SetLong(i+j*this.m_rows);
        this.SetParticlePosition( pPar );


        if (this.m_Physics.m_EmitionPeriod>0) {
            pPar.Age.Stop();
            pPar.Visible = false;
        } else {
            pPar.Age.Start();
            pPar.Visible = true;
        }

        ///Set Timer management
        pPar.Age.SetObjectId( this.GetId() );
        pPar.Age.SetTimerId( i + j*p_cols );
        pPar.Age.SetRelativeTimer( this.m_EffectState.tempo );

        this.m_pResourceManager.GetTimeMan().AddTimer( pPar.Age);

        this.m_ParticlesSimpleArray[ i + j*p_cols ] = pPar;


        var pParTmp: moParticlesSimple = new moParticlesSimple();
        //Object.assign(pParTmp, pPar);
        pParTmp.Pos3d.copy( pPar.Pos3d );
        pParTmp.Velocity.copy( pPar.Velocity );
        pParTmp.Mass = pPar.Mass ;
        pParTmp.Force = pPar.Force;
        pParTmp.Fixed = pPar.Fixed;

        this.m_ParticlesSimpleArrayTmp[ i + j*p_cols]= pParTmp;

      }
    }

    this.m_rows = p_rows;
    this.m_cols = p_cols;

  }

  /// Mata y regenera particulas, tambien las actualiza....
  Regenerate() : void {

    var randommotionx;
    var randommotiony;
    var randommotionz;

    var LastImageIndex = -1;

    var emitiontimer_duration = this.m_Physics.EmitionTimer.Duration();
      //this.MODebug2.Message("dur:"+IntToStr(emitiontimer_duration));

      //Reset EmitionTimer if out-of-timeline
      if (emitiontimer_duration<0)
          this.m_Physics.EmitionTimer.Start();


      for( var j=0; j<this.m_rows ; j++) {
        for( var i=0; i<this.m_cols ; i++) {


              var pPar : moParticlesSimple = this.m_ParticlesSimpleArray[i+j*this.m_cols];
              //if (i == 0 && j == 0)
                //console.log(`par: ${this.m_Rate} D: ${pPar.Age.Duration()} V: ${pPar.Visible}`);
              pPar.pTextureMemory = NULL;

              // Reset/Kill out-of-timeline particle....
              // Make particle die if particle Age is out of sync with moGetTicks absolute time (kind of reset the particles)

              if (pPar.Age.Duration() > moGetTicks() ) {
                  pPar.Age.Stop();
                  pPar.Visible = false;
                  pPar.MOId = -1; //reseteamos la textura asociada
                  /*
                  if (pPar.pTextureMemory) {
                      pPar.pTextureMemory->ReleaseReference();
                      pPar.pTextureMemory = NULL;
                      pPar.GLId = 0;
                  }
                  */
              }


              //KILL PARTICLE

              // Reset/Kill particle if Age > MaxAge , if MaxAge is 0, never die!!!
              //
              if ( pPar.Visible) {
                  if (
                          (
                                  (this.m_Physics.m_MaxAge>0) &&
                                  (pPar.Age.Duration() > this.m_Physics.m_MaxAge)
                          )
                          ||
                          (
                                  (pPar.MaxAge>0) &&
                                (pPar.Age.Duration() > pPar.MaxAge)
                          )
                      ) {

                      pPar.Age.Stop();
                      //console.log("Stopping");
                      pPar.Visible = false;
                      pPar.MOId = -1; //reseteamos la textura asociada

                      // Update rate ??...
                      if (this.m_Rate>0)
                        this.m_Rate--;
                      /*
                      if (pPar.pTextureMemory) {
                          pPar.pTextureMemory->ReleaseReference();
                          pPar.pTextureMemory = NULL;
                          pPar.GLId = 0;
                      }*/

                  }
              }

              //REBORN PARTICLE
              //this.m_Physics.EmitionTimer.Duration()
              //this.MODebug2.Message("dur:"+IntToStr(emitiontimer_duration)+" vs:"+IntToStr(this.m_Physics.m_EmitionPeriod) );


              // Rate is actual particle# emitted in this EmitionPeriod
              if ( this.m_Rate<this.m_Physics.m_EmitionRate &&
                  (this.m_Physics.EmitionTimer.Duration() > this.m_Physics.m_EmitionPeriod)
                  && pPar.Visible==false ) {

                  var letsborn : boolean = true;
                  var id_last_particle = 0;
                  var this_id_particle = 0;

                  if (this.m_Physics.m_CreationMethod==CREAMODE.PARTICLES_CREATIONMETHOD_LINEAR ) {
                    //in linear creation method, need to track the last particle born, just to maintain linearity
                    if (this.m_Physics.m_pLastBordParticle)
                      id_last_particle = this.m_Physics.m_pLastBordParticle.Pos.x
                        + this.m_Physics.m_pLastBordParticle.Pos.y * this.m_cols;
                    else id_last_particle = -1;

                    this_id_particle = i+j*this.m_cols;

                    if ( //last born was last in array
                    id_last_particle==(this.m_rows*this.m_cols-1)
                        && //this is first one in array
                          this_id_particle == 0 ) {
                        ///OK
                        letsborn = true;
                    } else if ( this_id_particle == (id_last_particle+1) ) {
                        // this one is just the next one to the last born, just what we wanted!
                        ///OK
                        letsborn = true;
                    } else {
                      // no linearity, yet
                      ///wait for the other cycle
                      letsborn = false;
                    }

                  }

                  //this.m_Physics.EmitionTimer.Start();
                  if (letsborn) {
                    pPar.Visible = true;
                    pPar.Age.Start();

                    //guardamos la referencia a esta particula, que servira para la proxima
                    if (this.m_Physics.m_pLastBordParticle) {
                      //guardamos la referencia del imageindex de la ultima particula
                      // (para mantener el orden en MANYBYORDER)
                      LastImageIndex = this.m_Physics.m_pLastBordParticle.ImageIndex;
                    }
                    this.m_Physics.m_pLastBordParticle = pPar;

                    //Update the rate counter
                    this.m_Rate++;

                    //Sets the particle position
                    this.SetParticlePosition( pPar );
                    //this.MODebug2.Message("frame:"+IntToStr(frame) );
                    //this.MODebug2.Message("i:"+IntToStr(i) );
                    //this.MODebug2.Message("j:"+IntToStr(j) );
                    //this.MODebug2.Message("px:"+FloatToStr(pPar.Pos3d.x) );
                    //this.MODebug2.Message("py:"+FloatToStr(pPar.Pos3d.y) );


                    //SPECIAL CASE for texture folders
                    ///asigna un id al azar!!!! de todos los que componen el moTextureBuffer
                    ///hay q pedir el moTextureBuffer
                    if (this.texture_mode == TEXMODE.PARTICLES_TEXTUREMODE_MANY
                      || this.texture_mode == TEXMODE.PARTICLES_TEXTUREMODE_MANYBYORDER) {
                        var pTexBuf : moTextureBuffer = this.m_Config.TextureBuffer(moR(PAR.PARTICLES_FOLDERS));
                        //this.m_Config[moR(PARTICLES_TEXTURE)].GetData()->GetGLId(&m_EffectState.tempo, 1, NULL );
                        if (pTexBuf) {
                            var nim = pTexBuf.GetImagesProcessed();
                            //console.log( "nim: ", nim);
                            if (pPar.Material == undefined) {
                              pPar.Material = new MO.moMaterialBasic({
                                color: 0xffffff,
                                map: this.m_Config.Texture("texture")._texture,
                                side: THREE.DoubleSide,
                                vertexColors: THREE.VertexColors,
                                transparent: true,
                                opacity: 1.0
                              });
                            }
                            pPar.ImageProportion = 1.0;

                            if (nim>0) {

                                var frandom = moMath.UnitRandom() * nim;

                                //this.MODebug2.Push( "frandom: " + FloatToStr(frandom) );

                                //int irandom = ( ::rand() * nim )/ RAND_MAX;
                                var irandom = Math.round(frandom);
                                if (irandom>=nim) irandom = nim - 1;//last one repeated if out of bound

                                if ( this.texture_mode==TEXMODE.PARTICLES_TEXTUREMODE_MANYBYORDER) {
                                  irandom = LastImageIndex+1;
                                  if (irandom>=nim) irandom = 0;
                                }

                                LastImageIndex = irandom;
                                pPar.ImageIndex = LastImageIndex;
                                //console.log("irandom", irandom);
                                //this.MODebug2.Push( "irandom: " + IntToStr(irandom) + " rand: " + IntToStr(::rand()) );

                                ////pPar.GLId = pTexBuf.GetFrame( irandom );

                                var pTexMem : moTextureMemory = pTexBuf.GetTexture( irandom );
                                if (pTexMem) {
                                    //console.log("pTexMem", pTexMem);
                                    pPar.pTextureMemory = pTexMem;
                                    pPar.Material.map = pPar.pTextureMemory._texture;
                                    if (pTexMem.GetHeight()>0)
                                    pPar.ImageProportion =  pTexMem.GetWidth() /  pTexMem.GetHeight();
                                  }

                                ///this.MODebug2.Push( moText("creating particle: irandom:")
                                // + IntToStr(irandom) + moText(" count:")
                                // + IntToStr(pTexBuf->GetImagesProcessed()) + moText(" glid:") + IntToStr(pPar.GLId) );


                            } else {
                                ///pPar.GLId = 0;
                            }
                            pPar.TCoord = new moVector2f( 0.0, 0.0 );
                            pPar.TSize = new moVector2f( 1.0, 1.0 );

                        } else this.MODebug2.Error("PARTICLES_TEXTUREMODE_MANY particles error creating texture");
                    }

                  } ///fin letsborn

              }

              // Ok, check if EmitionRate is reached
              if (this.m_Rate>=this.m_Physics.m_EmitionRate) {
                  //reset timer
                  this.m_Physics.EmitionTimer.Start();
                  this.m_Rate = 0;
              }

              //FADEIN
              if ( pPar.Visible && this.m_Physics.m_FadeIn>0.0) {
                  //must be in lifetime range
                  if ( this.m_Physics.m_MaxAge>0 &&  pPar.Age.Duration() < this.m_Physics.m_MaxAge  ) {
                      //only apply in the first half-lifetime lapsus
                      if ( pPar.Age.Duration() < ( this.m_Physics.m_FadeIn * this.m_Physics.m_MaxAge / 2.0 ) ) {

                          pPar.Alpha = ( 2.0 * pPar.Age.Duration() / ( this.m_Physics.m_FadeIn * this.m_Physics.m_MaxAge ) );

                      } else pPar.Alpha = 1.0 ;
                  } else if ( this.m_Physics.m_MaxAge==0) {
                      //proportional to particle Age (in seconds) 1 second life = 100% opacity
                      pPar.Alpha = this.m_Physics.m_FadeIn * pPar.Age.Duration() / 1000.0;
                  }
              }

              //FADEOUT
              if ( pPar.Visible && this.m_Physics.m_FadeOut>0.0) {
                  //must be in lifetime range
                  if ( this.m_Physics.m_MaxAge>0 && (pPar.Age.Duration() < this.m_Physics.m_MaxAge) ) {
                      //only apply in the last half-lifetime lapsus
                      if ( (this.m_Physics.m_MaxAge/2.0) < pPar.Age.Duration() ) {

                          if (  (this.m_Physics.m_FadeOut
                          *this.m_Physics.m_MaxAge / 2.0) > (this.m_Physics.m_MaxAge - pPar.Age.Duration()) ) {

                              pPar.Alpha = ( this.m_Physics.m_MaxAge
                              - pPar.Age.Duration() ) / (this.m_Physics.m_FadeOut *this.m_Physics.m_MaxAge / 2.0);

                          }
                      }
                  }

              }

              //SIZEIN
              if ( pPar.Visible && this.m_Physics.m_SizeIn>0.0
                      && (this.m_Physics.m_MaxAge>0) &&  (pPar.Age.Duration() < this.m_Physics.m_MaxAge) ) {

                  if ( pPar.Age.Duration() < ( this.m_Physics.m_SizeIn * this.m_Physics.m_MaxAge / 2.0 )) {

                      pPar.Scale = ( 2.0 * pPar.Age.Duration() / ( this.m_Physics.m_SizeIn * this.m_Physics.m_MaxAge ) );

                  } else pPar.Scale = 1.0 ;


              }


              //SIZEOUT
              if ( pPar.Visible && this.m_Physics.m_SizeOut>0.0 && (this.m_Physics.m_MaxAge>0)
                  && ( (this.m_Physics.m_MaxAge/2.0) < pPar.Age.Duration() ) && (pPar.Age.Duration() < this.m_Physics.m_MaxAge) ) {

                  if (  (this.m_Physics.m_SizeOut*this.m_Physics.m_MaxAge / 2.0) > (this.m_Physics.m_MaxAge
                  - pPar.Age.Duration()) && pPar.Age.Duration() < this.m_Physics.m_MaxAge ) {

                      pPar.Scale = ( this.m_Physics.m_MaxAge - pPar.Age.Duration() ) /
                      (this.m_Physics.m_SizeOut *this.m_Physics.m_MaxAge / 2.0);

                  }


              }

              if ( pPar.Visible ) {

                  randommotionx = (this.m_Physics.m_RandomMotion>0)?
                  (0.5-moMath.UnitRandom())*this.m_Physics.m_MotionVector.x : this.m_Physics.m_MotionVector.x;
                  randommotiony = (this.m_Physics.m_RandomMotion>0)?
                  (0.5-moMath.UnitRandom())*this.m_Physics.m_MotionVector.y : this.m_Physics.m_MotionVector.y;
                  randommotionz = (this.m_Physics.m_RandomMotion>0)?
                  (0.5-moMath.UnitRandom())*this.m_Physics.m_MotionVector.z : this.m_Physics.m_MotionVector.z;

                  this.m_Physics.m_MotionVector.normalize();
                  if ( this.m_Physics.m_MotionVector.length() > 0.0 ) {
                      if (this.m_Physics.m_RandomMotion>0.0) {
                        pPar.Velocity.add(new moVector3f(
                          randommotionx,
                          randommotiony,
                          randommotionz)).multiplyScalar(this.m_Physics.m_RandomMotion);
                      }
                  }

              }




          }
      }

  }

  OrderParticles() : void {

    /// order here or elsewhere
    switch( this.m_OrderingMode ) {

        case ORDMODE.PARTICLES_ORDERING_MODE_COMPLETE:
          ////sort( m_ParticlesSimpleVector.begin(), m_ParticlesSimpleVector.end(), sortParticlesByComplete );
          break;

        case ORDMODE.PARTICLES_ORDERING_MODE_ZDEPTHTEST:
          break;

        case ORDMODE.PARTICLES_ORDERING_MODE_ZPOSITION:
          ////sort( m_ParticlesSimpleVector.begin(), m_ParticlesSimpleVector.end(), sortParticlesByZCoord );
          break;

        case ORDMODE.PARTICLES_ORDERING_MODE_NONE:
          break;
        default:
          break;
    }
  }


  UpdateParticles( dt : MOdouble, method : MOint ) : void
  {
    switch (method) {
      case 0:
        /* Euler */
        this.Regenerate();
        this.CalculateForces();
        this.CalculateDerivatives(false,dt);
        if (dt!=0.0)
        for ( var i=0; i<this.m_ParticlesSimpleArray.length; i++ ) {
          var pPar : moParticlesSimple = this.m_ParticlesSimpleArray[i];

          if (pPar && dt != 0.0) {
            var dp: moVector3f = new moVector3f();
            dp.copy(pPar.dpdt);
            dp.multiplyScalar(dt);
            //if (i == 0)
            //console.log("dp:", dp);
            pPar.Pos3d.add(dp);
            var dv: moVector3f = new moVector3f();
            dv.copy(pPar.dvdt);
            dv.multiplyScalar(dt);
            pPar.Velocity.add(dv);
          }
        }
        break;
      case 1:
        /* Midpoint */
        /*
        this.Regenerate();
        this.CalculateForces();
        this.CalculateDerivatives(false,dt);
        if (dt!=0.0)
        for (var i=0;i<this.m_ParticlesSimpleArray.length;i++) {
              var pPar : moParticlesSimple = this.m_ParticlesSimpleArray[i];
              var ptmpPar : moParticlesSimple = this.m_ParticlesSimpleArrayTmp[i];
              if (pPar && ptmpPar &&  dt!=0.0) {
                  ptmpPar.Pos3d = pPar.Pos3d;
                  ptmpPar.Velocity = pPar.Velocity;
                  ptmpPar.Force = pPar.Force;
                  ptmpPar.Pos3d = pPar.dpdt;
                  ptmpPar.Pos3d.multiplyScalar(dt / 2);
                  var p2: moVector3f = pPar.dvdt;
                  p2.multiplyScalar(dt / 2);
                  ptmpPar.Pos3d.add(p2);
              }
        }
        this.CalculateForces(true);
        this.CalculateDerivatives(true,dt);
        if (dt!=0.0)
        for ( var i=0; i < this.m_ParticlesSimpleArray.length; i++ ) {
              var pPar : moParticlesSimple = this.m_ParticlesSimpleArray[i];
              var ptmpPar : moParticlesSimple = this.m_ParticlesSimpleArrayTmp[i];
              if (pPar && ptmpPar && dt != 0.0) {
                  var dp: moVector3f = pPar.dpdt;
                  dp.multiplyScalar(dt);
                  pPar.Pos3d.add(dp);
                  var dv: moVector3f = pPar.dvdt;
                  dv.multiplyScalar(dt);
                  pPar.Velocity.add(dv);
              }
        }
        */
        break;
    }
  }


  CalculateViewDepth( pPar : moParticlesSimple ) : MOdouble {

    var viewdepth = 0.0;
    /// TODO: pPar.Pos3d must be transformed to
  /*
    var pos3d_tr : moVector3f;
    var pos3d_rot : moVector4f;
    var pos4d : moVector4f;

    //pos3d_trans =
    pos4d = new moVector4f( pPar.Pos3d.x, pPar.Pos3d.y, pPar.Pos3d.z, 1 );
    pos3d_rot.x = m_Rot[0].Dot( pos4d );
    pos3d_rot.y = m_Rot[1].Dot( pos4d );
    pos3d_rot.z = m_Rot[2].Dot( pos4d );
    pos3d_rot.w = 1.0;

    pos3d_tr.x = m_TS[0].Dot( pos3d_rot );
    pos3d_tr.y = m_TS[1].Dot( pos3d_rot );
    pos3d_tr.z = m_TS[2].Dot( pos3d_rot );

    viewdepth = ( this.m_Physics.m_EyeVector - this.m_Physics.m_TargetViewVector ).Dot( pos3d_tr );
  */
    return viewdepth;
  }


  CalculateForces( tmparray : boolean = false ) : void
  {

    var p1;
    var p2;
    //moVector3f down(1.0,1.0,-1.0);
    var zero : moVector3f = new moVector3f(0.0,0.0,0.0);
    var f: moVector3f = new moVector3f();
    var atdis : moVector3f;
    var len;
    var dx;
    var dy;
    var dz;


    var left =  - this.m_Physics.m_EmitterSize.x / 2.0;
    var top =  this.m_Physics.m_EmitterSize.y / 2.0;

    for ( var i=0; i < this.m_ParticlesSimpleArray.length; i++ ) {
        var pPar : moParticlesSimple = this.m_ParticlesSimpleArray[i];
        pPar.Force.copy(zero);

        //// Gravitation
        switch(this.m_Physics.m_AttractorType) {
          case ATTYPE.PARTICLES_ATTRACTORTYPE_POINT:
              pPar.Force.copy(this.m_Physics.m_AttractorVector);
              pPar.Force.sub(pPar.Pos3d);
              pPar.Force.multiplyScalar(this.m_Physics.gravitational * pPar.Mass);
              //if (i == 0)
                //console.log("attractor:",this.m_Physics.m_AttractorVector," force",
                // pPar.Force, "grav:", this.m_Physics.gravitational, " mass:", pPar.Mass );
              break;

          case ATTYPE.PARTICLES_ATTRACTORTYPE_JET:
            {
              //pPar.Force = ( m_Physics.m_AttractorVector - pPar.Pos3d )*(m_Physics.gravitational * pPar.Mass);
              var dot1 = this.m_Physics.m_AttractorVector.dot(pPar.Pos3d);
              var det = this.m_Physics.m_AttractorVector.length();
              var mu = 0.0;
              if (det > 0) {
                mu = dot1 / det;
              }
              pPar.Force.copy(this.m_Physics.m_AttractorVector);
              pPar.Force.multiplyScalar(mu);
              pPar.Force.sub(pPar.Pos3d);
              pPar.Force.multiplyScalar(this.m_Physics.gravitational * pPar.Mass);
            }
            break;
            /*
                      case PARTICLES_ATTRACTORTYPE_TRACKER:
                          if (m_pTrackerData) {
                              pPar.Force = ( moVector3f( 0.5f - m_pTrackerData->GetBarycenter().X(), 0.5f
                              - m_pTrackerData->GetBarycenter().Y(), 0.0 ) - pPar.Pos3d )*(m_Physics.gravitational * pPar.Mass);
                          }
                          break;
                      case PARTICLES_ATTRACTORTYPE_GRID:
                          switch( m_Physics.m_AttractorMode ) {
                              case PARTICLES_ATTRACTORMODE_STICK:
                              case PARTICLES_ATTRACTORMODE_ACCELERATION:

                                  pPar.Destination = moVector3f(   ( left + pPar.Pos.X()*pPar.Size.X()
                                  + pPar.Size.X()/2.0 )*m_Physics.m_AttractorVector.X() ,

                                  ( top - pPar.Pos.Y()*pPar.Size.Y()- pPar.Size.Y()/2.0 )*m_Physics.m_AttractorVector.Y(),
                                                                      m_Physics.m_AttractorVector.Z() );

                                  if (m_Physics.m_AttractorMode==PARTICLES_ATTRACTORMODE_STICK
                                  && moVector3f( pPar.Destination - pPar.Pos3d ).length() < 0.1 ) {
                                      pPar.Pos3d = pPar.Destination;
                                      pPar.Velocity = zero;
                                      pPar.Force = zero;
                                  } else pPar.Force = ( pPar.Destination - pPar.Pos3d )*
                                  (m_Physics.gravitational * pPar.Mass);
                                  break;
                              case PARTICLES_ATTRACTORMODE_LINEAR:
                                  pPar.Destination = moVector3f(   ( left + pPar.Pos.X()*pPar.Size.X()
                                  + pPar.Size.X()/2.0 )*m_Physics.m_AttractorVector.X() ,
                                                                  ( top - pPar.Pos.Y()*pPar.Size.Y()
                                                                  - pPar.Size.Y()/2.0 )*m_Physics.m_AttractorVector.Y(),
                                                                      m_Physics.m_AttractorVector.Z() );

                                  pPar.Pos3d = pPar.Pos3d + ( pPar.Destination - pPar.Pos3d) *
                                   m_Physics.gravitational;

                                  //atdis =( pPar.Destination - pPar.Pos3d);
                                  //if ( 0.04 < atdis.length()  && atdis.length() < 0.05 )  {
                                      //MODebug2->Message( moText("Position reached : X:")
                                      // + FloatToStr(pPar.Pos3d.X()) + moText(" Y:")
                                      // + FloatToStr(pPar.Pos3d.Y()) );
                                // }
                                  break;

                              default:
                                  break;
                          }
                          break;
            */
            default:
              break;
          }


        /// Viscous drag
        var Vis: moVector3f = new moVector3f();
        Vis.copy(pPar.Velocity);
        Vis.multiplyScalar(this.m_Physics.viscousdrag);
        pPar.Force.sub(Vis);
    }

    // Handle the spring interaction
    /*
    for (i=0;i<ns;i++) {
        p1 = s[i].from;
        p2 = s[i].to;
        dx = p[p1].p.x - p[p2].p.x;
        dy = p[p1].p.y - p[p2].p.y;
        dz = p[p1].p.z - p[p2].p.z;
        len = sqrt(dx*dx + dy*dy + dz*dz);
        f.x  = s[i].springconstant  * (len - s[i].restlength);
        f.x += s[i].dampingconstant * (p[p1].v.x - p[p2].v.x) * dx / len;
        f.x *= - dx / len;
        f.y  = s[i].springconstant  * (len - s[i].restlength);
        f.y += s[i].dampingconstant * (p[p1].v.y - p[p2].v.y) * dy / len;
        f.y *= - dy / len;
        f.z  = s[i].springconstant  * (len - s[i].restlength);
        f.z += s[i].dampingconstant * (p[p1].v.z - p[p2].v.z) * dz / len;
        f.z *= - dz / len;
        if (!p[p1].fixed) {
          p[p1].f.x += f.x;
          p[p1].f.y += f.y;
          p[p1].f.z += f.z;
        }
        if (!p[p2].fixed) {
          p[p2].f.x -= f.x;
          p[p2].f.y -= f.y;
          p[p2].f.z -= f.z;
        }
    }
  */
  }

  /*
    Calculate the derivatives
    dp/dt = v
    dv/dt = f / m
  */
  CalculateDerivatives( tmparray : boolean, dt : MOdouble ) : void {
    if (tmparray) {
      for ( var i=0; i<this.m_ParticlesSimpleArrayTmp.length; i++) {
          if (dt>0) this.m_ParticlesSimpleArrayTmp[i].dpdt.copy(this.m_ParticlesSimpleArrayTmp[i].Velocity);
          if (dt > 0) {
            this.m_ParticlesSimpleArrayTmp[i].dvdt.copy( this.m_ParticlesSimpleArrayTmp[i].Force );
            this.m_ParticlesSimpleArrayTmp[i].dvdt.multiplyScalar( 1.0 / this.m_ParticlesSimpleArrayTmp[i].Mass);
          }

      }
    } else {
      for ( var i=0; i<this.m_ParticlesSimpleArray.length; i++) {
        if (dt>0) this.m_ParticlesSimpleArray[i].dpdt.copy( this.m_ParticlesSimpleArray[i].Velocity);

        if (dt > 0) {
          this.m_ParticlesSimpleArray[i].dvdt.copy( this.m_ParticlesSimpleArray[i].Force );
          this.m_ParticlesSimpleArray[i].dvdt.multiplyScalar( 1.0 / this.m_ParticlesSimpleArray[i].Mass);
        }

      }
    }
  }

ParticlesSimpleAnimation( tempogral : moTempo, parentstate : moEffectState ) : void {

    switch(this.revelation_status) {
        case REVSTA.PARTICLES_FULLRESTORED:
            /*
            if (MotionActivity.Started()) {
                if (!TimerFullRevelation.Started()) {
                    TimerFullRevelation.Start();
                    revelation_status = PARTICLES_REVEALING;
                }
            }*/
            break;
        case REVSTA.PARTICLES_FULLREVEALED:
            /*
            if (!TimerFullRestoration.Started()) {
                TimerFullRestoration.Start();
            }

            if (TimerFullRestoration.Duration() > time_tofull_restoration ) {
                TimerFullRestoration.Stop();
                revelation_status = PARTICLES_RESTORINGALL;
            }*/
            break;
        case REVSTA.PARTICLES_REVEALINGALL:
            //RevealingAll();
            break;

        case REVSTA.PARTICLES_RESTORINGALL:
            //RestoringAll();
            break;

        case REVSTA.PARTICLES_REVEALING:
            /*
            if (TimerFullRevelation.Started()) {
                if (TimerFullRevelation.Duration() > time_tofull_revelation ) {
                    TimerFullRevelation.Stop();
                    revelation_status = PARTICLES_REVEALINGALL;
                }
            }
*/
            for( var i = 0; i<this.m_cols ; i++) {
                for( var j = 0; j<this.m_rows ; j++) {

                    var pPar : moParticlesSimple = this.m_ParticlesSimpleArray[ i + j*this.m_cols ];



                }

            }
            break;

    }


}


  DrawParticlesSimple( tempogral : MO.moTempo , parentstate : MO.moEffectState  ) : void {

      //if ((moGetTicks() % 1000) == 0) TrackParticle(1);

      var cols2 = this.m_Config.Int( moR(PAR.PARTICLES_WIDTH));
      var rows2 = this.m_Config.Int( moR(PAR.PARTICLES_HEIGHT) );

      if (cols2!=this.m_cols || rows2!=this.m_rows) {
          this.InitParticlesSimple(cols2,rows2);
      }


      /// TODO: what is this???? gross bug
      var gral_ticks  = tempogral.ticks;

      if (!this.m_Physics.EmitionTimer.Started())
          this.m_Physics.EmitionTimer.Start();



      //glBindTexture( GL_TEXTURE_2D, 0 );
      if (  this.texture_mode != TEXMODE.PARTICLES_TEXTUREMODE_MANY
        &&  this.texture_mode != TEXMODE.PARTICLES_TEXTUREMODE_MANY2PATCH) {
          //if (glid>=0) glBindTexture( GL_TEXTURE_2D, glid );
          //else glBindTexture( GL_TEXTURE_2D, 0);
      }

      var sizexd2; var sizeyd2;
      var tsizex; var tsizey;

      ////var pFont: moFont = this.m_Config.Font(moR(PARTICLES_FONT));
      var Texto : moText;

      //Update particle position, velocity, aging, death and rebirth.
      //console.log("dt:", this.dt);
      this.UpdateParticles(this.dt, 0); //Euler mode
      this.OrderParticles();
      ////this.ParticlesSimpleAnimation( tempogral, parentstate );

      var idxt = 0.0;

      //Now really draw each particle
      var orderedindex = 0;
      for( var j = 0; j<this.m_rows ; j++) {
        for( var i = 0; i<this.m_cols ; i++) {

              idxt = 0.5 + ( i + j * this.m_cols ) / ( this.m_cols * this.m_rows * 2 );

              var pPar : moParticlesSimple = this.m_ParticlesSimpleArray[ i + j*this.m_cols ];
              //if (i == 0 && j == 0)
              //  console.log(`par: ${pPar.Visible}`);
              switch(this.m_OrderingMode) {
                case ORDMODE.PARTICLES_ORDERING_MODE_NONE:
                  break;
                case ORDMODE.PARTICLES_ORDERING_MODE_COMPLETE:
                  {
                    pPar = this.m_ParticlesSimpleVector[ orderedindex ];
                    pPar.ViewDepth = this.CalculateViewDepth( pPar );
                  }
                  break;
                case ORDMODE.PARTICLES_ORDERING_MODE_ZPOSITION:
                  pPar = this.m_ParticlesSimpleVector[ orderedindex ];
                  break;
                default:

                  break;
              }

              orderedindex+= 1;
              var part_timer : number;
              if (pPar) {
                if (pPar.Material)
                  pPar.Material.visible = pPar.Visible;

                if (pPar.Visible) {

                  if (this.texture_mode == TEXMODE.PARTICLES_TEXTUREMODE_MANY
                    || this.texture_mode == TEXMODE.PARTICLES_TEXTUREMODE_MANYBYORDER
                    || this.texture_mode == TEXMODE.PARTICLES_TEXTUREMODE_MANY2PATCH) {
                    //pPar.GLId = 22;
                    if (pPar.GLId > 0) {
                      //glActiveTextureARB( GL_TEXTURE0_ARB );
                      //glEnable(GL_TEXTURE_2D);
                      //glBindTexture( GL_TEXTURE_2D, pPar.GLId );
                    }
                    if (pPar.GLId2 > 0) {
                      //glActiveTextureARB( GL_TEXTURE1_ARB );
                      //glEnable(GL_TEXTURE_2D);
                      //glBindTexture( GL_TEXTURE_2D, pPar.GLId2 );
                    }
                  }

                if (this.IsInitialized()) {
                    if (this.ScriptHasFunction("RunParticle")) {
                        this.SelectScriptFunction("RunParticle");
                        this.AddFunctionParam( i + j*this.m_cols);
                        this.AddFunctionParam( this.dt );
                        if (!this.RunSelectedFunction(1)) {
                            //this.MODebug2.Error( moText("RunParticle function not executed") );
                        }
                    }
                }


                  sizexd2 = (pPar.Size.x * pPar.ImageProportion) / 2.0;
                  sizeyd2 = pPar.Size.y / 2.0;
                  tsizex = pPar.TSize.x;
                  tsizey = pPar.TSize.y;
                  part_timer = 0.001 * Number(pPar.Age.Duration()); // particule ang = durationinmilis / 1000 ...

                  if (this.m_pParticleTime) {
                    if (this.m_pParticleTime.GetData()) {
                      this.m_pParticleTime.GetData().SetDouble(part_timer);
                      this.m_pParticleTime.Update(true);
                      //if (i==0 && j==0) console.log("ptime", this.m_pParticleTime.GetData().Double());
                    }
                  }

                  if (this.m_pParticleIndex) {
                    if (this.m_pParticleIndex.GetData()) {
                      this.m_pParticleIndex.GetData().SetLong((pPar.Pos.x) + (pPar.Pos.y) * this.m_cols);
                      this.m_pParticleIndex.Update(true);
                      //if (i==0 && j==0) console.log("pindex", this.m_pParticleIndex.GetData().Long());
                    }
                  }

                  //glPushMatrix();

                  var CO: moVector3f = new moVector3f();
                  CO.copy(this.m_Physics.m_EyeVector);
                  CO.sub(pPar.Pos3d);
                  var U: moVector3f;
                  var V: moVector3f;
                  var W: moVector3f;
                  var CPU: moVector3f;
                  var CPW: moVector3f;
                  var A: moVector3f = new moVector3f(0.0,0.0,0.0);
                  var B: moVector3f = new moVector3f(0.0,0.0,0.0);
                  var C: moVector3f = new moVector3f(0.0,0.0,0.0);
                  var D: moVector3f = new moVector3f(0.0,0.0,0.0);

                  var CENTRO: moVector3f;

                  U = new moVector3f(0.0, 0.0, 1.0);
                  V = new moVector3f(1.0, 0.0, 0.0);
                  W = new moVector3f(0.0, 1.0, 0.0);

                  U = CO;
                  U.normalize();

                  //orientation always perpendicular to plane (X,Y)
                  switch (this.m_Physics.m_OrientationMode) {

                    case ORIMODE.PARTICLES_ORIENTATIONMODE_FIXED:
                      //cuadrado centrado en Pos3d....
                      U = new moVector3f(0.0, 0.0, 1.0);
                      V = new moVector3f(1.0, 0.0, 0.0);
                      W = new moVector3f(0.0, 1.0, 0.0);
                      break;

                    case ORIMODE.PARTICLES_ORIENTATIONMODE_CAMERA:
                      // TODO: fix this
                      V = new moVector3f(-CO.y, CO.x, 0.0);
                      V.normalize();

                      CPU = new moVector3f(U.x, U.y, 0.0);
                      W = new moVector3f(0.0, 0.0, CPU.length());
                      CPU.normalize();
                      CPW = CPU.multiplyScalar(-U.z);
                      W.add(CPW);
                      break;

                    case ORIMODE.PARTICLES_ORIENTATIONMODE_MOTION:
                      // TODO: fix this
                      if (pPar.Velocity.length() > 0) U = pPar.Velocity;
                      U.normalize();
                      if (U.length() < 0.5) {
                        U = new moVector3f(0.0, 0.0, 1.0);
                        U.normalize();
                      }
                      V = new moVector3f(-U.y, U.x, 0.0);
                      V.normalize();
                      CPU = new moVector3f(U.x, U.y, 0.0);
                      W = new moVector3f(0.0, 0.0, CPU.length());
                      CPU.normalize();
                      CPW = CPU.multiplyScalar(-U.z);
                      W.add(CPW);
                      break;
                  }

                  V.multiplyScalar(sizexd2);
                  W.multiplyScalar(sizeyd2);

                  A.copy(V).multiplyScalar(-1);
                  A.add(W);

                  B.copy(V).add(W);

                  C.copy(V).sub(W);

                  D.copy(V).multiplyScalar(-1);
                  D.sub(W);


                  //cuadrado centrado en Pos3d....

                  //TODO: dirty code here!!!
                  if (this.texture_mode == TEXMODE.PARTICLES_TEXTUREMODE_UNIT
                    || this.texture_mode == TEXMODE.PARTICLES_TEXTUREMODE_PATCH) {

                    var cycleage = this.m_EffectState.tempo.ang;

                    //if (this.m_Physics.m_MaxAge>0) cycleage =  (pPar.Age.Duration() /
                    //   this.m_Physics.m_MaxAge );
                    cycleage = part_timer;
                    var glid = pPar.GLId;

                    if (pPar.MOId == -1) {
                      ////glid = this.m_Config.GetGLId( moR(PARTICLES_TEXTURE), cycleage, 1.0, NULL );
                    } else {


                      if (pPar.MOId > -1) {

                        var pTex: moTexture = this.m_pResourceManager.GetTextureMan().GetTexture(pPar.MOId);

                        if (pTex) {

                          if (
                            pTex.GetType() == moTextureType.MO_TYPE_VIDEOBUFFER
                            || pTex.GetType() == moTextureType.MO_TYPE_CIRCULARVIDEOBUFFER
                            || pTex.GetType() == moTextureType.MO_TYPE_MOVIE
                            || pTex.GetType() == moTextureType.MO_TYPE_TEXTURE_MULTIPLE
                          ) {
                            var pTA: moTextureAnimated = pTex as moTextureAnimated;

                            if (pPar.FrameForced) {
                              ////glid = pTA.GetGLId( pPar.ActualFrame );
                            } else {
                              ////glid = pTA.GetGLId(cycleage);
                              ////pPar.ActualFrame = pTA.GetActualFrame();

                              ////pPar.FramePS = pTA.GetFramesPerSecond();
                              ////pPar.FrameCount = pTA.GetFrameCount();
                            }

                          } else {
                            ////glid = pTex.GetGLId();
                          }

                        }
                      }
                    }

                    /////glBindTexture( GL_TEXTURE_2D , glid );
                  }

                  var rgba = this.m_Config.EvalColor(moR(PAR.PARTICLES_PARTICLECOLOR));

                  if (pPar.Geometry == undefined) {
                    pPar.Geometry = new MO.moPlaneGeometry( pPar.Size.x*pPar.ImageProportion, pPar.Size.y, 1, 1);
                    /*
                    pPar.Geometry = new THREE.Geometry();
                    pPar.Geometry.vertices.push(new THREE.Vector3(A.x, A.y, A.z));
                    pPar.Geometry.vertices.push(new THREE.Vector3(B.x, B.y, B.z));
                    pPar.Geometry.vertices.push(new THREE.Vector3(C.x, C.y, C.z));
                    pPar.Geometry.vertices.push(new THREE.Vector3(D.x, D.y, D.z));
                    pPar.Geometry.faces.push(new THREE.Face3(0, 1, 2)); // counter-clockwise winding order
                    pPar.Geometry.faces.push(new THREE.Face3(0, 2, 3));
                    pPar.Geometry.computeFaceNormals();
                    pPar.Geometry.computeVertexNormals();
                    */
                    if (pPar.Material == undefined) {
                      pPar.Material = new MO.moMaterialBasic({
                        /*color: 0xffffff,*/
                        map: this.m_Config.Texture("texture")._texture,
                        side: THREE.DoubleSide,
                        depthTest: false,
                        vertexColors: THREE.VertexColors,
                        transparent: true,
                        opacity: rgba.a * pPar.Alpha * this.m_EffectState.alpha
                      });
                      pPar.Material.color = new moColor(rgba.r, rgba.g, rgba.b);
                    }
                    //if (i == 0 && j == 0) console.log("col", rgba);
                    pPar.Mesh = new MO.moMesh(pPar.Geometry, pPar.Material);
                    pPar.Mesh["userData"]["Particle"] = pPar;
                    pPar.Model = new MO.moGLMatrixf();
                    pPar.Mesh.SetModelMatrix( pPar.Model );
                    this.GroupedParticles.add( pPar.Mesh );
                    //console.log("Added Mesh:", pPar.Mesh, pPar);
                  } else {
                    //pPar.Mesh.geometry = new MO.moPlaneGeometry( pPar.Size.x*pPar.ImageProportion, pPar.Size.y, 1, 1);
                    //Object.assign(pPar.Geometry, Geometry);

                  }

                  pPar["selected"] = false;
                  pPar.Material.color = new moColor(
                    rgba.r * this.Mat.color.r,
                    rgba.g * this.Mat.color.g,
                    rgba.b * this.Mat.color.b);
                  if (this.texture_mode == TEXMODE.PARTICLES_TEXTUREMODE_UNIT ) {
                    pPar.Material.map = this.m_Config.Texture("texture")._texture;
                  } else if (this.texture_mode == TEXMODE.PARTICLES_TEXTUREMODE_MANYBYORDER) {
                      //
                    if (pPar.pTextureMemory)
                      pPar.Material.map = pPar.pTextureMemory._texture;
                  }

                  pPar.Material.opacity = rgba.a * pPar.Alpha * this.m_EffectState.alpha*this.Mat.opacity;
                  pPar.Model.Scale(
                  this.m_Config.Eval("scalex_particle")*pPar.Scale,
                    this.m_Config.Eval("scaley_particle")*pPar.Scale,
                    this.m_Config.Eval("scalez_particle")*pPar.Scale);
                  pPar.Model.Rotate(this.m_Config.Eval("rotatez_particle") * MO.DEG_TO_RAD,
                      0.0, 0.0, 1.0);
                  pPar.Model.Rotate(this.m_Config.Eval("rotatey_particle") * MO.DEG_TO_RAD,
                        0.0, 1.0, 0.0);
                  pPar.Model.Rotate(this.m_Config.Eval("rotatex_particle") * MO.DEG_TO_RAD,
                    1.0, 0.0, 0.0);
                  pPar.Model.Translate(
                      pPar.Pos3d.x,
                      pPar.Pos3d.y,
                      pPar.Pos3d.z);
                  pPar.Mesh.SetModelMatrix( pPar.Model );

                    ////glTranslatef( pPar.Pos3d.x, pPar.Pos3d.y,  pPar.Pos3d.z );

                    ////glRotatef(  this.m_Config.Eval( moR(PARTICLES_ROTATEZ_PARTICLE) ) + pPar.Rotation.z, U.x, U.y, U.z );
                    ////glRotatef(  this.m_Config.Eval( moR(PARTICLES_ROTATEY_PARTICLE) ) + pPar.Rotation.y, W.x, W.y, W.z );
                    ////glRotatef(  this.m_Config.Eval( moR(PARTICLES_ROTATEX_PARTICLE) ) + pPar.Rotation.x, V.x, V.y, V.z );

                    //scale
                    ////glScalef(   this.m_Config.Eval( moR(PARTICLES_SCALEX_PARTICLE) )*pPar.Scale,
                    ////            this.m_Config.Eval( moR(PAR.PARTICLES_SCALEY_PARTICLE) )*pPar.Scale,
                    ////            this.m_Config.Eval( moR(PAR.PARTICLES_SCALEZ_PARTICLE) )*pPar.Scale);


                    ////glColor4f(  this.m_Config[moR(PARTICLES_COLOR)][MO_SELECTED][MO_RED].Eval() * pPar.Color.x * m_EffectState.tintr,
                    ////            this.m_Config[moR(PARTICLES_COLOR)][MO_SELECTED][MO_GREEN].Eval() * pPar.Color.y * m_EffectState.tintg,
                    ////            this.m_Config[moR(PARTICLES_COLOR)][MO_SELECTED][MO_BLUE].Eval() * pPar.Color.z * m_EffectState.tintb,
                    ////            this.m_Config[moR(PARTICLES_COLOR)][MO_SELECTED][MO_ALPHA].Eval()
                    ////            * this.m_Config.Eval( moR(PARTICLES_ALPHA))
                    ////            * m_EffectState.alpha * pPar.Alpha );
/*
                    glBegin(GL_QUADS);
                        //glColor4f( 1.0, 0.5, 0.5, idxt );

                        if (pPar.GLId2>0) {
                            //glColor4f( 1.0, 0.5, 0.5, idxt );
                            glMultiTexCoord2fARB( GL_TEXTURE0_ARB, pPar.TCoord.x, pPar.TCoord.y );
                            glMultiTexCoord2fARB( GL_TEXTURE1_ARB, pPar.TCoord2.x, pPar.TCoord2.y);
                        } else glTexCoord2f( pPar.TCoord.x, pPar.TCoord.y );
                        glNormal3f( -U.x, -U.y, -U.z );
                        glVertex3f( A.x, A.y, A.z);

                        //glColor4f( 0.5, 1.0, 0.5, idxt );

                        if (pPar.GLId2>0) {
                            glMultiTexCoord2fARB( GL_TEXTURE0_ARB, pPar.TCoord.x+tsizex, pPar.TCoord.y );
                            glMultiTexCoord2fARB( GL_TEXTURE1_ARB, pPar.TCoord2.x+pPar.TSize2.x, pPar.TCoord2.y);
                        } else glTexCoord2f( pPar.TCoord.x+tsizex, pPar.TCoord.y );
                        glNormal3f( -U.x, -U.y, -U.z );
                        glVertex3f( B.x, B.y, B.z);

                        //glColor4f( 0.5, 0.5, 1.0, idxt );
                        if (pPar.GLId2>0) {
                            glMultiTexCoord2fARB( GL_TEXTURE0_ARB, pPar.TCoord.x+tsizex, pPar.TCoord.y+tsizey );
                            glMultiTexCoord2fARB( GL_TEXTURE1_ARB, pPar.TCoord2.x+pPar.TSize2.x, pPar.TCoord2.y+pPar.TSize2.y);
                        } else glTexCoord2f( pPar.TCoord.x+tsizex, pPar.TCoord.y+tsizey );
                        glNormal3f( -U.x, -U.y, -U.z );
                        glVertex3f( C.x, C.y, C.z);

                        //glColor4f( 1.0, 1.0, 1.0, idxt );
                        if (pPar.GLId2>0) {
                            glMultiTexCoord2fARB( GL_TEXTURE0_ARB, pPar.TCoord.x, pPar.TCoord.y+pPar.TSize.y);
                            glMultiTexCoord2fARB( GL_TEXTURE1_ARB, pPar.TCoord2.x, pPar.TCoord2.y+pPar.TSize2.y);
                        } else glTexCoord2f( pPar.TCoord.x, pPar.TCoord.y+tsizey );
                        glNormal3f( -U.x, -U.y, -U.z );
                        glVertex3f( D.x, D.y, D.z);
                        glEnd();
*/

/*
                    //draw vectors associated...
                    if ( drawing_features>2 ) {
                        CENTRO = new moVector3f( 0.0 , 0.0, 0.0 );

                        glDisable( GL_TEXTURE_2D );
                        glLineWidth( 8.0 );
                        glBegin(GL_LINES);
                            ///draw U
                            glColor4f( 0.0, 1.0, 1.0, 1.0);
                            glVertex3f( CENTRO.x, CENTRO.y, 0.0001);

                            glColor4f( 0.0, 1.0, 1.0, 1.0);
                            glVertex3f( CENTRO.x + U.x, CENTRO.y + U.y, 0.0001);

                        glEnd();

                        glBegin(GL_LINES);
                            ///draw V
                            glColor4f( 1.0, 0.0, 1.0, 1.0);
                            glVertex3f( CENTRO.x, CENTRO.y, 0.0001);

                            glColor4f( 1.0, 0.0, 1.0, 1.0);
                            glVertex3f( CENTRO.x + V.x, CENTRO.y + V.y, 0.0001);

                        glEnd();

                        glBegin(GL_LINES);
                            ///draw W
                            glColor4f( 0.0, 0.0, 1.0, 1.0);
                            glVertex3f( CENTRO.x, CENTRO.y, 0.0001);

                            glColor4f( 0.0, 0.0, 1.0, 1.0);
                            glVertex3f( CENTRO.x + W.x, CENTRO.y + W.y, 0.0001);

                        glEnd();
                        glEnable( GL_TEXTURE_2D );
                    }


                    glPopMatrix();
                    */
                }

              }
          }
      }

/*
      if (pFont && drawing_features>2) {
          for( i = 0; i<m_cols ; i++) {
              for( j = 0; j<m_rows ; j++) {

                  var pPar : moParticlesSimple = this.m_ParticlesSimpleArray.GetRef( i + j*m_cols );
                  if ((i + j*m_cols) % 10 == 0 ) {
                      Texto = moText( IntToStr(i + j*m_cols));
                      Texto.Left(5);
                      Texto+= moText("F:")+moText( (moText)FloatToStr( pPar.Force.x ).Left(5) + moText(",")
                                  + (moText)FloatToStr( pPar.Force.y ).Left(5)
                                  + moText(",") + (moText)FloatToStr( pPar.Force.z ).Left(5) );

                      Texto+= moText("V:")+ moText( (moText)FloatToStr( pPar.Velocity.x ).Left(5) + moText(",")
                                  + (moText)FloatToStr( pPar.Velocity.y ).Left(5)
                                  + moText(",") + (moText)FloatToStr( pPar.Velocity.z ).Left(5) );

                      pFont->Draw( pPar.Pos3d.x,
                                  pPar.Pos3d.y,
                                  Texto );


                      Texto = moText( moText("(") + (moText)FloatToStr(pPar.TCoord.x).Left(4)
                      + moText(",") + (moText)FloatToStr(pPar.TCoord.y).Left(4) + moText(")") );

                      pFont->Draw( pPar.Pos3d.x-sizexd2,
                                  pPar.Pos3d.y+sizeyd2-2,
                                  Texto );

                      Texto = moText( moText("(") + (moText)FloatToStr(pPar.TCoord.x+tsizex).Left(4)
                      + moText(",") + (moText)FloatToStr(pPar.TCoord.y).Left(4) + moText(")"));

                      pFont->Draw( pPar.Pos3d.x+sizexd2-12,
                                  pPar.Pos3d.y+sizeyd2-5,
                                  Texto );

                      Texto = moText( moText("(") + (moText)FloatToStr(pPar.TCoord.x+tsizex).Left(4)
                      + moText(",") + (moText)FloatToStr(pPar.TCoord.y+tsizey).Left(4) + moText(")"));

                      pFont->Draw( pPar.Pos3d.x+sizexd2-12,
                                  pPar.Pos3d.y-sizeyd2+2,
                                  Texto );

                      Texto = moText( moText("(") + (moText)FloatToStr(pPar.TCoord.x).Left(4)
                      + moText(",") + (moText)FloatToStr(pPar.TCoord.y+tsizey).Left(4) + moText(")"));

                      pFont->Draw( pPar.Pos3d.x-sizexd2,
                                  pPar.Pos3d.y-sizeyd2+5,
                                  Texto );
                  }

              }
          }
      }

      if (pFont && drawing_features>2) {

                  Texto = moText( moText("T2 Rest.:") + IntToStr(TimerFullRestoration.Duration()));
                  pFont->Draw( -10.0,
                              0.0,
                              Texto );

                  Texto = moText( moText("T2 Revel.:") + IntToStr(TimerFullRevelation.Duration()));
                  pFont->Draw( -10.0,
                              3.0,
                              Texto );

                  Texto = moText( moText("T Revel.:") + IntToStr(TimerOfRevelation.Duration())
                  + moText(" rev: ") + IntToStr(time_of_revelation));
                  pFont->Draw( -10.0,
                              6.0,
                              Texto );

                  Texto = moText( moText("T Rest.:") + IntToStr(TimerOfRestoration.Duration())
                  + moText(" res: ") + IntToStr(time_of_restoration) );
                  pFont->Draw( -10.0,
                              9.0,
                              Texto );

                  Texto = moText("Status: ");

                  switch(revelation_status) {
                      case REVSTA.PARTICLES_FULLRESTORED:
                          Texto+= moText("Full Restored");
                          break;
                      case REVSTA.PARTICLES_REVEALING:
                          Texto+= moText("Revealing");
                          break;
                      case REVSTA.PARTICLES_REVEALINGALL:
                          Texto+= moText("Revealing");
                          break;
                      case REVSTA.PARTICLES_FULLREVEALED:
                          Texto+= moText("Full Revealed");
                          break;
                      case REVSTA.PARTICLES_RESTORING:
                          Texto+= moText("Restoring");
                          break;
                      case REVSTA.PARTICLES_RESTORINGALL:
                          Texto+= moText("Restoring All");
                          break;
                  }
                  pFont->Draw( -10.0,
                              13.0,
                              Texto );
      }
  */
  }


  Draw( p_tempo : MO.moTempo, p_parentstate : MO.moEffectState ) : void {
    this.BeginDraw(p_tempo, p_parentstate);

    if (this.RM == undefined) return;

    this.UpdateParameters();

    var rgba: any = this.m_Config.EvalColor("color");
    var ccolor: MO.moColor = new MO.moColor( rgba.r, rgba.g, rgba.b);
    //console.log("ccolor:", rgb.r,rgb.g,rgb.b);
    //console.log("emittertype:",this.m_Config.Int("emittertype"));
    ///MESH MATERIAL

    if (this.Mat==undefined) {
      this.Mat = new MO.moMaterialBasic();
    }
    if (this.Mat) {
      this.Mat.map = this.m_Config.Texture("texture")._texture;
      this.Mat.transparent = true;
      this.Mat.color = ccolor;
      this.Mat.vertexColors = MO.three.VertexColors;
      this.Mat.needsUpdate = true;
      this.Mat.side = MO.three.DoubleSide;
      this.Mat.wireframe = false;
      this.Mat.opacity = this.m_Config.Eval("alpha")*rgba.a;
    }

    //Mat2.m_MapGLId = Mat2.m_Map->GetGLId();
    //Mat2.m_Color = moColor(1.0, 1.0, 1.0);
    //Mat2.m_vLight = new moVector3f( -1.0, -1.0, -1.0 );
    //Mat2.m_vLight.normalize();

    ///MESH GEOMETRY
    /*
    if (this.Plane == undefined) {
      this.Plane = new MO.moPlaneGeometry(
        1.0,//this.m_Config.Eval("width"),
        1.0,//this.m_Config.Eval("height"),
        1, 1);
    }
    if (this.Plane) {
      this.Plane.colors = [ccolor, ccolor, ccolor, ccolor];
      this.Plane.colorsNeedUpdate = true;
    }
*/
    ///MESH MODEL
    if (this.Model==undefined)
      this.Model = new MO.moGLMatrixf().MakeIdentity();

    if (this.Model) {

      this.Model.Scale(
        this.m_Config.Eval("scalex"),
        this.m_Config.Eval("scaley"),
        this.m_Config.Eval("scalez"));

      this.Model.Rotate(-this.m_Config.Eval("rotatez") * MO.DEG_TO_RAD,
        0.0, 0.0, 1.0);
      this.Model.Rotate(-this.m_Config.Eval("rotatey") * MO.DEG_TO_RAD,
        0.0, 1.0, 0.0);
      this.Model.Rotate(-this.m_Config.Eval("rotatex") * MO.DEG_TO_RAD,
        1.0, 0.0, 0.0);
      // WORLD RELATIVE TO CAMERA...camera must be at 0,0,0
      this.Model.Translate(
          this.m_Config.Eval("translatex")-this.m_Config.Eval("eyex"),
          this.m_Config.Eval("translatey")-this.m_Config.Eval("eyey"),
          this.m_Config.Eval("translatez")-this.m_Config.Eval("eyez"));

    }

    if (this.Scene == undefined) {
        this.Scene = new MO.moSceneNode();
    }
    if (this.GroupedParticles == undefined) {
      this.GroupedParticles = new MO.moGroup();
      this.Scene.add(this.GroupedParticles);
    } else {
      this.GroupedParticles.SetModelMatrix(this.Model);
    }

/* TODO: add guidelines / axes ?
    if (this.Mesh==undefined) {
      this.Mesh = new MO.moMesh( this.Plane, this.Mat );
    }
    if (this.Mesh && this.Model) {
      //this.Mesh.SetModelMatrix(this.Model);
    }

    if (this.Scene==undefined) {
      this.Scene = new MO.moSceneNode();
      this.Scene.add(this.Mesh);
    }
*/

    ///CAMERA PERSPECTIVE
    if (this.Camera == undefined) {
      //this.Camera = new MO.moCamera3D();
      this.Camera = new THREE.PerspectiveCamera(60, this.RM.ScreenProportion(), 0.01, 1000.0);
      var lookat: moVector3f = new moVector3f();
      lookat.copy(this.m_Physics.m_TargetViewVector)
        .sub(this.m_Physics.m_EyeVector)
        .normalize();
      this.Camera.translateX(0);
      this.Camera.translateY(0);
      this.Camera.translateZ(0);
      this.Camera.lookAt(lookat);
      this.Camera.frustumCulled = true;
      this.Camera.castShadow = false;

/* TODO: fix lookat function to imitate THREE.Camera quaternions, and World Direction
      this.GL.SetDefaultPerspectiveView(
      this.RM.m_Renderer.getSize().width,
      this.RM.m_Renderer.getSize().height);
      this.GL.LookAt( 0.0, 0.0, 0.0,
                      lookat.x, lookat.y, lookat.z,
                      0.0, 1.0, 0.0);
      console.log("Camera", this.Camera, " GL:", this.GL.m_ProjectionMatrix);
      */
    }

    this.DrawParticlesSimple(p_tempo, this.m_EffectState /*, parentstate*/);

    if (this.mouse) {
      if (this.raycaster == undefined)
        this.raycaster = new THREE.Raycaster();

      this.raycaster.setFromCamera({ x: this.mouse.x, y: this.mouse.y }, this.Camera);
      this.intersects = this.raycaster.intersectObjects(this.Scene.children, true /*recursive*/);
      for (var i = 0; i < this.intersects.length; i++) {
        this.intersects[i].object.material.color = new THREE.Color(2.0, 2.0, 2.0);
        this.intersects[i].object["userData"]["selected"] = true;
        this.intersects[i].object["userData"]["Particle"]["selected"] = true;
      }
      //if (this.intersects.length)
        //console.log("this.intersects[i].object:", this.intersects.length, this.intersects);
    }

    ///RENDERING
    this.RM.Render( this.Scene, this.Camera);

    this.EndDraw();

  }

  Update( p_Event: MO.moEventList ) : void {
    super.Update(p_Event);

    if (p_Event.m_Array.length > 0) {
      var mevent = p_Event.m_Array[0];
      if (mevent["type"] == "mousedown" || mevent["type"] == "mousemove") {
        this.mouse = new THREE.Vector2();
        this.mouse.x = mevent["clientX"]*2-1.0;
        this.mouse.y = -1*mevent["clientY"]*2+1.0;
      }
      //console.log("moParticlesSimple.Update() > ", this.mouse );
    } else {
      this.mouse = null;
    }
  }

  GetDefinition(): MO.moConfigDefinition {
    var p_cdef = super.GetDefinition();

    //p_cdef.Add("particlecolor", moParamType.MO_PARAM_COLOR, PAR.PARTICLES_PARTICLECOLOR);

    return this.m_Config.GetConfigDefinition();
  }



  ///SCRIPT
  //
  //
  GetParticle( i : number) : moParticlesSimple {
    if (i>=0 && i < this.m_ParticlesSimpleArray.length) {
      return this.m_ParticlesSimpleArray[i];
    }
    return null;
  }


}
