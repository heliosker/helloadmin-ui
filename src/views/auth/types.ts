import { Response } from 'types/global'

// export interface Get2Step extends Response {
//     result: { stepCode: number }
// }
export interface Data {
    id: number;
    created_at: string;
    updated_at: string;
    email: string;
    username: string;
    avatar: string;
    status: number;
    password: string;
    role_id: number;
}
export interface RoleData {
    id: number;
    name: string;
    describe: string;
    created_at: string;
    updated_at: string;
}
export interface Pagination {
    page: number;
    size: number;
    count: number;
}
export interface UserList {
    code?: number
    data: Array<Data>
    message?: string
    details?: string[];
    meta: Pagination
}
export interface RoleList {
    code?: number
    data: Array<RoleData>
    message?: string
    details?: string[];
    meta: Pagination
}

export interface GetSmsCaptcha extends Response {
    result: { captcha: number }
}

export interface Logout extends Response {
    result: {}
}

export module API {
    export type _UserList = (data: any) => Promise<UserList>
    export type _RoleList = (data: any) => Promise<RoleList>
    export type _Logout = () => Promise<Logout>
}

export interface FormState {
    rememberMe: boolean;
    username: string;
    password: string;
    mobile: string;
    captcha: string;
}
