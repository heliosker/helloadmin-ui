import baseService from '@/utils/http/axios'
import { baseURL } from '@/utils/util'
import { API } from './types'

export const getUserList: API._UserList = params => {
    const api = baseURL + `/v1/administrators`
    return baseService.get(api, { params })
}
export const getRoleList: API._RoleList = params => {
    const api = baseURL + `/v1/roles`
    return baseService.get(api, { params })
}

export const getSmsCaptcha: API._GetSmsCaptcha = data => {
    const api = baseURL + `account/sms`
    return baseService.post(api, data)
}

export const get2step: API._Get2Step = () => {
    const api = baseURL + `auth/2step-code`
    return baseService.get(api)
}

export const logout: API._Logout = () => {
    const api = baseURL + `auth/logout`
    return baseService.get(api)
}

export interface States {
    rememberMe: boolean;
    username: string;
    password: string;
    mobile: string;
    captcha: string;
}
