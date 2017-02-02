import {moText}from"./mo-text";
import { moMoldeoObjectType }from"./mo-moldeo-object";

export class moPluginDefinition {
    m_Name : moText;
    m_FullPath : moText;
    m_MoldeoObjectType : moMoldeoObjectType;
}
export type moPluginDefinitions = moPluginDefinition[];

export class moPlugin {
}
export type moPluginsArray = moPlugin[];

export class moPrePlugin {
}
export type moPrePluginsArray = moPrePlugin[];


export class moPostPlugin {
}
export type moPostPluginsArray = moPostPlugin[];


export class moMasterPlugin {
}
export type moMasterPluginsArray = moMasterPlugin[];

