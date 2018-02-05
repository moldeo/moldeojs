export enum moParamType {
	MO_PARAM_ALPHA=0,			///value type: NUM or FUNCTION
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

export const moParamTypeStrs = {
  "ALPHA": moParamType.MO_PARAM_ALPHA,
  "COLOR": moParamType.MO_PARAM_COLOR,
  "BLENDING": moParamType.MO_PARAM_BLENDING,
  "POLYGONMODE": moParamType.MO_PARAM_POLYGONMODE,
  "SYNC": moParamType.MO_PARAM_SYNC,
  "PHASE": moParamType.MO_PARAM_PHASE,
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
