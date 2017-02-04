export enum moMoldeoObjectType {
	MO_OBJECT_UNDEFINED = -1, /// Objeto indefinido
	MO_OBJECT_EFFECT = 0, /// Objeto dibujable, efecto ( efectos en el orden de dibujado )
	MO_OBJECT_PREEFFECT = 1,/// Objeto dibujable, pre-efecto ( primeros efectos en el orden de dibujado )
	MO_OBJECT_POSTEFFECT = 2,/// Objeto dibujable, post-efecto ( últímos efectos en el orden de dibujado )
	MO_OBJECT_MASTEREFFECT = 3,/// Objeto dibujable, efecto-maestro ( puede controlar otros efectos )
	MO_OBJECT_IODEVICE = 4,/// Dispositivo de entrada/salida
	MO_OBJECT_RESOURCE = 5,/// Recursos de datos, objetos, imágenes, videos y funcionalidades múltiples
	MO_OBJECT_CONSOLE = 6,/// Objeto principal de administración y dibujado de objetos de Moldeo
	MO_OBJECT_TYPES = 7 /// referencia para la cantidad de tipos de objetos
};

export const moMoldeoObjectTypeStr = [
  "effect",//0
  "preeffect",//1
  "posteffect",//2
  "mastereffect",//3
  "iodevice",//4
  "resource",//5
  "console"//6
];
