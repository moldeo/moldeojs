import * as MO from "moldeojs";
import {
  NULL,
  moVector2f, moVector3f, moVector4f,
  moColor, moText, moData, moValue, moParam, moParamType, moTimer,
  MOdouble, MOfloat, MOint, MOuint, MOlong, MOulong,
  moAbstract, moMesh, moMaterial, moMaterialBase, moMaterialBasic,
  moGLManager, moGLMatrixf, moRenderManager
}
  from "moldeojs";

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


export const TextureModeOptions : MO.moTextArray = [];

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
  PARTICLES_INLET,
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


export class moParticlesSimple extends moAbstract {

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
      Size.X > EmitterSize.X() / m_cols
      Size.Y > EmitterSize.Y() / m_rows
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


export type moParticlesSimpleArray = moParticlesSimple[];
//typedef std::map< double, moParticlesSimple* > TMapDepthToParticleSimple;


export class moEffectParticlesSimple extends MO.moEffect {

  RM: MO.moRenderManager;
  GL: MO.moGLManager;

  Plane: MO.moPlaneGeometry;
  Mat: MO.moMaterialBasic;
  Camera: MO.moCamera3D;
  Model: MO.moGLMatrixf;
  Mesh: MO.moMesh;
  Scene: MO.moSceneNode;

  constructor() {
    super();
    this.SetName("particlessimple");
  }

