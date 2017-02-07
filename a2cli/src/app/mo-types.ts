export const MO_PI = 3.1415926535897932384626433832795;
export const MO_ON = 1;
export const MO_OFF = -1;
export const MO_ACTIVATED = 1;
export const MO_DEACTIVATED = -1;
export const MO_FALSE = 0;
export const MO_TRUE = 1;
export const MO_PRESSED = 1;
export const MO_PULSED = 1;
export const MO_RELEASED = 0;

export const MO_SUCCESS = 0;
export const MO_NOERROR = 0;
export const MO_ERROR = 65535;
export const MO_FAIL = 65535;
export const MO_UNDEFINED = -1;

export const MO_MAX_DEBUG = 4096;
export const MO_MAX_TEXTURAS = 512;
export const MO_MAX_MODELOS = 256;

export type MOboolean = boolean;
export type MOfloat = number;
export type MOdouble = number;
export type MOulong = number;
export type MOlong = number;
export type MOint = number;
export type MOuint = number;
export type MOchar = number;
export type MOuchar = number;
export type MOubyte = number;
export type MObyte = number;
export type MOswitch = number;
export type moNumber = number;

export type MO_DISPLAY = any;
export type MO_HANDLE = any;
export const NULL = null;

export class moTextFilterParam {


}

export function IntToStr( num : number, nzeros?: number ) : string
{
/*
    char buffer[100];
    moText pat = moText("%0") + IntToStr(nzeros) + moText("d");
    snprintf(buffer, 100, pat, a); // Memory-safe version of sprintf.

    moText str = buffer;
    return str;
*/
  var zero = nzeros - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}

