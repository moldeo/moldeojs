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