  Init(callback?:any): boolean {
    this.RM = this.m_pResourceManager.GetRenderMan();
    this.GL = this.m_pResourceManager.GetGLMan();

    console.log(`moEffect${this.GetName()}.Init ${this.GetName()}`);
    if (this.PreInit((res) => {
      if (callback) callback(res);
    }) == false) {
      return false;
    }
/*
    ///IMPORTANT: add inlets before PreInit so inlets name are availables for function variables!!
    m_pParticleTime = new moInlet();

    if (m_pParticleTime) {
      ((moConnector*)m_pParticleTime)->Init( moText("particletime"), m_Inlets.Count(), MO_DATA_NUMBER_DOUBLE );
      m_Inlets.Add(m_pParticleTime);
    }

    m_pParticleIndex = new moInlet();

    if (m_pParticleIndex) {
      ((moConnector*)m_pParticleIndex)->Init( moText("particleindex"), m_Inlets.Count(), MO_DATA_NUMBER_LONG );
      m_Inlets.Add(m_pParticleIndex);
    }
*/
/*
  m_Physics.m_ParticleScript = moText("");

    m_Rate = 0;
    last_tick = 0;
    frame = 0;

    ortho = false;

    m_bTrackerInit = false;
    m_pTrackerData = NULL;

    UpdateParameters();

    ResetTimers();

    InitParticlesSimple(  m_Config.Int( moR(PARTICLES_WIDTH) ),
                          m_Config.Int( moR(PARTICLES_HEIGHT)) );


    pTextureDest = NULL;
    pSubSample = NULL;
    samplebuffer = NULL;

    glidori  = 0;
    glid = 0;
    original_width = 0;
    original_height = 0;
    original_proportion = 1.0;

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
/*
    TimerFullRevelation.Stop();
    TimerFullRestoration.Stop();
    TimerOfRevelation.Stop();
    TimerOfRestoration.Stop();

    FeatureActivity.Stop();
    MotionActivity.Stop();
    NoMotionActivity.Stop();
    m_Physics.EmitionTimer.Stop();

      for ( int i=0; i < m_ParticlesSimpleArray.Count(); i++ ) {
            moParticlesSimple* pPar = m_ParticlesSimpleArray[i];
            pPar->Age.Stop();
            pPar->Age.SetRelativeTimer( (moTimerAbsolute*)&m_EffectState.tempo );
            pPar->Visible = false;
      }

  m_Physics.m_pLastBordParticle = NULL;*/
}

ReInit() : void {
/*
    MODebug2->Push(moText("moEffectParticlesSimple::ReInit Face construction activated!!!!"));

    int i;
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
            moParticlesSimple* pPar = m_ParticlesSimpleArray[i+j*m_cols];

            if (pPar) {

                pPar->Pos = moVector2f( (float) i, (float) j);
                pPar->ImageProportion = 1.0;
                pPar->Color = moVector3f(1.0,1.0,1.0);
                pPar->GLId2 = 0;

                if (texture_mode==PARTICLES_TEXTUREMODE_MANY2PATCH) {

                    ///take the texture preselected
                    moTextureBuffer* pTexBuf = m_Config[moR(PARTICLES_FOLDERS)][MO_SELECTED][0].TextureBuffer();

                    pPar->GLId = glidori;
                    pPar->GLId2 = glid;
                    //pPar->GLId2 = 0;

                    pPar->TCoord2 = moVector2f( 0.0, 0.0 );
                    pPar->TSize2 = moVector2f( 1.0f, 1.0f );

                    pPar->TCoord = moVector2f( (float) (i ) / (float) m_cols, (float) (j) / (float) m_rows );
                    pPar->TSize = moVector2f( 1.0f / (float) m_cols, 1.0f / (float) m_rows );

                    ///calculamos la luminancia del cuadro correspondiente
                    //int x0, y0, x1, y1;
                    float lumf = 0.0;

                    if (pSubSample && samplebuffer) {

                        if (pSubSample->GetWidth()!=m_cols) MODebug2->Error(moText("pSubSample width doesnt match m_cols"));
                        if (pSubSample->GetHeight()!=m_rows) MODebug2->Error(moText("pSubSample height doesnt match m_rows"));

                        int r = samplebuffer[ (i + j*pSubSample->GetWidth() ) *3 ];
                        int g = samplebuffer[ (i+1 + j*pSubSample->GetWidth() ) *3 ];
                        int b = samplebuffer[ (i+2 + j*pSubSample->GetWidth() ) *3 ];
                        //MODebug2->Message(moText("r:")+IntToStr(r)+moText(" g:")+IntToStr(g)+moText(" b:")+IntToStr(b));

                        lum = (r+g+b)/3;

                        //lum = ( + samplebuffer[ (i+1 + j*pSubSample->GetWidth() ) *3 ]
                        // + samplebuffer[ (i+2 + j*pSubSample->GetWidth() ) *3 ] ) / 3;
                        lum = ((lum & 1) << 7) | ((lum & 2) << 5) | ((lum & 4) << 3) | ((lum & 8) << 1)
                        | ((lum & 16) >> 1) | ((lum & 32) >> 3) | ((lum & 64) >> 5) | ((lum & 128) >> 7);
                        if (lum<0) lum = 0;
                        //MODebug2->Message(moText("lum:")+IntToStr(lum));

                        if (lum>=0) {
                            lum = lum*1.2;

                            lumf = ( 100.0 * (float)lum ) / (float)255.0;
                            lumindex = (int) lumf;
                            if (lumindex>99) lumindex = 99;
                            //MODebug2->Push( moText("## Lum Index R G B ##") +IntToStr(lum)+IntToStr(r)+IntToStr(g)+IntToStr(b));

                        } else {
                            MODebug2->Message(moText("ReInit error:## lum is negative!!! ##")+IntToStr(lum)
                                    +moText("subs: w:") + IntToStr(pSubSample->GetWidth())
                                    +moText("subs: h:") + IntToStr(pSubSample->GetHeight())
                            );
                            lumindex = 99;
                        }

                    } else MODebug2->Push(moText("ReInit error: no texture nor samplebuffer"));


                     if (pTexBuf && pTextureDest && samplebuffer) {

                         int nim = pTexBuf->GetImagesProcessed();

                         pPar->ImageProportion = 1.0;

                         if (nim>0) {

                             moTextureFrames& pTextFrames(pTexBuf->GetBufferLevels( lumindex, 0 ) );

                             int nc = pTextFrames.Count();
                             int irandom = -1;

                             irandom = (int)( moMathf::UnitRandom() * (double)nc );
                             //irandom = 0;

                            moTextureMemory* pTexMem = pTextFrames.GetRef( irandom );

                            if (pTexMem) {
                                pPar->GLId = glidori;
                                pTexMem->GetReference();
                                pPar->GLId2 = pTexMem->GetGLId();
                                pPar->pTextureMemory = pTexMem;
                                if (pTexMem ->GetHeight() > 0)
                                  pPar ->ImageProportion = (float) pTexMem->GetWidth() / (float) pTexMem->GetHeight();
                            } else {
                                #ifdef _DEBUG
                                MODebug2 ->Message(moText("Sample not founded: lumindex:")
                                  + IntToStr(lumindex) + moText(" irandom:") + IntToStr(irandom));
                                #endif
                                pPar->GLId = glidori;
                                pPar->GLId2 = pPar->GLId;
                                pPar->Color.X() = ((float)lum )/ 255.0f;
                                pPar->Color.Y() = ((float)lum )/ 255.0f;
                                pPar->Color.Z() = ((float)lum )/ 255.0f;
                                pPar->Color.X()*= pPar->Color.X();
                                pPar->Color.Y()*= pPar->Color.Y();
                                pPar->Color.Z()*= pPar->Color.Z();
                            }

                            //MODebug2->Push( moText("creating particle: irandom:")
                            // + IntToStr(irandom) + moText(" nc:") + IntToStr(nc)
                            //
                            // + moText(" count:") + IntToStr(pTexBuf->GetImagesProcessed())
                            // + moText(" glid:") + IntToStr(pPar->GLId) + moText(" glid2:") + IntToStr(pPar->GLId2) );

                         }

                     } else {
                         MODebug2->Error( moText("particles error creating texture") );
                     }


                     //MODebug2->Log( moText("i:") + IntToStr(i) + moText(" J:")
                     // + IntToStr(j) + moText(" lum:") + IntToStr(lum) + moText(" lumindex:")
                     // + IntToStr(lumindex) + moText(" glid:") + IntToStr(pPar->GLId)
                     // + moText(" glid2:") + IntToStr(pPar->GLId2));

                }


                pPar->Size = moVector2f( m_Physics.m_EmitterSize.X() / (float) m_cols, m_Physics.m_EmitterSize.Y() / (float) m_rows );
                pPar->Force = moVector3f( 0.0f, 0.0f, 0.0f );

                SetParticlePosition( pPar );

                if (m_Physics.m_EmitionPeriod>0) {
                    pPar->Age.Stop();
                    pPar->Visible = false;
                } else {
                    pPar->Age.Stop();
                    pPar->Age.Start();
                    pPar->Visible = true;
                }

                ///Set Timer management
                pPar->Age.SetObjectId( this->GetId() );
                pPar->Age.SetTimerId( i + j*m_cols );
                m_pResourceManager->GetTimeMan()->AddTimer( &pPar->Age );

                m_ParticlesSimpleArray.Set( i + j*m_cols, pPar );

                moParticlesSimple* pParTmp = m_ParticlesSimpleArrayTmp[i + j*m_cols];
                pParTmp->Pos3d = pPar->Pos3d;
                pParTmp->Velocity = pPar->Velocity;
                pParTmp->Mass = pPar->Mass;
                pParTmp->Force = pPar->Force;
                pParTmp->Fixed = pPar->Fixed;
                m_ParticlesSimpleArrayTmp.Set( i + j*m_cols, pParTmp );

            } else MODebug2->Error(moText("ParticleSimple::ReInit::no particle pointer"));
        }
    }

*/
}


UpdateDt() : void {
/*
    /// 60 FPS = 16.666 milliseconds
    /// dtrel is frame relative where if dtrel = 1 = 1 frame (60fps)
    dtrel = (double) ( m_EffectState.tempo.ticks - last_tick ) / (double)16.666666;

    dt = m_Config.Eval( moR(PARTICLES_SYNC)) * dtrel * (double)(m_EffectState.tempo.delta) /  (double)100.0;

    last_tick = m_EffectState.tempo.ticks;
*/
}

UpdateParameters() : void {

/*
    this->UpdateDt();  // now in ::Update()

    time_tofull_restoration = m_Config.Int( moR(PARTICLES_TIMETORESTORATION) );
    time_of_restoration = m_Config.Int( moR(PARTICLES_TIMEOFRESTORATION) );

    time_tofull_revelation = m_Config.Int( moR(PARTICLES_TIMETOREVELATION));
    time_of_revelation = m_Config.Int( moR(PARTICLES_TIMEOFREVELATION) );

    ortho = (bool) m_Config.Int( moR(PARTICLES_ORTHO) );

    if ( moIsTimerStopped() || !m_EffectState.tempo.Started() ) {
        ResetTimers();
        //MODebug2->Message("moEffectParticlesSimple::UpdateParameters  > ResetTimers!!!");
    }

    //if script is modified... recompile
	if ((moText)m_Physics.m_ParticleScript!=m_Config.Text( moR(PARTICLES_SCRIPT2) ) ) {

        m_Physics.m_ParticleScript = m_Config.Text( moR(PARTICLES_SCRIPT2) );
        moText fullscript = m_pResourceManager->GetDataMan()->GetDataPath()+ moSlash + (moText)m_Physics.m_ParticleScript;

        if ( CompileFile(fullscript) ) {

            MODebug2->Message(moText("ParticlesSimple script loaded ") + (moText)fullscript );

            SelectScriptFunction( "Init" );
            //AddFunctionParam( m_FramesPerSecond );
            RunSelectedFunction();

        } else MODebug2->Error(moText("ParticlesSimple couldnt compile lua script ") + (moText)fullscript );
	}

    if (moScript::IsInitialized()) {
        if (ScriptHasFunction("RunSystem")) {
            SelectScriptFunction("RunSystem");
            //passing number of particles
            AddFunctionParam( (int) ( m_rows*m_cols ) );
            AddFunctionParam( (float) dt );
            RunSelectedFunction(1);
        }
    }

    drawing_features = m_Config.Int( moR(PARTICLES_DRAWINGFEATURES));
    texture_mode = m_Config.Int( moR(PARTICLES_TEXTUREMODE));

    m_Physics.m_EyeVector = moVector3f(
                                        m_Config.Eval( moR(PARTICLES_EYEX)),
                                        m_Config.Eval( moR(PARTICLES_EYEY)),
                                        m_Config.Eval( moR(PARTICLES_EYEZ))
                                       );

    m_Physics.m_TargetViewVector = moVector3f(
                                        m_Config.Eval( moR(PARTICLES_VIEWX)),
                                        m_Config.Eval( moR(PARTICLES_VIEWY)),
                                        m_Config.Eval( moR(PARTICLES_VIEWZ))
                                       );

    m_Physics.m_UpViewVector = moVector3f(
                                        m_Config.Eval( moR(PARTICLES_UPVIEWX)),
                                        m_Config.Eval( moR(PARTICLES_UPVIEWY)),
                                        m_Config.Eval( moR(PARTICLES_UPVIEWZ))
                                       );

    m_Physics.m_SourceLighMode = (moParticlesSimpleLightMode) m_Config.Int( moR(PARTICLES_LIGHTMODE));
    m_Physics.m_SourceLightVector = moVector3f(
                                        m_Config.Eval( moR(PARTICLES_LIGHTX)),
                                        m_Config.Eval( moR(PARTICLES_LIGHTY)),
                                        m_Config.Eval( moR(PARTICLES_LIGHTZ))
                                       );

    m_Physics.gravitational = m_Config.Eval( moR(PARTICLES_GRAVITY));
    m_Physics.viscousdrag = m_Config.Eval( moR(PARTICLES_VISCOSITY));


    //emiper = (float)m_Config[moR(PARTICLES_EMITIONPERIOD)][MO_SELECTED][0].Int();
    //emiper = emiper * midi_emitionperiod;
    //emiperi = (long) emiper;
    //MODebug2->Message(moText("Emiper:")+IntToStr(emiperi));

    //m_Physics.m_MaxAge = m_Config.Int( moR(PARTICLES_MAXAGE) );
    m_Physics.m_MaxAge = (long) m_Config.Eval( moR(PARTICLES_MAXAGE) );
    //m_Physics.m_EmitionPeriod = emiperi;
    //emiperi = m_Config[moR(PARTICLES_EMITIONPERIOD)][MO_SELECTED][0].Int() * midi_emitionperiod;
    //m_Physics.m_EmitionPeriod = emiperi;
    m_Physics.m_EmitionPeriod = (long) m_Config.Eval( moR(PARTICLES_EMITIONPERIOD) );
    //m_Physics.m_EmitionPeriod = m_Config[moR(PARTICLES_EMITIONPERIOD)][MO_SELECTED][0].Int();
    //MODebug2->Message(moText("Emiperiod:")+IntToStr(m_Physics.m_EmitionPeriod));

    //m_Physics.m_EmitionRate = m_Config.Int( moR(PARTICLES_EMITIONRATE) );
    m_Physics.m_EmitionRate = (long) m_Config.Eval( moR(PARTICLES_EMITIONRATE) );
    m_Physics.m_DeathPeriod = m_Config.Int( moR(PARTICLES_DEATHPERIOD) );


    m_Physics.m_RandomMethod = (moParticlesRandomMethod) m_Config.Int( moR(PARTICLES_RANDOMMETHOD) );
    m_Physics.m_CreationMethod = (moParticlesCreationMethod) m_Config.Int( moR(PARTICLES_CREATIONMETHOD) );

    m_Physics.m_OrientationMode = (moParticlesOrientationMode) m_Config.Int( moR(PARTICLES_ORIENTATIONMODE) );

    m_Physics.m_FadeIn = m_Config.Eval( moR(PARTICLES_FADEIN));
    m_Physics.m_FadeOut = m_Config.Eval( moR(PARTICLES_FADEOUT));
    m_Physics.m_SizeIn = m_Config.Eval( moR(PARTICLES_SIZEIN));
    m_Physics.m_SizeOut = m_Config.Eval( moR(PARTICLES_SIZEOUT));

    m_Physics.m_RandomPosition = m_Config.Eval( moR(PARTICLES_RANDOMPOSITION));
    m_Physics.m_RandomVelocity = m_Config.Eval( moR(PARTICLES_RANDOMVELOCITY));
    m_Physics.m_RandomMotion = m_Config.Eval( moR(PARTICLES_RANDOMMOTION));


    m_Physics.m_EmitterType = (moParticlesSimpleEmitterType) m_Config.Int( moR(PARTICLES_EMITTERTYPE));
    m_Physics.m_AttractorType = (moParticlesSimpleAttractorType) m_Config.Int( moR(PARTICLES_ATTRACTORTYPE));

    m_Physics.m_PositionVector = moVector3f(m_Config.Eval( moR(PARTICLES_RANDOMPOSITION_X)),
                                            m_Config.Eval( moR(PARTICLES_RANDOMPOSITION_Y)),
                                            m_Config.Eval( moR(PARTICLES_RANDOMPOSITION_Z)) );

    m_Physics.m_EmitterSize = moVector3f(   m_Config.Eval( moR(PARTICLES_SIZEX)),
                                            m_Config.Eval( moR(PARTICLES_SIZEY)),
                                            m_Config.Eval( moR(PARTICLES_SIZEZ)));

    m_Physics.m_VelocityVector =  moVector3f( m_Config.Eval( moR(PARTICLES_RANDOMVELOCITY_X)),
                                            m_Config.Eval( moR(PARTICLES_RANDOMVELOCITY_Y)),
                                            m_Config.Eval( moR(PARTICLES_RANDOMVELOCITY_Z)));

    m_Physics.m_MotionVector =  moVector3f( m_Config.Eval( moR(PARTICLES_RANDOMMOTION_X)),
                                            m_Config.Eval( moR(PARTICLES_RANDOMMOTION_Y)),
                                            m_Config.Eval( moR(PARTICLES_RANDOMMOTION_Z)));

    m_Physics.m_EmitterVector = moVector3f( m_Config.Eval( moR(PARTICLES_EMITTERVECTOR_X)),
                                            m_Config.Eval( moR(PARTICLES_EMITTERVECTOR_Y)),
                                            m_Config.Eval( moR(PARTICLES_EMITTERVECTOR_Z)));

    if (m_bTrackerInit && m_Physics.m_EmitterType==PARTICLES_EMITTERTYPE_TRACKER2) {
        m_Physics.m_EmitterVector = moVector3f( m_TrackerBarycenter.X()*normalf, m_TrackerBarycenter.Y()*normalf, 0.0f );
    }

    m_Physics.m_AttractorMode = (moParticlesSimpleAttractorMode) m_Config.Int( moR(PARTICLES_ATTRACTORMODE));
    m_Physics.m_AttractorVector = moVector3f( m_Config.Eval( moR(PARTICLES_ATTRACTORVECTOR_X)),
                                            m_Config.Eval( moR(PARTICLES_ATTRACTORVECTOR_Y)),
                                            m_Config.Eval( moR(PARTICLES_ATTRACTORVECTOR_Z)));

    if (original_proportion!=1.0f) {
            if (original_proportion>1.0f) {
                m_Physics.m_AttractorVector.Y() = m_Physics.m_AttractorVector.Y() / original_proportion;
            } else {
                m_Physics.m_AttractorVector.X() = m_Physics.m_AttractorVector.X() * original_proportion;
            }
    }

    normalf = m_Physics.m_EmitterSize.X();

    m_OrderingMode = (moParticlesOrderingMode) m_Config.Int( moR(PARTICLES_ORDERING_MODE) );

    float ralpha,rbeta,rgama;

    ralpha = moMathf::DegToRad( m_Config.Eval( moR(PARTICLES_ROTATEX) ) );
    rbeta = moMathf::DegToRad( m_Config.Eval( moR(PARTICLES_ROTATEY) ) );
    rgama = moMathf::DegToRad( m_Config.Eval( moR(PARTICLES_ROTATEZ) ) );

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


    m_TS[0] = moVector4f(  m_Config.Eval( moR(PARTICLES_SCALEX) ), 0, 0, m_Config.Eval( moR(PARTICLES_TRANSLATEX) ) );
    m_TS[1] = moVector4f(  0, m_Config.Eval( moR(PARTICLES_SCALEY) ), 0, m_Config.Eval( moR(PARTICLES_TRANSLATEY) ) );
    m_TS[2] = moVector4f(  0, 0, m_Config.Eval( moR(PARTICLES_SCALEZ) ), m_Config.Eval( moR(PARTICLES_TRANSLATEZ) ) );
    m_TS[3] = moVector4f(  0, 0, 0, 1 );
*/
}

SetParticlePosition( pParticle : moParticlesSimple ) : void {
/*
    float left =  - (m_Physics.m_EmitterSize.X()) / 2.0;
    float top =  m_Physics.m_EmitterSize.Y() / 2.0;
    float randomvelx = 0;
    float randomvely = 0;
    float randomvelz = 0;
    float randomposx = 0;
    float randomposy = 0;
    float randomposz = 0;
    double alpha;
    double phi;
    double radius;
    double z;
    double radius1;
    double radius2;

    double len=0,index=0,index_normal=0;

    randomposx = ( fabs(m_Physics.m_RandomPosition) >0.0)? (0.5-moMathf::UnitRandom())*m_Physics.m_RandomPosition*
    m_Physics.m_PositionVector.X() : m_Physics.m_PositionVector.X();
    randomposy = ( fabs(m_Physics.m_RandomPosition) >0.0)? (0.5-moMathf::UnitRandom())*m_Physics.m_RandomPosition
    *m_Physics.m_PositionVector.Y() : m_Physics.m_PositionVector.Y();
    randomposz = ( fabs(m_Physics.m_RandomPosition) >0.0)? (0.5-moMathf::UnitRandom())*m_Physics.m_RandomPosition
    *m_Physics.m_PositionVector.Z() : m_Physics.m_PositionVector.Z();

    randomvelx = ( fabs(m_Physics.m_RandomVelocity) >0.0)? (moMathf::UnitRandom())*m_Physics.m_RandomVelocity
    *m_Physics.m_VelocityVector.X() : m_Physics.m_VelocityVector.X();
    randomvely = ( fabs(m_Physics.m_RandomVelocity) >0.0)? (moMathf::UnitRandom())*m_Physics.m_RandomVelocity
    *m_Physics.m_VelocityVector.Y() : m_Physics.m_VelocityVector.Y();
    randomvelz = ( fabs(m_Physics.m_RandomVelocity) >0.0)? (moMathf::UnitRandom())*m_Physics.m_RandomVelocity
    *m_Physics.m_VelocityVector.Z() : m_Physics.m_VelocityVector.Z();

    moVector4d fullcolor;
    fullcolor = m_Config.EvalColor( moR(PARTICLES_PARTICLECOLOR));
    pParticle->Color = moVector3f(
                              fullcolor.X(),
                              fullcolor.Y(),
                              fullcolor.Z() );

    pParticle->Mass = 10.0f;
    pParticle->Fixed = false;

    pParticle->U = moVector3f( 1.0, 0.0, 0.0 );
    pParticle->V = moVector3f( 0.0, 1.0, 0.0 );
    pParticle->W = moVector3f( 0.0, 0.0, 1.0 );

    pParticle->dpdt = moVector3f( 0.0f, 0.0f, 0.0f );
    pParticle->dvdt = moVector3f( 0.0f, 0.0f, 0.0f );

    if (m_Physics.m_FadeIn>0.0) pParticle->Alpha = 0.0;///fade in ? to middle age?
    else pParticle->Alpha = fullcolor.W();

    if (m_Physics.m_SizeIn>0.0) pParticle->Scale = 0.0;///fade in ? to middle age?
    else pParticle->Scale = 1.0;

    switch(m_Physics.m_EmitterType) {

        case PARTICLES_EMITTERTYPE_GRID:
            //GRID POSITION
           switch(m_Physics.m_CreationMethod) {
                case PARTICLES_CREATIONMETHOD_LINEAR:
                    pParticle->Pos3d = moVector3f(   ( left + pParticle->Pos.X()*pParticle->Size.X()
                    + pParticle->Size.X()*randomposx/2.0 )*m_Physics.m_EmitterVector.X() ,
                                                     ( top - pParticle->Pos.Y()*pParticle->Size.Y()
                                                     - pParticle->Size.Y()*randomposy/2.0 )*m_Physics.m_EmitterVector.Y(),
                                                    randomposz*m_Physics.m_EmitterVector.Z() );
                    pParticle->Velocity = moVector3f( randomvelx,
                                                      randomvely,
                                                      randomvelz );
                    break;

                case PARTICLES_CREATIONMETHOD_PLANAR:
                case PARTICLES_CREATIONMETHOD_VOLUMETRIC:
                    pParticle->Pos3d = moVector3f(   ( left + moMathf::UnitRandom()*m_Physics.m_EmitterSize.X()
                    + pParticle->Size.X()*randomposx/2.0 )*m_Physics.m_EmitterVector.X() ,
                                                     ( top - moMathf::UnitRandom()*m_Physics.m_EmitterSize.Y()
                                                     - pParticle->Size.Y()*randomposy/2.0 )*m_Physics.m_EmitterVector.Y(),
                                                    randomposz*m_Physics.m_EmitterVector.Z() );
                    pParticle->Velocity = moVector3f( randomvelx,
                                                      randomvely,
                                                      randomvelz );
                    break;
            }

            break;

        case PARTICLES_EMITTERTYPE_SPHERE:
            //SPHERE POSITION
            switch(m_Physics.m_CreationMethod) {
                case PARTICLES_CREATIONMETHOD_LINEAR:
                    alpha = 2 * moMathf::PI * pParticle->Pos.X() / (double)m_cols;
                    phi = moMathf::PI * pParticle->Pos.Y() / (double)m_rows;
                    radius = moMathf::Sqrt( m_Physics.m_EmitterSize.X()
                    *m_Physics.m_EmitterSize.X()+m_Physics.m_EmitterSize.Y()
                    *m_Physics.m_EmitterSize.Y()) / 2.0;

                    pParticle ->Pos3d = moVector3f((radius * moMathf::Cos(alpha) * moMathf::Sin(phi)
                      + randomposx) * m_Physics.m_EmitterVector.X(),
                      (radius * moMathf::Sin(alpha) * moMathf::Sin(phi)
                        + randomposy ) * m_Physics.m_EmitterVector.Y(),
                                                    (radius*moMathf::Cos(phi) + randomposz ) * m_Physics.m_EmitterVector.Z() );

                    pParticle->Velocity = moVector3f( randomvelx,
                                                      randomvely,
                                                      randomvelz );
                    break;

                case  PARTICLES_CREATIONMETHOD_PLANAR:
                    alpha = 2 * (moMathf::PI) * moMathf::UnitRandom();
                    phi = moMathf::PI * moMathf::UnitRandom();
                    radius = moMathf::Sqrt(m_Physics.m_EmitterSize.X() * m_Physics.m_EmitterSize.X()
                      + m_Physics.m_EmitterSize.Y() * m_Physics.m_EmitterSize.Y()) / 2.0;
                    pParticle->Pos3d = moVector3f(
                                        (radius*moMathf::Cos(alpha)*moMathf::Sin(phi) + randomposx)* m_Physics.m_EmitterVector.X(),
                                        (radius*moMathf::Sin(alpha)*moMathf::Sin(phi) + randomposy)* m_Physics.m_EmitterVector.Y(),
                                        (radius*moMathf::Cos(phi) + randomposz)* m_Physics.m_EmitterVector.Z()
                                        );
                    pParticle->Velocity = moVector3f( randomvelx,
                                                      randomvely,
                                                      randomvelz );
                    break;

                case  PARTICLES_CREATIONMETHOD_VOLUMETRIC:
                    alpha = 2 * moMathf::PI * moMathf::UnitRandom();
                    phi = moMathf::PI * moMathf::UnitRandom();
                    radius = moMathf::Sqrt(m_Physics.m_EmitterSize.X() * m_Physics.m_EmitterSize.X()
                      + m_Physics.m_EmitterSize.Y() * m_Physics.m_EmitterSize.Y()) * moMathf::UnitRandom() / 2.0;

                    pParticle ->Pos3d = moVector3f((radius * moMathf::Cos(alpha) * moMathf::Sin(phi)
                      + randomposx) * m_Physics.m_EmitterVector.X(),
                      (radius * moMathf::Sin(alpha) * moMathf::Sin(phi)
                        + randomposy ) * m_Physics.m_EmitterVector.Y(),
                                                    (radius*moMathf::Cos(phi) + randomposz ) * m_Physics.m_EmitterVector.Z() );

                    pParticle->Velocity = moVector3f( randomvelx,
                                                      randomvely,
                                                      randomvelz );
                    break;
            }
            break;

        case PARTICLES_EMITTERTYPE_TUBE:
            //SPHERE POSITION
            switch(m_Physics.m_CreationMethod) {
                case PARTICLES_CREATIONMETHOD_LINEAR:
                    alpha = 2 * moMathf::PI * pParticle->Pos.X() / (double)m_cols;
                    radius1 = m_Physics.m_EmitterSize.X() / 2.0;
                    radius2 = m_Physics.m_EmitterSize.Y() / 2.0;
                    z = m_Physics.m_EmitterSize.Z() * ( 0.5f - ( pParticle->Pos.Y() / (double)m_rows ) );

                    pParticle->Pos3d = moVector3f(  ( radius1*moMathf::Cos(alpha) + randomposx ) * m_Physics.m_EmitterVector.X(),
                                                    ( radius1*moMathf::Sin(alpha) + randomposy ) * m_Physics.m_EmitterVector.Y(),
                                                    ( z + randomposz ) * m_Physics.m_EmitterVector.Z() );

                    pParticle->Velocity = moVector3f( randomvelx,
                                                      randomvely,
                                                      randomvelz );
                    break;

                case  PARTICLES_CREATIONMETHOD_PLANAR:
                    alpha = 2 * moMathf::PI * moMathf::UnitRandom();
                    radius1 = m_Physics.m_EmitterSize.X() / 2.0;
                    radius2 = m_Physics.m_EmitterSize.Y() / 2.0;
                    z = m_Physics.m_EmitterSize.Z() * ( 0.5f - moMathf::UnitRandom());

                    pParticle->Pos3d = moVector3f(  ( radius1*moMathf::Cos(alpha) + randomposx ) * m_Physics.m_EmitterVector.X(),
                                                    ( radius1*moMathf::Sin(alpha) + randomposy ) * m_Physics.m_EmitterVector.Y(),
                                                    ( z + randomposz ) * m_Physics.m_EmitterVector.Z() );

                    pParticle->Velocity = moVector3f( randomvelx,
                                                      randomvely,
                                                      randomvelz );
                    break;

                case  PARTICLES_CREATIONMETHOD_VOLUMETRIC:
                    alpha = 2 * moMathf::PI * moMathf::UnitRandom();
                    radius1 = m_Physics.m_EmitterSize.X() / 2.0;
                    radius2 = m_Physics.m_EmitterSize.Y() / 2.0;
                    radius = radius1 + moMathf::UnitRandom()*(radius2-radius1)*moMathf::UnitRandom();
                    z = m_Physics.m_EmitterSize.Z() * ( 0.5f - moMathf::UnitRandom());

                    pParticle->Pos3d = moVector3f(  ( radius*moMathf::Cos(alpha) + randomposx ) * m_Physics.m_EmitterVector.X(),
                                                    ( radius*moMathf::Sin(alpha) + randomposy ) * m_Physics.m_EmitterVector.Y(),
                                                    ( z + randomposz ) * m_Physics.m_EmitterVector.Z() );

                    pParticle->Velocity = moVector3f( randomvelx,
                                                      randomvely,
                                                      randomvelz );
                    break;
            }
            break;

        case PARTICLES_EMITTERTYPE_JET:
            //SPHERE POSITION
            switch(m_Physics.m_CreationMethod) {
                case PARTICLES_CREATIONMETHOD_LINEAR:

                    //z = m_Physics.m_EmitterSize.Z() * moMathf::UnitRandom();
                    len = m_Physics.m_EmitterVector.Length();
                    index = pParticle->Pos.X()+pParticle->Pos.Y()*(double)m_cols;
                    index_normal = 0.0; ///si no hay particulas siempre en 0

                    if (m_cols*m_rows) {
                        index_normal = index / (double)(m_cols*m_rows);
                    }
                    z = index_normal;

                    pParticle->Pos3d = moVector3f(  m_Physics.m_EmitterVector.X()*( z + randomposx ),
                                                    m_Physics.m_EmitterVector.Y()*( z + randomposy ),
                                                    m_Physics.m_EmitterVector.Z()*( z + randomposz) );

                    pParticle->Velocity = moVector3f(   randomvelx,
                                                        randomvely,
                                                        randomvelz);
                    break;
                case PARTICLES_CREATIONMETHOD_PLANAR:
                case PARTICLES_CREATIONMETHOD_VOLUMETRIC:
                    z = m_Physics.m_EmitterSize.Z() * moMathf::UnitRandom();

                    pParticle->Pos3d = moVector3f(  m_Physics.m_EmitterVector.X()*( z + randomposx ),
                                                    m_Physics.m_EmitterVector.Y()*( z + randomposy ),
                                                    m_Physics.m_EmitterVector.Z()*( z + randomposz) );

                    pParticle->Velocity = moVector3f(   randomvelx,
                                                        randomvely,
                                                        randomvelz);
                    break;

            }
            break;

        case PARTICLES_EMITTERTYPE_POINT:
            //SPHERE POSITION
            pParticle->Pos3d = moVector3f(  randomposx+m_Physics.m_EmitterVector.X(),
                                            randomposy+m_Physics.m_EmitterVector.Y(),
                                            randomposz+m_Physics.m_EmitterVector.Z() );

            pParticle->Velocity = moVector3f(   randomvelx,
                                                randomvely,
                                                randomvelz);

            break;
        case PARTICLES_EMITTERTYPE_SPIRAL:
            //SPIRAL POSITION
            switch(m_Physics.m_CreationMethod) {
                case PARTICLES_CREATIONMETHOD_LINEAR:
                case  PARTICLES_CREATIONMETHOD_PLANAR:
                case  PARTICLES_CREATIONMETHOD_VOLUMETRIC:
                    alpha = 2 * moMathf::PI * pParticle->Pos.X() / (double)m_cols;
                    radius1 = m_Physics.m_EmitterSize.X() / 2.0;
                    radius2 = m_Physics.m_EmitterSize.Y() / 2.0;
                    z = m_Physics.m_EmitterSize.Z() * (0.5f - (pParticle ->Pos.Y() / (double)m_rows )
                    - (pParticle ->Pos.X() / (double)(m_cols * m_rows)) );

                    pParticle->Pos3d = moVector3f(  ( radius1*moMathf::Cos(alpha) + randomposx ) * m_Physics.m_EmitterVector.X(),
                                                    ( radius1*moMathf::Sin(alpha) + randomposy ) * m_Physics.m_EmitterVector.Y(),
                                                    ( z + randomposz ) * m_Physics.m_EmitterVector.Z() );

                    pParticle->Velocity = moVector3f( randomvelx,
                                                      randomvely,
                                                      randomvelz );
                    break;
            }
            break;
        case PARTICLES_EMITTERTYPE_CIRCLE:
            //CIRCLE POSITION
            switch(m_Physics.m_CreationMethod) {
                case PARTICLES_CREATIONMETHOD_LINEAR:
                    alpha = 2 * moMathf::PI * ( pParticle->Pos.X() + pParticle->Pos.Y()*m_cols ) / ((double)m_cols*(double)m_rows );
                    radius1 = m_Physics.m_EmitterSize.X() / 2.0;
                    radius2 = m_Physics.m_EmitterSize.Y() / 2.0;
                    z = 0.0;
                    //z = m_Physics.m_EmitterSize.Z() * ( 0.5f
                    // - ( pParticle->Pos.Y() / (double)m_rows ) - (pParticle->Pos.X() / (double)(m_cols*m_rows)) );

                    pParticle->Pos3d = moVector3f(  ( radius1*moMathf::Cos(alpha) + randomposx ) * m_Physics.m_EmitterVector.X(),
                                                    ( radius1*moMathf::Sin(alpha) + randomposy ) * m_Physics.m_EmitterVector.Y(),
                                                    ( z + randomposz ) );

                    pParticle->Velocity = moVector3f( randomvelx,
                                                      randomvely,
                                                      randomvelz );
                    break;
                case  PARTICLES_CREATIONMETHOD_PLANAR:
                case  PARTICLES_CREATIONMETHOD_VOLUMETRIC:
                    alpha = 2 * moMathf::PI *  ( pParticle->Pos.X()*m_rows + pParticle->Pos.Y()) / ((double)m_cols*(double)m_rows );
                    radius1 = m_Physics.m_EmitterSize.X() / 2.0;
                    radius2 = m_Physics.m_EmitterSize.Y() / 2.0;
                    z = 0.0;
                    //z = m_Physics.m_EmitterSize.Z() * ( 0.5f - ( pParticle->Pos.Y() / (double)m_rows )
                    // - (pParticle->Pos.X() / (double)(m_cols*m_rows)) );
                    randomposx = randomposx + (radius1-radius2)*moMathf::Cos(alpha);
                    randomposy = randomposy + (radius1-radius2)*moMathf::Sin(alpha);
                    pParticle->Pos3d = moVector3f(  ( radius1*moMathf::Cos(alpha) + randomposx ) * m_Physics.m_EmitterVector.X(),
                                                    ( radius1*moMathf::Sin(alpha) + randomposy ) * m_Physics.m_EmitterVector.Y(),
                                                    ( z + randomposz ) );

                    pParticle->Velocity = moVector3f( randomvelx,
                                                      randomvely,
                                                      randomvelz );
                    break;
            }
            break;

        case PARTICLES_EMITTERTYPE_TRACKER:
            switch(m_Physics.m_CreationMethod) {
                case PARTICLES_CREATIONMETHOD_CENTER:
                    if (m_pTrackerData) {
                        pParticle->Pos3d = moVector3f( (m_pTrackerData->GetBarycenter().X() - 0.5)*normalf,
                         (-m_pTrackerData->GetBarycenter().Y()+0.5)*normalf, 0.0 );
                        pParticle->Pos3d+= moVector3f( randomposx, randomposy, randomposz );
                        pParticle->Velocity = moVector3f( randomvelx, randomvely, randomvelz );
                    }
                    break;

                case PARTICLES_CREATIONMETHOD_LINEAR:
                case PARTICLES_CREATIONMETHOD_PLANAR:
                case PARTICLES_CREATIONMETHOD_VOLUMETRIC:



                    if (m_pTrackerData) {
                        bool bfounded = false;
                        int np =  (int) ( moMathf::UnitRandom() * m_pTrackerData->GetFeaturesCount() );

                        moTrackerFeature *pTF = NULL;

                        pTF = m_pTrackerData->GetFeature( np );
                        if (pTF->valid) {
                            pParticle->Pos3d = moVector3f( (pTF->x - 0.5)*normalf, (-pTF->y+0.5)*normalf, 0.0 );
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
                                    pParticle->Pos3d = moVector3f( (pTF->x - 0.5)*normalf, (-pTF->y+0.5)*normalf, 0.0 );
                                    bfounded = true;
                                }
                                np =  (int) ( moMathf::UnitRandom() * m_pTrackerData->GetFeaturesCount() );
                                cn++;
                            } while (!pTF->valid && np < m_pTrackerData->GetFeaturesCount() && cn<5 );
                            if (!bfounded) pParticle->Pos3d = moVector3f( (m_pTrackerData->GetBarycenter().X() - 0.5)*normalf,
                            (-m_pTrackerData->GetBarycenter().Y()+0.5)*normalf, 0.0 );
                        }


                    } else {
                        pParticle->Pos3d = moVector3f( 0, 0, 0 );
                    }

                    pParticle->Pos3d+= moVector3f( randomposx, randomposy, randomposz );

                    pParticle->Velocity = moVector3f(   randomvelx,
                                                        randomvely,
                                                        randomvelz);
                    break;

            }
            break;
    };

*/
}

InitParticlesSimple( p_cols : MOint, p_rows : MOint, p_forced : boolean ) : void {
/*
    int i,j;

    bool m_bNewImage = false;

    //Texture Mode MANY2PATCH takes a Shot "texture capture of actual camera"
    if (texture_mode==PARTICLES_TEXTUREMODE_MANY2PATCH) {
        Shot();
    }

    //Reset timers related to this object: one for each particle.
    if (m_pResourceManager){
        if (m_pResourceManager->GetTimeMan()) {
          m_pResourceManager->GetTimeMan()->ClearByObjectId(  this->GetId() );
        }
    }


        if (m_ParticlesSimpleArray.Count()>0) {

            m_ParticlesSimpleArray.Empty();
        }

        if (m_ParticlesSimpleArrayTmp.Count()>0) {

            m_ParticlesSimpleArrayTmp.Empty();
        }
        if (m_ParticlesSimpleArrayOrdered.Count()>0) {
            m_ParticlesSimpleArrayOrdered.Empty();
        }

        if ( !m_ParticlesSimpleVector.empty() ) {
          m_ParticlesSimpleVector.clear();
        }

    m_ParticlesSimpleVector.resize( p_cols*p_rows, NULL );
    m_ParticlesSimpleArrayOrdered.Init( p_cols*p_rows, NULL );
    m_ParticlesSimpleArray.Init( p_cols*p_rows, NULL );
    m_ParticlesSimpleArrayTmp.Init( p_cols*p_rows, NULL );

    int orderindex = 0;
    for( j=0; j<p_rows ; j++) {
            for( i=0; i<p_cols ; i++) {

            moParticlesSimple* pPar = new moParticlesSimple();
            m_ParticlesSimpleVector[orderindex] = pPar;
            orderindex++;

            pPar->ViewDepth = 0.0;
            pPar->Pos = moVector2f( (float) i, (float) j);
            pPar->ImageProportion = 1.0;
            //pPar->Color = moVector3f(1.0,1.0,1.0);
            moVector4d fullcolor;
            fullcolor = m_Config.EvalColor( moR(PARTICLES_PARTICLECOLOR));
            pPar->Color = moVector3f(
                                      fullcolor.X(),
                                      fullcolor.Y(),
                                      fullcolor.Z() );
            pPar->GLId2 = 0;

            if (texture_mode==PARTICLES_TEXTUREMODE_UNIT) {

                pPar->TCoord = moVector2f( 0.0, 0.0 );
                pPar->TSize = moVector2f( 1.0f, 1.0f );

            }
            else if (texture_mode==PARTICLES_TEXTUREMODE_PATCH) {

                pPar->TCoord = moVector2f( (float) (i) / (float) p_cols, (float) (j) / (float) p_rows );
                pPar->TSize = moVector2f( 1.0f / (float) p_cols, 1.0f / (float) p_rows );

            }
            else if (texture_mode==PARTICLES_TEXTUREMODE_MANY || texture_mode==PARTICLES_TEXTUREMODE_MANYBYORDER ) {

                pPar->TCoord = moVector2f( 0.0, 0.0 );
                pPar->TSize = moVector2f( 1.0f, 1.0f );

            }
            else if (texture_mode==PARTICLES_TEXTUREMODE_MANY2PATCH) {

                ///take the texture preselected
                moTextureBuffer* pTexBuf = m_Config[moR(PARTICLES_FOLDERS)][MO_SELECTED][0].TextureBuffer();

                pPar->GLId = glidori; //first id for Image reference to patch (and blend after)
                pPar->GLId2 = glid; //second id for each patch image

                pPar->TCoord2 = moVector2f( 0.0, 0.0 ); //coords for patch
                pPar->TSize2 = moVector2f( 1.0f, 1.0f );

                pPar->TCoord = moVector2f( (float) (i ) / (float) p_cols, (float) (j) / (float) p_rows );//grid
                pPar->TSize = moVector2f( 1.0f / (float) p_cols, 1.0f / (float) p_rows );//sizes

                ///calculamos la luminancia del cuadro correspondiente
                //int x0, y0, x1, y1;
                int lum = 0;
                int lumindex = 0;
                int contrast = 0;

                ///samplebuffer en la posicion i,j ?
                if (pSubSample && samplebuffer) {

                    lum = (samplebuffer[ (i + j*pSubSample->GetWidth() ) *3 ]
                           + samplebuffer[ (i+1 + j*pSubSample->GetWidth() ) *3 ]
                           + samplebuffer[ (i+2 + j*pSubSample->GetWidth() ) *3 ]) / 3;

                    if (lum<0) lum = -lum;
                    ///pasamos de color a porcentaje 0..255 a 0..99
                    if (lum>=0) {
                        lumindex = (int)( 100.0 * (float)lum / (float)256)  - 1;
                        if (lumindex>99) lumindex = 99;
                    }
                } else {
                    MODebug2->Message(moText("pSubSample: ")+IntToStr((long)pSubSample) +
                                    moText("samplebuffer: ")+IntToStr((long)samplebuffer));
                }

                 if (pTexBuf) {

                     ///cantidad de imagenes en el buffer
                     int nim = pTexBuf->GetImagesProcessed();

                     pPar->ImageProportion = 1.0;


                     if (nim>0) {

                        ///Tomamos de GetBufferLevels...

                         moTextureFrames& pTextFrames(pTexBuf->GetBufferLevels( lumindex, 0 ) );

                         int nc = pTextFrames.Count();
                         int irandom = -1;

                         irandom = (int)(  moMathf::UnitRandom() * (double)nc );

                        moTextureMemory* pTexMem = pTextFrames.GetRef( irandom );

                        if (pTexMem) {
                            pPar->GLId = glidori;
                            pTexMem->GetReference();
                            pPar->GLId2 = pTexMem->GetGLId();
                            pPar->pTextureMemory = pTexMem;
                            if (pTexMem->GetHeight()>0) pPar->ImageProportion = (float) pTexMem->GetWidth() / (float) pTexMem->GetHeight();
                        } else {
                            pPar->GLId = glidori;
                            pPar->GLId2 = pPar->GLId;
                            pPar->Color.X() = ((float)lum )/ 255.0f;
                            pPar->Color.Y() = ((float)lum )/ 255.0f;
                            pPar->Color.Z() = ((float)lum )/ 255.0f;
                            pPar->Color.X()*= pPar->Color.X();
                            pPar->Color.Y()*= pPar->Color.Y();
                            pPar->Color.Z()*= pPar->Color.Z();
                        }
                         //MODebug2->Push( moText("creating particle: irandom:") + IntToStr(irandom)
                         // + moText(" count:") + IntToStr(pTexBuf->GetImagesProcessed())
                         // + moText(" glid:") + IntToStr(pPar->GLId) );

                     }

                 } else MODebug2->Error( moText("particles error creating texture") );

            }

            pPar->Size = moVector2f( m_Physics.m_EmitterSize.X() / (float) p_cols, m_Physics.m_EmitterSize.Y() / (float) p_rows );
            pPar->Force = moVector3f( 0.0f, 0.0f, 0.0f );

            SetParticlePosition( pPar );


            if (m_Physics.m_EmitionPeriod>0) {
                pPar->Age.Stop();
                pPar->Visible = false;
            } else {
                pPar->Age.Start();
                pPar->Visible = true;
            }

            ///Set Timer management
            pPar->Age.SetObjectId( this->GetId() );
            pPar->Age.SetTimerId( i + j*p_cols );
            pPar->Age.SetRelativeTimer( (moTimerAbsolute*)&m_EffectState.tempo );
            m_pResourceManager->GetTimeMan()->AddTimer( &pPar->Age );

            m_ParticlesSimpleArray.Set( i + j*p_cols, pPar );

            moParticlesSimple* pParTmp = new moParticlesSimple();
            pParTmp->Pos3d = pPar->Pos3d;
            pParTmp->Velocity = pPar->Velocity;
            pParTmp->Mass = pPar->Mass;
            pParTmp->Force = pPar->Force;
            pParTmp->Fixed = pPar->Fixed;
            m_ParticlesSimpleArrayTmp.Set( i + j*p_cols, pParTmp );

        }
    }

    m_rows = p_rows;
    m_cols = p_cols;
*/
}

/// Mata y regenera particulas, tambien las actualiza....
Regenerate() : void {
/*
    int i,j;
    float randommotionx,randommotiony,randommotionz;
    long LastImageIndex = -1;

    long emitiontimer_duration = m_Physics.EmitionTimer.Duration();
    //MODebug2->Message("dur:"+IntToStr(emitiontimer_duration));

    //Reset EmitionTimer if out-of-timeline
    if (emitiontimer_duration<0)
        m_Physics.EmitionTimer.Start();


    for( j=0; j<m_rows ; j++) {
      for( i=0; i<m_cols ; i++) {


            moParticlesSimple* pPar = m_ParticlesSimpleArray[i+j*m_cols];

            pPar->pTextureMemory = NULL;

            // Reset/Kill out-of-timeline particle....
            // Make particle die if particle Age is out of sync with moGetTicks absolute time (kind of reset the particles)
            if (pPar->Age.Duration() > moGetTicks() ) {
                pPar->Age.Stop();
                pPar->Visible = false;
                pPar->MOId = -1; //reseteamos la textura asociada
                if (pPar->pTextureMemory) {
                    pPar->pTextureMemory->ReleaseReference();
                    pPar->pTextureMemory = NULL;
                    pPar->GLId = 0;
                }
            }


            //KILL PARTICLE

            // Reset/Kill particle if Age > MaxAge , if MaxAge is 0, never die!!!
            if ( pPar->Visible) {
                if (
                        (
                                (m_Physics.m_MaxAge>0) &&
                                (pPar->Age.Duration() > m_Physics.m_MaxAge)
                         )
                        ||
                        (
                                (pPar->MaxAge>0) &&
                               (pPar->Age.Duration() > pPar->MaxAge)
                        )
                    ) {

                    pPar->Age.Stop();
                    pPar->Visible = false;
                    pPar->MOId = -1; //reseteamos la textura asociada

                    // Update rate ??...
                    if (m_Rate>0) m_Rate--;

                    if (pPar->pTextureMemory) {
                        pPar->pTextureMemory->ReleaseReference();
                        pPar->pTextureMemory = NULL;
                        pPar->GLId = 0;
                    }

                }
            }

            //REBORN PARTICLE
            //m_Physics.EmitionTimer.Duration()
            //MODebug2->Message("dur:"+IntToStr(emitiontimer_duration)+" vs:"+IntToStr(m_Physics.m_EmitionPeriod) );


            // Rate is actual particle# emitted in this EmitionPeriod
            if ( m_Rate<m_Physics.m_EmitionRate &&
                (m_Physics.EmitionTimer.Duration() > m_Physics.m_EmitionPeriod)
                && pPar->Visible==false ) {

                bool letsborn = true;
                int id_last_particle = 0;
                int this_id_particle = 0;

                if (m_Physics.m_CreationMethod==PARTICLES_CREATIONMETHOD_LINEAR ) {
                  //in linear creation method, need to track the last particle born, just to maintain linearity
                  if (m_Physics.m_pLastBordParticle)
                    id_last_particle = m_Physics.m_pLastBordParticle->Pos.X() + m_Physics.m_pLastBordParticle->Pos.Y()*m_cols;
                  else id_last_particle = -1;

                  this_id_particle = i+j*m_cols;

                  if ( //last born was last in array
                  id_last_particle==(m_rows*m_cols-1)
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

                //m_Physics.EmitionTimer.Start();
                if (letsborn) {
                  pPar->Visible = true;
                  pPar->Age.Start();

                  //guardamos la referencia a esta particula, que servira para la proxima
                  if (m_Physics.m_pLastBordParticle) {
                    //guardamos la referencia del imageindex de la ultima particula (para mantener el orden en MANYBYORDER)
                    LastImageIndex = m_Physics.m_pLastBordParticle->ImageIndex;
                  }
                  m_Physics.m_pLastBordParticle = pPar;

                  //Update the rate counter
                  m_Rate++;

                  //Sets the particle position
                  SetParticlePosition( pPar );
                  //MODebug2->Message("frame:"+IntToStr(frame) );
                  //MODebug2->Message("i:"+IntToStr(i) );
                  //MODebug2->Message("j:"+IntToStr(j) );
                  //MODebug2->Message("px:"+FloatToStr(pPar->Pos3d.X()) );
                  //MODebug2->Message("py:"+FloatToStr(pPar->Pos3d.Y()) );


                   //SPECIAL CASE for texture folders
                   ///asigna un id al azar!!!! de todos los que componen el moTextureBuffer
                   ///hay q pedir el moTextureBuffer
                   if ( texture_mode==PARTICLES_TEXTUREMODE_MANY || texture_mode==PARTICLES_TEXTUREMODE_MANYBYORDER ) {
                       moTextureBuffer* pTexBuf = m_Config[ moR(PARTICLES_FOLDERS) ][MO_SELECTED][0].TextureBuffer();
                       //m_Config[moR(PARTICLES_TEXTURE)].GetData()->GetGLId(&m_EffectState.tempo, 1, NULL );
                       if (pTexBuf) {
                           int nim = pTexBuf->GetImagesProcessed();
                           //MODebug2->Push( "nim: " + IntToStr(nim) );

                           pPar->ImageProportion = 1.0;

                           if (nim>0) {

                               float frandom = moMathf::UnitRandom() * nim;

                               //MODebug2->Push( "frandom: " + FloatToStr(frandom) );

                               //int irandom = ( ::rand() * nim )/ RAND_MAX;
                               int irandom = (int)frandom;
                               if (irandom>=nim) irandom = nim - 1;//last one repeated if out of bound

                               if (texture_mode==PARTICLES_TEXTUREMODE_MANYBYORDER) {
                                irandom = LastImageIndex+1;
                                if (irandom>=nim) irandom = 0;
                               }

                               LastImageIndex = irandom;
                               pPar->ImageIndex = LastImageIndex;

                               //MODebug2->Push( "irandom: " + IntToStr(irandom) + " rand: " + IntToStr(::rand()) );

                               pPar->GLId = pTexBuf->GetFrame( irandom );

                               moTextureMemory* pTexMem = pTexBuf->GetTexture( irandom );
                               if (pTexMem) {
                                  pPar->pTextureMemory = pTexMem;
                                  if (pTexMem->GetHeight()>0)
                                  pPar->ImageProportion = (float) pTexMem->GetWidth() / (float) pTexMem->GetHeight();
                                }

                               ///MODebug2->Push( moText("creating particle: irandom:")
                               // + IntToStr(irandom) + moText(" count:")
                               // + IntToStr(pTexBuf->GetImagesProcessed()) + moText(" glid:") + IntToStr(pPar->GLId) );


                           } else {
                               ///pPar->GLId = 0;
                           }
                           pPar->TCoord = moVector2f( 0.0, 0.0 );
                           pPar->TSize = moVector2f( 1.0f, 1.0f );

                       } else MODebug2->Error( moText("PARTICLES_TEXTUREMODE_MANY particles error creating texture") );
                   }

                } ///fin letsborn

            }

            // Ok, check if EmitionRate is reached
            if (m_Rate>=m_Physics.m_EmitionRate) {
                //reset timer
                m_Physics.EmitionTimer.Start();
                m_Rate = 0;
            }

            //FADEIN
            if ( pPar->Visible && m_Physics.m_FadeIn>0.0) {
                //must be in lifetime range
                if ( m_Physics.m_MaxAge>0 &&  pPar->Age.Duration() < m_Physics.m_MaxAge  ) {
                    //only apply in the first half-lifetime lapsus
                    if ( pPar->Age.Duration() < ( m_Physics.m_FadeIn * m_Physics.m_MaxAge / 2.0 ) ) {

                        pPar->Alpha = ( 2.0 * pPar->Age.Duration() / ( m_Physics.m_FadeIn * m_Physics.m_MaxAge ) );

                    } else pPar->Alpha = 1.0 ;
                } else if ( m_Physics.m_MaxAge==0) {
                    //proportional to particle Age (in seconds) 1 second life = 100% opacity
                    pPar->Alpha = m_Physics.m_FadeIn * pPar->Age.Duration() / 1000.0;
                }
            }

            //FADEOUT
            if ( pPar->Visible && m_Physics.m_FadeOut>0.0) {
                //must be in lifetime range
                if ( m_Physics.m_MaxAge>0 && (pPar->Age.Duration() < m_Physics.m_MaxAge) ) {
                    //only apply in the last half-lifetime lapsus
                    if ( (m_Physics.m_MaxAge/2.0) < pPar->Age.Duration() ) {
                        if (  (m_Physics.m_FadeOut*m_Physics.m_MaxAge / 2.0) > (m_Physics.m_MaxAge - pPar->Age.Duration()) ) {

                            pPar->Alpha = ( m_Physics.m_MaxAge - pPar->Age.Duration() ) / (m_Physics.m_FadeOut *m_Physics.m_MaxAge / 2.0);

                        }
                    }
                }

            }

            //SIZEIN
            if ( pPar->Visible && m_Physics.m_SizeIn>0.0
                    && (m_Physics.m_MaxAge>0) &&  (pPar->Age.Duration() < m_Physics.m_MaxAge) ) {

                if ( pPar->Age.Duration() < ( m_Physics.m_SizeIn * m_Physics.m_MaxAge / 2.0 )) {

                    pPar->Scale = ( 2.0 * pPar->Age.Duration() / ( m_Physics.m_SizeIn * m_Physics.m_MaxAge ) );

                } else pPar->Scale = 1.0 ;


            }


            //SIZEOUT
            if ( pPar->Visible && m_Physics.m_SizeOut>0.0 && (m_Physics.m_MaxAge>0)
                && ( (m_Physics.m_MaxAge/2.0) < pPar->Age.Duration() ) && (pPar->Age.Duration() < m_Physics.m_MaxAge) ) {

                if (  (m_Physics.m_SizeOut*m_Physics.m_MaxAge / 2.0) > (m_Physics.m_MaxAge
                - pPar->Age.Duration()) && pPar->Age.Duration() < m_Physics.m_MaxAge ) {

                    pPar->Scale = ( m_Physics.m_MaxAge - pPar->Age.Duration() ) / (m_Physics.m_SizeOut *m_Physics.m_MaxAge / 2.0);

                }


            }

            if ( pPar->Visible ) {

                randommotionx = (m_Physics.m_RandomMotion>0)?
                (0.5-moMathf::UnitRandom())*m_Physics.m_MotionVector.X() : m_Physics.m_MotionVector.X();
                randommotiony = (m_Physics.m_RandomMotion>0)?
                (0.5-moMathf::UnitRandom())*m_Physics.m_MotionVector.Y() : m_Physics.m_MotionVector.Y();
                randommotionz = (m_Physics.m_RandomMotion>0)?
                (0.5-moMathf::UnitRandom())*m_Physics.m_MotionVector.Z() : m_Physics.m_MotionVector.Z();

                m_Physics.m_MotionVector.Normalize();
                if ( m_Physics.m_MotionVector.Length() > 0.0 ) {
                    if (m_Physics.m_RandomMotion>0.0) {
                        pPar->Velocity+= moVector3f( randommotionx, randommotiony, randommotionz ) * m_Physics.m_RandomMotion;
                    }
                }

            }




        }
    }
    */
}


DrawParticlesSimple( tempogral : MO.moTempo , parentstate : MO.moEffectState  ) : void {
/*
    int i,j;
    int cols2,rows2;




    //if ((moGetTicks() % 1000) == 0) TrackParticle(1);

    cols2 = m_Config.Int( moR(PARTICLES_WIDTH));
    rows2 = m_Config.Int( moR(PARTICLES_HEIGHT) );

    if (cols2!=m_cols || rows2!=m_rows) {
        InitParticlesSimple(cols2,rows2);
    }

    /// TODO: what is this???? gross bug
     gral_ticks  = tempogral->ticks;



    if (!m_Physics.EmitionTimer.Started())
        m_Physics.EmitionTimer.Start();



    //glBindTexture( GL_TEXTURE_2D, 0 );
    if ( texture_mode!=PARTICLES_TEXTUREMODE_MANY && texture_mode!=PARTICLES_TEXTUREMODE_MANY2PATCH ) {
        //glBindTexture( GL_TEXTURE_2D, 0 );
        if (glid>=0) glBindTexture( GL_TEXTURE_2D, glid );
        else glBindTexture( GL_TEXTURE_2D, 0);
    }
    //glColor4f(1.0,1.0,1.0,1.0);
    //glDisable( GL_CULL_FACE);
    //glDisable( GL_DEPTH_TEST);
    //glFrontFace( GL_CW);
    //glPolygonMode( GL_LINES, GL_FRONT_AND_BACK);

    //SetBlending( (moBlendingModes) m_Config[moR(PARTICLES_BLENDING)][MO_SELECTED][0].Int() );


    float sizexd2,sizeyd2;
    float tsizex,tsizey;

    moFont* pFont = m_Config[moR(PARTICLES_FONT) ][MO_SELECTED][0].Font();
    moText Texto;

    //Update particle position, velocity, aging, death and rebirth.
    UpdateParticles( dt, 0 ); //Euler mode
    OrderParticles();
    ParticlesSimpleAnimation( tempogral, parentstate );

    float idxt = 0.0;

    //Now really draw each particle
    int orderedindex = 0;
    for( j = 0; j<m_rows ; j++) {
      for( i = 0; i<m_cols ; i++) {

            idxt = 0.5 + (float)( i + j * m_cols ) / (float)( m_cols * m_rows * 2 );

            moParticlesSimple* pPar = m_ParticlesSimpleArray.GetRef( i + j*m_cols );

            switch(m_OrderingMode) {
              case PARTICLES_ORDERING_MODE_NONE:
                break;
              case PARTICLES_ORDERING_MODE_COMPLETE:
                {
                  pPar = m_ParticlesSimpleVector[ orderedindex ];
                  pPar->ViewDepth = CalculateViewDepth( pPar );
                }
                break;
              case PARTICLES_ORDERING_MODE_ZPOSITION:
                pPar = m_ParticlesSimpleVector[ orderedindex ];
                break;
              default:

                break;
            }

            orderedindex+= 1;
            double part_timer;
            if (pPar) {
              if (pPar->Visible) {


                  if (texture_mode==PARTICLES_TEXTUREMODE_MANY
                   || texture_mode==PARTICLES_TEXTUREMODE_MANYBYORDER
                  || texture_mode==PARTICLES_TEXTUREMODE_MANY2PATCH ) {
                      //pPar->GLId = 22;
                      if (pPar->GLId>0) {
                          glActiveTextureARB( GL_TEXTURE0_ARB );
                          glEnable(GL_TEXTURE_2D);
                          //glTexEnvi(GL_TEXTURE_ENV, GL_TEXTURE_ENV_MODE, GL_REPLACE);
                          glBindTexture( GL_TEXTURE_2D, pPar->GLId );
                      }
                      if (pPar->GLId2>0) {
                          glActiveTextureARB( GL_TEXTURE1_ARB );
                          glEnable(GL_TEXTURE_2D);
                          //glTexEnvi(GL_TEXTURE_ENV, GL_TEXTURE_ENV_MODE, GL_MODULATE);
                          glBindTexture( GL_TEXTURE_2D, pPar->GLId2 );
                      }
                  }

                  if (moScript::IsInitialized()) {
                      if (ScriptHasFunction("RunParticle")) {
                          SelectScriptFunction("RunParticle");
                          AddFunctionParam( (int) ( i + j*m_cols ) );
                          AddFunctionParam( (float)dt );
                          if (!RunSelectedFunction(1)) {
                              MODebug2->Error( moText("RunParticle function not executed") );
                          }
                      }
                  }

                  sizexd2 = (pPar->Size.X()* pPar->ImageProportion )/2.0;
                  sizeyd2 = pPar->Size.Y()/2.0;
                  tsizex = pPar->TSize.X();
                  tsizey = pPar->TSize.Y();
                  part_timer = 0.001f * (double)(pPar->Age.Duration()); // particule ang = durationinmilis / 1000 ...

                  if (m_pParticleTime) {
                    if (m_pParticleTime->GetData()) {
                        m_pParticleTime->GetData()->SetDouble(part_timer);
                        m_pParticleTime->Update(true);
                    }
                  }

                  if (m_pParticleIndex) {
                    if (m_pParticleIndex->GetData()) {
                        m_pParticleIndex->GetData()->SetLong( ((long)pPar->Pos.X()) + ((long)pPar->Pos.Y())*m_cols );
                        m_pParticleIndex->Update(true);
                    }
                  }

                  glPushMatrix();

                  moVector3f CO(m_Physics.m_EyeVector - pPar->Pos3d);
                  moVector3f U,V,W;
                  moVector3f CPU,CPW;
                  moVector3f A,B,C,D;

                  moVector3f CENTRO;

                  U = moVector3f( 0.0f, 0.0f, 1.0f );
                  V = moVector3f( 1.0f, 0.0f, 0.0f );
                  W = moVector3f( 0.0f, 1.0f, 0.0f );

                  U = CO;
                  U.Normalize();

                  //orientation always perpendicular to plane (X,Y)
                  switch(m_Physics.m_OrientationMode) {

                          case PARTICLES_ORIENTATIONMODE_FIXED:
                              //cuadrado centrado en Pos3d....
                              U = moVector3f( 0.0f, 0.0f, 1.0f );
                              V = moVector3f( 1.0f, 0.0f, 0.0f );
                              W = moVector3f( 0.0f, 1.0f, 0.0f );
                              break;

                          case PARTICLES_ORIENTATIONMODE_CAMERA:
                          // TODO: fix this
                              V = moVector3f( -CO.Y(), CO.X(), 0.0f );
                              V.Normalize();

                              CPU = moVector3f( U.X(), U.Y(), 0.0f );
                              W = moVector3f( 0.0f, 0.0f, CPU.Length() );
                              CPU.Normalize();
                              CPW = CPU * -U.Z();
                              W+= CPW;
                              break;

                          case PARTICLES_ORIENTATIONMODE_MOTION:
                          // TODO: fix this
                              if (pPar->Velocity.Length()>0) U = pPar->Velocity;
                              U.Normalize();
                              if (U.Length() < 0.5) {
                                  U = moVector3f( 0.0, 0.0, 1.0 );
                                  U.Normalize();
                              }
                              V = moVector3f( -U.Y(), U.X(), 0.0f );
                              V.Normalize();
                              CPU = moVector3f( U.X(), U.Y(), 0.0f );
                              W = moVector3f( 0.0f, 0.0f, CPU.Length() );
                              CPU.Normalize();
                              CPW = CPU * -U.Z();
                              W+= CPW;
                              break;
                  }

                  A = V * -sizexd2 + W * sizeyd2;
                  B = V *sizexd2 +  W * sizeyd2;
                  C = V *sizexd2 + W * -sizeyd2;
                  D = V * -sizexd2 + W * -sizeyd2;


                  //cuadrado centrado en Pos3d....

                  //TODO: dirty code here!!!
                  if (texture_mode==PARTICLES_TEXTUREMODE_UNIT || texture_mode==PARTICLES_TEXTUREMODE_PATCH) {

                      MOfloat cycleage = m_EffectState.tempo.ang;

                      //if (m_Physics.m_MaxAge>0) cycleage = (float) ((double)pPar->Age.Duration() /  (double)m_Physics.m_MaxAge );
                      cycleage = part_timer;

                      int glid = pPar->GLId;

                      if ( pPar->MOId==-1 ) {

                          glid = m_Config.GetGLId( moR(PARTICLES_TEXTURE), cycleage, 1.0, NULL );

                      } else {


                          if ( pPar->MOId>-1 ) {

                              moTexture* pTex = m_pResourceManager->GetTextureMan()->GetTexture(pPar->MOId);

                              if (pTex) {

                                  if (
                                      pTex->GetType()==MO_TYPE_VIDEOBUFFER
                                      || pTex->GetType()==MO_TYPE_CIRCULARVIDEOBUFFER
                                      || pTex->GetType()==MO_TYPE_MOVIE
                                      || pTex->GetType()==MO_TYPE_TEXTURE_MULTIPLE
                                       ) {
                                      moTextureAnimated *pTA = (moTextureAnimated*)pTex;

                                      if (pPar->FrameForced) {
                                          glid = pTA->GetGLId( pPar->ActualFrame );
                                      } else {
                                          glid = pTA->GetGLId((MOfloat)cycleage);
                                          pPar->ActualFrame = pTA->GetActualFrame();

                                          pPar->FramePS = pTA->GetFramesPerSecond();
                                          pPar->FrameCount = pTA->GetFrameCount();
                                      }

                                  } else {
                                      glid = pTex->GetGLId();
                                  }

                              }
                          }
                      }

                      glBindTexture( GL_TEXTURE_2D , glid );
                  }

                  glTranslatef( pPar->Pos3d.X(), pPar->Pos3d.Y(),  pPar->Pos3d.Z() );

                  glRotatef(  m_Config.Eval( moR(PARTICLES_ROTATEZ_PARTICLE) ) + pPar->Rotation.Z(), U.X(), U.Y(), U.Z() );
                  glRotatef(  m_Config.Eval( moR(PARTICLES_ROTATEY_PARTICLE) ) + pPar->Rotation.Y(), W.X(), W.Y(), W.Z() );
                  glRotatef(  m_Config.Eval( moR(PARTICLES_ROTATEX_PARTICLE) ) + pPar->Rotation.X(), V.X(), V.Y(), V.Z() );

                  //scale
                  glScalef(   m_Config.Eval( moR(PARTICLES_SCALEX_PARTICLE) )*pPar->Scale,
                              m_Config.Eval( moR(PARTICLES_SCALEY_PARTICLE) )*pPar->Scale,
                              m_Config.Eval( moR(PARTICLES_SCALEZ_PARTICLE) )*pPar->Scale);


                  glColor4f(  m_Config[moR(PARTICLES_COLOR)][MO_SELECTED][MO_RED].Eval() * pPar->Color.X() * m_EffectState.tintr,
                              m_Config[moR(PARTICLES_COLOR)][MO_SELECTED][MO_GREEN].Eval() * pPar->Color.Y() * m_EffectState.tintg,
                              m_Config[moR(PARTICLES_COLOR)][MO_SELECTED][MO_BLUE].Eval() * pPar->Color.Z() * m_EffectState.tintb,
                              m_Config[moR(PARTICLES_COLOR)][MO_SELECTED][MO_ALPHA].Eval()
                              * m_Config.Eval( moR(PARTICLES_ALPHA))
                              * m_EffectState.alpha * pPar->Alpha );

                  glBegin(GL_QUADS);
                      //glColor4f( 1.0, 0.5, 0.5, idxt );

                      if (pPar->GLId2>0) {
                          //glColor4f( 1.0, 0.5, 0.5, idxt );
                          glMultiTexCoord2fARB( GL_TEXTURE0_ARB, pPar->TCoord.X(), pPar->TCoord.Y() );
                          glMultiTexCoord2fARB( GL_TEXTURE1_ARB, pPar->TCoord2.X(), pPar->TCoord2.Y());
                      } else glTexCoord2f( pPar->TCoord.X(), pPar->TCoord.Y() );
                      glNormal3f( -U.X(), -U.Y(), -U.Z() );
                      glVertex3f( A.X(), A.Y(), A.Z());

                      //glColor4f( 0.5, 1.0, 0.5, idxt );

                      if (pPar->GLId2>0) {
                          glMultiTexCoord2fARB( GL_TEXTURE0_ARB, pPar->TCoord.X()+tsizex, pPar->TCoord.Y() );
                          glMultiTexCoord2fARB( GL_TEXTURE1_ARB, pPar->TCoord2.X()+pPar->TSize2.X(), pPar->TCoord2.Y());
                      } else glTexCoord2f( pPar->TCoord.X()+tsizex, pPar->TCoord.Y() );
                      glNormal3f( -U.X(), -U.Y(), -U.Z() );
                      glVertex3f( B.X(), B.Y(), B.Z());

                      //glColor4f( 0.5, 0.5, 1.0, idxt );
                      if (pPar->GLId2>0) {
                          glMultiTexCoord2fARB( GL_TEXTURE0_ARB, pPar->TCoord.X()+tsizex, pPar->TCoord.Y()+tsizey );
                          glMultiTexCoord2fARB( GL_TEXTURE1_ARB, pPar->TCoord2.X()+pPar->TSize2.X(), pPar->TCoord2.Y()+pPar->TSize2.Y());
                      } else glTexCoord2f( pPar->TCoord.X()+tsizex, pPar->TCoord.Y()+tsizey );
                      glNormal3f( -U.X(), -U.Y(), -U.Z() );
                      glVertex3f( C.X(), C.Y(), C.Z());

                      //glColor4f( 1.0, 1.0, 1.0, idxt );
                      if (pPar->GLId2>0) {
                          glMultiTexCoord2fARB( GL_TEXTURE0_ARB, pPar->TCoord.X(), pPar->TCoord.Y()+pPar->TSize.Y());
                          glMultiTexCoord2fARB( GL_TEXTURE1_ARB, pPar->TCoord2.X(), pPar->TCoord2.Y()+pPar->TSize2.Y());
                      } else glTexCoord2f( pPar->TCoord.X(), pPar->TCoord.Y()+tsizey );
                      glNormal3f( -U.X(), -U.Y(), -U.Z() );
                      glVertex3f( D.X(), D.Y(), D.Z());
                  glEnd();

                  //draw vectors associated...
                  if ( drawing_features>2 ) {
                      CENTRO = moVector3f( 0.0 , 0.0, 0.0 );

                      glDisable( GL_TEXTURE_2D );
                      glLineWidth( 8.0 );
                      glBegin(GL_LINES);
                          ///draw U
                          glColor4f( 0.0, 1.0, 1.0, 1.0);
                          glVertex3f( CENTRO.X(), CENTRO.Y(), 0.0001);

                          glColor4f( 0.0, 1.0, 1.0, 1.0);
                          glVertex3f( CENTRO.X() + U.X(), CENTRO.Y() + U.Y(), 0.0001);

                      glEnd();

                      glBegin(GL_LINES);
                          ///draw V
                          glColor4f( 1.0, 0.0, 1.0, 1.0);
                          glVertex3f( CENTRO.X(), CENTRO.Y(), 0.0001);

                          glColor4f( 1.0, 0.0, 1.0, 1.0);
                          glVertex3f( CENTRO.X() + V.X(), CENTRO.Y() + V.Y(), 0.0001);

                      glEnd();

                      glBegin(GL_LINES);
                          ///draw W
                          glColor4f( 0.0, 0.0, 1.0, 1.0);
                          glVertex3f( CENTRO.X(), CENTRO.Y(), 0.0001);

                          glColor4f( 0.0, 0.0, 1.0, 1.0);
                          glVertex3f( CENTRO.X() + W.X(), CENTRO.Y() + W.Y(), 0.0001);

                      glEnd();
                      glEnable( GL_TEXTURE_2D );
                  }


                  glPopMatrix();
              }

            }
        }
    }

    if (pFont && drawing_features>2) {
        for( i = 0; i<m_cols ; i++) {
            for( j = 0; j<m_rows ; j++) {

                moParticlesSimple* pPar = m_ParticlesSimpleArray.GetRef( i + j*m_cols );
                if ((i + j*m_cols) % 10 == 0 ) {
                    Texto = moText( IntToStr(i + j*m_cols));
                    Texto.Left(5);
                    Texto+= moText("F:")+moText( (moText)FloatToStr( pPar->Force.X() ).Left(5) + moText(",")
                                + (moText)FloatToStr( pPar->Force.Y() ).Left(5)
                                + moText(",") + (moText)FloatToStr( pPar->Force.Z() ).Left(5) );

                    Texto+= moText("V:")+ moText( (moText)FloatToStr( pPar->Velocity.X() ).Left(5) + moText(",")
                                + (moText)FloatToStr( pPar->Velocity.Y() ).Left(5)
                                + moText(",") + (moText)FloatToStr( pPar->Velocity.Z() ).Left(5) );

                    pFont->Draw( pPar->Pos3d.X(),
                                 pPar->Pos3d.Y(),
                                 Texto );


                    Texto = moText( moText("(") + (moText)FloatToStr(pPar->TCoord.X()).Left(4)
                    + moText(",") + (moText)FloatToStr(pPar->TCoord.Y()).Left(4) + moText(")") );

                    pFont->Draw( pPar->Pos3d.X()-sizexd2,
                                 pPar->Pos3d.Y()+sizeyd2-2,
                                 Texto );

                    Texto = moText( moText("(") + (moText)FloatToStr(pPar->TCoord.X()+tsizex).Left(4)
                    + moText(",") + (moText)FloatToStr(pPar->TCoord.Y()).Left(4) + moText(")"));

                    pFont->Draw( pPar->Pos3d.X()+sizexd2-12,
                                 pPar->Pos3d.Y()+sizeyd2-5,
                                 Texto );

                    Texto = moText( moText("(") + (moText)FloatToStr(pPar->TCoord.X()+tsizex).Left(4)
                    + moText(",") + (moText)FloatToStr(pPar->TCoord.Y()+tsizey).Left(4) + moText(")"));

                    pFont->Draw( pPar->Pos3d.X()+sizexd2-12,
                                 pPar->Pos3d.Y()-sizeyd2+2,
                                 Texto );

                    Texto = moText( moText("(") + (moText)FloatToStr(pPar->TCoord.X()).Left(4)
                    + moText(",") + (moText)FloatToStr(pPar->TCoord.Y()+tsizey).Left(4) + moText(")"));

                    pFont->Draw( pPar->Pos3d.X()-sizexd2,
                                 pPar->Pos3d.Y()-sizeyd2+5,
                                 Texto );
                }

            }
        }
    }

    if (pFont && drawing_features>2) {

                Texto = moText( moText("T2 Rest.:") + IntToStr(TimerFullRestoration.Duration()));
                pFont->Draw( -10.0f,
                             0.0f,
                             Texto );

                Texto = moText( moText("T2 Revel.:") + IntToStr(TimerFullRevelation.Duration()));
                pFont->Draw( -10.0f,
                             3.0f,
                             Texto );

                Texto = moText( moText("T Revel.:") + IntToStr(TimerOfRevelation.Duration())
                + moText(" rev: ") + IntToStr(time_of_revelation));
                pFont->Draw( -10.0f,
                             6.0f,
                             Texto );

                Texto = moText( moText("T Rest.:") + IntToStr(TimerOfRestoration.Duration())
                + moText(" res: ") + IntToStr(time_of_restoration) );
                pFont->Draw( -10.0f,
                             9.0f,
                             Texto );

                Texto = moText("Status: ");

                switch(revelation_status) {
                    case PARTICLES_FULLRESTORED:
                        Texto+= moText("Full Restored");
                        break;
                    case PARTICLES_REVEALING:
                        Texto+= moText("Revealing");
                        break;
                    case PARTICLES_REVEALINGALL:
                        Texto+= moText("Revealing");
                        break;
                    case PARTICLES_FULLREVEALED:
                        Texto+= moText("Full Revealed");
                        break;
                    case PARTICLES_RESTORING:
                        Texto+= moText("Restoring");
                        break;
                    case PARTICLES_RESTORINGALL:
                        Texto+= moText("Restoring All");
                        break;
                }
                pFont->Draw( -10.0f,
                             13.0f,
                             Texto );
    }
*/
}


