import baseService from '@/utils/http/axios'
import { baseURL } from '@/utils/util'
import { API } from './types'

export const login: API._Login = data => {
    const api = baseURL + `/v1/auth/login`
    return baseService.post(api, data)
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
    const api = baseURL + `/v1/auth/logout`
    return baseService.delete(api)
}
export interface States {
    rememberMe: boolean;
    username: string;
    password: string;
    mobile: string;
    captcha: string;
}

export interface States {
    rememberMe: boolean;
    username: string;
    password: string;
    mobile: string;
    captcha: string;
}
