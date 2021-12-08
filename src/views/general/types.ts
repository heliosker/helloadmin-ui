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

export module API {
    export type _GetConfig = (param?: any) => Promise<GetConfig>
    export type _updateConfig = (param?: any) => Promise<GetConfig>
}