  Draw( p_tempo : MO.moTempo ) : void {
    this.BeginDraw(p_tempo);


    if (this.RM == undefined) return;

    var rgb: any = this.m_Config.EvalColor("color");
    var ccolor: MO.moColor = new MO.moColor( rgb.r, rgb.g, rgb.b);
    //console.log("ccolor:", rgb.r,rgb.g,rgb.b);
    console.log("emittertype:",this.m_Config.Int("emittertype"));
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
      this.Mat.opacity = this.m_Config.Eval("alpha");
    }

    //Mat2.m_MapGLId = Mat2.m_Map->GetGLId();
    //Mat2.m_Color = moColor(1.0, 1.0, 1.0);
    //Mat2.m_vLight = moVector3f( -1.0, -1.0, -1.0 );
    //Mat2.m_vLight.Normalize();

    ///MESH GEOMETRY
    if (this.Plane == undefined) {
      this.Plane = new MO.moPlaneGeometry(
        1.0,//this.m_Config.Eval("width"),
        1.0,//this.m_Config.Eval("height"),
        1, 1);
    }
    if (this.Plane) {
      /*
      if (this.Plane.m_Width != this.m_Config.Eval("width")
        || this.Plane.m_Height != this.m_Config.Eval("height")) {
        Object.assign(this.Plane, new MO.moPlaneGeometry(
        1.0,//this.m_Config.Eval("width"),
        1.0,//this.m_Config.Eval("height"),
        1, 1));
      }
*/
      this.Plane.colors = [ccolor, ccolor, ccolor, ccolor];
      this.Plane.colorsNeedUpdate = true;
    }

