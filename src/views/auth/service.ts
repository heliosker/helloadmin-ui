import baseService from '@/utils/http/axios'
import { baseURL } from '@/utils/util'
import { API } from './types'
// 获取用户列表
export const getUserList: API._UserList = params => {
    const api = baseURL + `/v1/administrators`
    return baseService.get(api, { params })
}
// 添加用户
export const addUser: API._editUser = data => {
    const api = baseURL + `/v1/administrators`
    return baseService.post(api, data)
}
// 编辑用户
export const editUser: API._editUser = (param, data) => {
    const api = baseURL + `/v1/administrators/` + param
    return baseService.put(api, data)
}
// 删除用户
export const deleteUser: API._editUser = (param) => {
    const api = baseURL + `/v1/administrators/` + param
    return baseService.delete(api)
}
export const getRoleList: API._RoleList = params => {
    const api = baseURL + `/v1/roles`
    return baseService.get(api, { params })
}
export const addRole: API._RoleList = data => {
    const api = baseURL + `/v1/roles`
    return baseService.post(api, data)
}
export const editRole: API._editRole = (param, data) => {
    const api = baseURL + `/v1/roles/` + param
    return baseService.put(api, data)
}
export const deleteRole: API._RoleList = param => {
    const api = baseURL + `/v1/roles/` + param
    return baseService.delete(api)
}
export const menuList: API._menuList = params => {
    const api = baseURL + `/v1/menus`
    return baseService.get(api, { params })
}
export const addMenu: API._menuList = data => {
    const api = baseURL + `/v1/menus`
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
    const api = baseURL + `auth/logout`
    return baseService.get(api)
}
export const upload: API._Logout = (data) => {
    const api = baseURL + `/v1/upload`
    return baseService.post(api, data)
}

export interface States {
    rememberMe: boolean;
    username: string;
    password: string;
    mobile: string;
    captcha: string;
}
