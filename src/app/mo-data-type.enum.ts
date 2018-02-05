export enum moDataType {
  MO_DATA_UNDEFINED=-1,
	MO_DATA_NUMBER=0,
	MO_DATA_NUMBER_CHAR=1,
	MO_DATA_NUMBER_INT=2,
	MO_DATA_NUMBER_LONG=3,
	MO_DATA_NUMBER_DOUBLE=4,
	MO_DATA_NUMBER_FLOAT=5,
	MO_DATA_NUMBER_MIDI=6,
	MO_DATA_FUNCTION=7,
	MO_DATA_POINTER=8,//may be a pointer to struct or to class
	MO_DATA_VECTOR2I=9,//array of values
	MO_DATA_VECTOR3I=10,//array of values
	MO_DATA_VECTOR4I=11,//array of values
	MO_DATA_VECTOR2F=12,//array of values
	MO_DATA_VECTOR3F=13,//array of values
	MO_DATA_VECTOR4F=14,//array of values
	MO_DATA_IMAGESAMPLE=15,//pointer to an imagesample pointer
	MO_DATA_IMAGESAMPLE_FILTERED=16,//pointer to a TextureFilter
  MO_DATA_IMAGESAMPLE_TEXTUREBUFFER=17,//pointer to a texturebuffer pointer
	MO_DATA_SOUNDSAMPLE=18,//pointer to a soundsample pointer
	MO_DATA_VIDEOSAMPLE=19,//pointer to a videosample pointer: video buffer
	MO_DATA_FONTPOINTER=20,
	MO_DATA_3DMODELPOINTER=21,
	MO_DATA_TEXT=22,//text,
	MO_DATA_MESSAGE=23,
	MO_DATA_MESSAGES=24
};

export const moDataTypeStr = {
  "UNDEFINED": moDataType.MO_DATA_UNDEFINED,
  "NUM": moDataType.MO_DATA_NUMBER,
  "CHAR": moDataType.MO_DATA_NUMBER_CHAR,
  "INT": moDataType.MO_DATA_NUMBER_INT,
  "LONG": moDataType.MO_DATA_NUMBER_LONG,
  "DOUBLE": moDataType.MO_DATA_NUMBER_DOUBLE,
  "FLOAT": moDataType.MO_DATA_NUMBER_FLOAT,
  "MIDI": moDataType.MO_DATA_NUMBER_MIDI,
  "FUNCTION": moDataType.MO_DATA_FUNCTION,
  "DATA": moDataType.MO_DATA_POINTER,//may be a pointer to struct or to class
  "POINTER": moDataType.MO_DATA_POINTER,//may be a pointer to struct or to class
  "VECTOR2I": moDataType.MO_DATA_VECTOR2I,//array of values
  "VECTOR3I": moDataType.MO_DATA_VECTOR3I,//array of values
  "VECTOR4I": moDataType.MO_DATA_VECTOR4I,//array of values
  "VECTOR2F": moDataType.MO_DATA_VECTOR2F,//array of values
  "VECTOR3F": moDataType.MO_DATA_VECTOR3F,//array of values
  "VECTOR4F": moDataType.MO_DATA_VECTOR4F,//array of values
  "IMAGE": moDataType.MO_DATA_IMAGESAMPLE,//pointer to an imagesample pointer
  "IMAGESAMPLE": moDataType.MO_DATA_IMAGESAMPLE,//pointer to an imagesample pointer
  "IMAGESAMPLE_FILTERED": moDataType.MO_DATA_IMAGESAMPLE_FILTERED,//pointer to a TextureFilter
  "IMAGESAMPLE_TEXTUREBUFFER": moDataType.MO_DATA_IMAGESAMPLE_TEXTUREBUFFER,//pointer to a texturebuffer pointer
  "SOUND": moDataType.MO_DATA_SOUNDSAMPLE,//pointer to a soundsample pointer
  "SOUNDSAMPLE": moDataType.MO_DATA_SOUNDSAMPLE,//pointer to a soundsample pointer
  "VIDEO": moDataType.MO_DATA_VIDEOSAMPLE,//pointer to a videosample pointer: video buffer
  "VIDEOSAMPLE": moDataType.MO_DATA_VIDEOSAMPLE,//pointer to a videosample pointer: video buffer
  "FONT": moDataType.MO_DATA_FONTPOINTER,
  "3DMODEL": moDataType.MO_DATA_3DMODELPOINTER,
  "TXT": moDataType.MO_DATA_TEXT,//text,
  "TEXT": moDataType.MO_DATA_TEXT,//text,
  "MESSAGE": moDataType.MO_DATA_MESSAGE,
  "MESSAGES": moDataType.MO_DATA_MESSAGES
};

export const moDataTypeToText = [
  "NUM",//0
  "CHAR",//1
  "INT",//2
  "LONG",//3
  "DOUBLE",//4
  "FLOAT",//5
  "MIDI",//6
  "FUNCTION",//7
  "DATA",//8 may be a pointer to struct or to class
  "VECTOR2I",//9 array of values
  "VECTOR3I",//10 array of values
  "VECTOR4I",//11 array of values
  "VECTOR2F",//12 array of values
  "VECTOR3F",//13 array of values
  "VECTOR4F",//14 array of values
  "IMAGE",//15 pointer to a teture => imagesample pointer
  "IMAGESAMPLE_FILTERED",//16 pointer to a TextureFilter
  "IMAGESAMPLE_TEXTUREBUFFER",//17 pointer to a texturebuffer pointer
  "SOUND",//18 pointer to a soundsample pointer
  "VIDEO",//19 pointer to a videosample pointer: video buffer
  "FONT",//20
  "3DMODEL",//21
  "TXT",//22 text,
  "MESSAGE",//23
  "MESSAGES" //24
];