    ///MESH MODEL
    if (this.Model==undefined)
      this.Model = new MO.moGLMatrixf().MakeIdentity();

    if (this.Model) {

      this.Model.Scale(this.m_Config.Eval("scalex"),
        this.m_Config.Eval("scaley"),
        this.m_Config.Eval("scalez"));
      this.Model.Rotate(this.m_Config.Eval("rotatez") * MO.DEG_TO_RAD,
        0.0, 0.0, 1.0);
      this.Model.Rotate(this.m_Config.Eval("rotatey") * MO.DEG_TO_RAD,
        0.0, 1.0, 0.0);
      this.Model.Rotate(this.m_Config.Eval("rotatex") * MO.DEG_TO_RAD,
        1.0, 0.0, 0.0);

      this.Model.Translate(
          this.m_Config.Eval("translatex"),
          this.m_Config.Eval("translatey"),
          this.m_Config.Eval("translatez"));

    }

    if (this.Mesh==undefined) {
      this.Mesh = new MO.moMesh( this.Plane, this.Mat );
    }
    if (this.Mesh && this.Model) {
      this.Mesh.SetModelMatrix(this.Model);
    }

    if (this.Scene==undefined) {
      this.Scene = new MO.moSceneNode();
      this.Scene.add(this.Mesh);
    }


