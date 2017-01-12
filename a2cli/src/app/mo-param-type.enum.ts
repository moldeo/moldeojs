export enum moParamType {
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
