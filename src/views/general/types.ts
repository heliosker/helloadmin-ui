import { Response } from 'types/global'

export interface GetConfig extends Response {
    code: number
    data: {
        module: string,
        remark: string,
        key: string,
        value: any
    }
}

export interface AddConfig extends Response {
    code: number
    data: {
        key: string,
        value: string,
        title: string,
        tip: any,
        module_id: number
    }
}
export interface ModuleInfo {
    key: string,
    label: string
}
export interface ModuleConfig extends Response {
    code: number
    data: Array<ModuleInfo>
}
export interface EditConfig extends Response {
    code: number
    data: Array<ModuleInfo>
}
export interface AddModule extends Response {
    code: number
    data: object
}
export interface Param {
    key: string,
    value: string,
    title: string,
    tip: string,
    module_id: number
}
export module API {
    export type _GetConfig = (param?: any) => Promise<GetConfig>
    export type _updateConfig = (param?: any) => Promise<GetConfig>
    export type _AddConfig = (data: Param) => Promise<AddConfig>
    export type _ModuleData = (param?: any) => Promise<ModuleConfig>
    export type _editConfig = (data?: any) => Promise<EditConfig>
    export type _AddModule = (data?: any) => Promise<AddModule>
}