    ///CAMERA PERSPECTIVE
    if (this.Camera==undefined)
      this.Camera = new MO.moCamera3D();
      this.Camera.frustumCulled = true;
      this.Camera.castShadow = false;

    this.GL.SetDefaultPerspectiveView(
      this.RM.m_Renderer.getSize().width,
      this.RM.m_Renderer.getSize().height);

    this.Camera.projectionMatrix = this.GL.GetProjectionMatrix();

    this.DrawParticlesSimple( p_tempo, this.m_EffectState /*, parentstate*/ );

    ///RENDERING
    this.RM.Render( this.Scene, this.Camera);
    //console.log("moEffectImage.Draw", this.Scene, this.Camera, this.Mat.map );


    //this.RM.m_Renderer.setClearColor( ccolor, 1.0);
    //this.RM.m_Renderer.clear(true, true, false);

    this.EndDraw();

  }

  Update( p_Event: MO.moEventList ) : void {
    super.Update(p_Event);
  }

  GetDefinition(): MO.moConfigDefinition {
    var p_cdef = super.GetDefinition();

    p_cdef.Add("particlecolor", moParamType.MO_PARAM_COLOR, PAR.PARTICLES_PARTICLECOLOR);

    return this.m_Config.GetConfigDefinition();
  }

}
