export enum moParamType {
	MO_PARAM_ALPHA=0,			///value type: NUM or FUNCTION
	MO_PARAM_COLOR=1,			///value type: NUM[4] or FUNCTION[4] or
	MO_PARAM_BLENDING=2,		///value type: NUM or TEXT (to script or shader for chroma???)
	MO_PARAM_POLYGONMODE=3,	///value type: NUM or TEXT ( 0:FILL 1:LINE 2:POINT)
	MO_PARAM_SYNC=4,			///value type: NUM or FUNCTION
	MO_PARAM_PHASE=5,			///value type: NUM or FUNCTION
	MO_PARAM_TEXT=6,			///value type: TXT or LNK
	MO_PARAM_TEXTURE=7,		///value type: TXT or LNK
	MO_PARAM_TEXTUREFOLDER=8,	///value type: TXT or LNK
	MO_PARAM_FONT=9,          ///value type: TXT or LNK
	MO_PARAM_3DMODEL=10,		///value type: TXT or LNK
	MO_PARAM_FILE=11,		    ///value type: TXT or LNK
	MO_PARAM_MOLDEO_OBJECT=12,		///value type: TXT or LNK, or XML
	MO_PARAM_OBJECT=13,		///value type: TXT or LNK, or XML
  MO_PARAM_VIDEO=14,			///value type: TXT or LNK
	MO_PARAM_SOUND=15,			///value type: TXT or LNK
	MO_PARAM_NUMERIC=16,		///value type: NUM
	MO_PARAM_FUNCTION=17,		///value type: NUM or FUNCTION
	MO_PARAM_TRANSLATEX=18,    ///value type: NUM or FUNCTION
	MO_PARAM_TRANSLATEY=19,    ///value type: NUM or FUNCTION
	MO_PARAM_TRANSLATEZ=20,    ///value type: NUM or FUNCTION
	MO_PARAM_SCALEX=21,		///value type: NUM or FUNCTION
	MO_PARAM_SCALEY=22,		///value type: NUM or FUNCTION
	MO_PARAM_SCALEZ=23,		///value type: NUM or FUNCTION
	MO_PARAM_ROTATEX=24,		///value type: NUM or FUNCTION
	MO_PARAM_ROTATEY=25,		///value type: NUM or FUNCTION
	MO_PARAM_ROTATEZ=26,		///value type: NUM or FUNCTION
	MO_PARAM_SCRIPT=27,		///value type: TXT or LNK
	MO_PARAM_FILTER=28,        ///value type: TXT or LNK
	MO_PARAM_COMPOSE=29,        ///any composition of types
	MO_PARAM_VECTOR=30,    ///vector of one type
	MO_PARAM_INLET=31,			///value type: TXT or LNK
	MO_PARAM_OUTLET=32,			///value type: TXT or LNK
	MO_PARAM_UNDEFINED = -1
};

export const moParamTypeStrs = {
  "ALPHA": moParamType.MO_PARAM_ALPHA,
  "COLOR": moParamType.MO_PARAM_COLOR,
  "BLENDING": moParamType.MO_PARAM_BLENDING,
  "POLYGONMODE": moParamType.MO_PARAM_POLYGONMODE,
  "SYNC": moParamType.MO_PARAM_SYNC,
  "PHASE": moParamType.MO_PARAM_PHASE,
  "TXT": moParamType.MO_PARAM_TEXT,
  "TEXT": moParamType.MO_PARAM_TEXT,
  "TEXTURE": moParamType.MO_PARAM_TEXTURE,
  "TEXTUREFOLDER": moParamType.MO_PARAM_TEXTUREFOLDER,
  "FONT": moParamType.MO_PARAM_FONT,
  "3DMODEL": moParamType.MO_PARAM_3DMODEL,
  "MOLDEOOBJECT": moParamType.MO_PARAM_MOLDEO_OBJECT,
  "OBJECT": moParamType.MO_PARAM_OBJECT,
  "VIDEO": moParamType.MO_PARAM_VIDEO,
  "FILTER": moParamType.MO_PARAM_FILTER,
  "SOUND": moParamType.MO_PARAM_SOUND,
  "NUM": moParamType.MO_PARAM_NUMERIC,
  "FUNCTION": moParamType.MO_PARAM_FUNCTION,
  "TRANSLATEX": moParamType.MO_PARAM_TRANSLATEX,
  "TRANSLATEY": moParamType.MO_PARAM_TRANSLATEY,
  "TRANSLATEZ": moParamType.MO_PARAM_TRANSLATEZ,
  "SCALEX": moParamType.MO_PARAM_SCALEX,
  "SCALEY": moParamType.MO_PARAM_SCALEY,
  "SCALEZ": moParamType.MO_PARAM_SCALEZ,
  "ROTATEX": moParamType.MO_PARAM_ROTATEX,
  "ROTATEY": moParamType.MO_PARAM_ROTATEY,
  "ROTATEZ": moParamType.MO_PARAM_ROTATEZ,
  "SCRIPT": moParamType.MO_PARAM_SCRIPT,
  "COMPOSE": moParamType.MO_PARAM_COMPOSE,
  "VECTOR": moParamType.MO_PARAM_VECTOR,
  "INLET": moParamType.MO_PARAM_INLET,
  "OUTLET": moParamType.MO_PARAM_OUTLET,
  "UNDEFINED": moParamType.MO_PARAM_UNDEFINED
};

export const moParamTypeToText = [
"ALPHA",
  "COLOR",
  "BLENDING",
  "POLYGONMODE",
  "SYNC",
  "PHASE",
  "TEXT",
  "TEXTURE",
  "TEXTUREFOLDER",
  "FONT",
  "3DMODEL",
  "MOLDEOOBJECT",
  "OBJECT",
  "VIDEO",
  "FILTER",
  "SOUND",
  "NUM",
  "FUNCTION",
  "TRANSLATEX",
  "TRANSLATEY",
  "TRANSLATEZ",
  "SCALEX",
  "SCALEY",
  "SCALEZ",
  "ROTATEX",
  "ROTATEY",
  "ROTATEZ",
  "SCRIPT",
  "COMPOSE",
  "VECTOR",
  "INLET",
  "OUTLET",
  "UNDEFINED"
];
