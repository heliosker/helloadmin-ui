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
export interface UserInfo {
    id: number
    created_at: string
    updated_at: string
    email: string
    username: string
    avatar: string
    status: number
    password: string
    role_id: number
}
export interface EditUser {
    code?: number
    data: UserInfo
    message: string
}
export interface RoleInfo {
    name: string
}
export interface EditRole {
    code?: number
    data: RoleInfo
    message: string
}
export interface MenuInfo {
    id?: number
    name?: string
    label?: string
    icon?: string
    parent_id?: number
    children?: Array<any>
    path?: string
    redirect?: string
    show?: number
    sort?: number
    key?: number
    value?: string
    updated_at?: string
    created_at?: string
}
export interface MenuList {
    code?: number
    data: Array<MenuInfo>
    message: string
}
export interface EditMenu {
    code?: number
    data: MenuInfo
    message: string
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
    export type _EitUser = (param: string, data: any) => Promise<EditUser>
    export type _EditRole = (param: string, data: any) => Promise<EditRole>
    export type _MenuList = (data?: any) => Promise<MenuList>
    export type _EditMenu = (param: string, data?: any) => Promise<EditMenu>
}

export interface FormState {
    rememberMe: boolean;
    username: string;
    password: string;
    mobile: string;
    captcha: string;
}
