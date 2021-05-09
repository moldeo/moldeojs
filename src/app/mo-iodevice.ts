
import { moMoldeoObject } from "./mo-moldeo-object";
import { moMoldeoObjectType } from "./mo-moldeo-object-type.enum";


export class moIODevice extends moMoldeoObject {

	constructor() {
		super();
		//console.log("moIODevice::Constructor");
		this.SetType(moMoldeoObjectType.MO_OBJECT_IODEVICE);
	}

	Init(callback?:any): boolean {
		return super.Init(callback);
	}
}

export type moIODevices = moIODevice[];
export type moIODeviceArray = moIODevice[];
