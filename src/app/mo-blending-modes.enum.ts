export enum moBlendingModes {
   MO_BLENDING_TRANSPARENCY = 0, /// transparencia
   MO_BLENDING_ADDITIVEALPHA = 1, /// aditivo seg�n transparencia
   MO_BLENDING_MIXING = 2, /// mezcla
   MO_BLENDING_MULTIPLY = 3, /// multipliaci�n
   MO_BLENDING_EXCLUSION = 4, /// exclusi�n
   MO_BLENDING_ADDITIVE = 5, /// aditivo por color
   MO_BLENDING_OVERLAY = 6, /// sobrecarga
   MO_BLENDING_SUBSTRACTIVE = 7, /// sustracci�n
   MO_BLENDING_SATURATE = 8, /// saturaci�n
   MO_BLENDINGS = 9 /// cantidad de modos
};

export const moBlendingModesStr = {
  "transparency": moBlendingModes.MO_BLENDING_TRANSPARENCY,//0
  "additivealpha": moBlendingModes.MO_BLENDING_ADDITIVEALPHA,//1
  "mixing": moBlendingModes.MO_BLENDING_MIXING,//2
  "multiply": moBlendingModes.MO_BLENDING_MULTIPLY,//3
  "exclusion": moBlendingModes.MO_BLENDING_EXCLUSION,//4
  "additive": moBlendingModes.MO_BLENDING_ADDITIVE,//5
	"overlay": moBlendingModes.MO_BLENDING_OVERLAY,//6
	"substractive": moBlendingModes.MO_BLENDING_SUBSTRACTIVE,//7
	"saturate": moBlendingModes.MO_BLENDING_SATURATE,//8
};

export const moBlendingModesToText = [
  "transparency",//0
  "additivealpha",//1
  "mixing",//2
  "multiply",//3
  "exclusion",//4
  "additive",//5
  "overlay",//6
	"substractive",//7
	"saturate"//8
];
