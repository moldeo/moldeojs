export enum moDataType {
  MO_DATA_UNDEFINED=-1,
	MO_DATA_NUMBER,
	MO_DATA_NUMBER_CHAR,
	MO_DATA_NUMBER_INT,
	MO_DATA_NUMBER_LONG,
	MO_DATA_NUMBER_DOUBLE,
	MO_DATA_NUMBER_FLOAT,
	MO_DATA_NUMBER_MIDI,
	MO_DATA_FUNCTION,
	MO_DATA_POINTER,//may be a pointer to struct or to class
	MO_DATA_VECTOR2I,//array of values
	MO_DATA_VECTOR3I,//array of values
	MO_DATA_VECTOR4I,//array of values
	MO_DATA_VECTOR2F,//array of values
	MO_DATA_VECTOR3F,//array of values
	MO_DATA_VECTOR4F,//array of values
	MO_DATA_IMAGESAMPLE,//pointer to an imagesample pointer
	MO_DATA_IMAGESAMPLE_FILTERED,//pointer to a TextureFilter
  MO_DATA_IMAGESAMPLE_TEXTUREBUFFER,//pointer to a texturebuffer pointer
	MO_DATA_SOUNDSAMPLE,//pointer to a soundsample pointer
	MO_DATA_VIDEOSAMPLE,//pointer to a videosample pointer: video buffer
	MO_DATA_FONTPOINTER,
	MO_DATA_3DMODELPOINTER,
	MO_DATA_TEXT,//text,
	MO_DATA_MESSAGE,
	MO_DATA_MESSAGES
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
  "NUM",
  "CHAR",
  "INT",
  "LONG",
  "DOUBLE",
  "FLOAT",
  "MIDI",
  "FUNCTION",
  "DATA",//may be a pointer to struct or to class
  "VECTOR2I",//array of values
  "VECTOR3I",//array of values
  "VECTOR4I",//array of values
  "VECTOR2F",//array of values
  "VECTOR3F",//array of values
  "VECTOR4F",//array of values
  "IMAGE",//pointer to an imagesample pointer
  "IMAGESAMPLE",//pointer to an imagesample pointer
  "IMAGESAMPLE_FILTERED",//pointer to a TextureFilter
  "IMAGESAMPLE_TEXTUREBUFFER",//pointer to a texturebuffer pointer
  "SOUND",//pointer to a soundsample pointer
  "VIDEO",//pointer to a videosample pointer: video buffer
  "FONT",
  "3DMODEL",
  "TXT",//text,
  "MESSAGE",
  "MESSAGES"
];
