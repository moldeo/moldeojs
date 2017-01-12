
import { MOint, MOuint, MOboolean, MOfloat, MOdouble, MOlong, MOulong, moNumber, moTextFilterParam } from "./mo-types";
import { moText } from "./mo-text";
import { moAbstract } from "./mo-abstract";
import { moParam, moParams, moParamIndexes, moParamDefinitions } from "./mo-param";
import { moPreconfig, moPreConfigs } from "./mo-pre-config";


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
