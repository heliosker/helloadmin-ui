import baseService from '@/utils/http/axios'
import { baseURL } from '@/utils/util'
import { API } from './types'
// 获取用户列表
export const getUserList: API._UserList = params => {
    const api = baseURL + `/v1/administrators`
    return baseService.get(api, { params })
}
// 添加用户
export const addUser: API._EditUser = data => {
    const api = baseURL + `/v1/administrators`
    return baseService.post(api, data)
}
// 编辑用户
export const editUser: API._EditUser = (param, data) => {
    const api = baseURL + `/v1/administrators/` + param
    return baseService.put(api, data)
}
// 删除用户
export const deleteUser: API._EditUser = (param) => {
    const api = baseURL + `/v1/administrators/` + param
    return baseService.delete(api)
}
// 角色列表
export const getRoleList: API._RoleList = params => {
    const api = baseURL + `/v1/roles`
    return baseService.get(api, { params })
}
export const addRole: API._RoleList = data => {
    const api = baseURL + `/v1/roles`
    return baseService.post(api, data)
}
// 编辑角色
export const editRole: API._EditRole = (param, data) => {
    const api = baseURL + `/v1/roles/` + param
    return baseService.put(api, data)
}
// 删除角色
export const deleteRole: API._RoleList = param => {
    const api = baseURL + `/v1/roles/` + param
    return baseService.delete(api)
}
// 菜单列表
export const menuList: API._MenuList = params => {
    const api = baseURL + `/v1/menus`
    return baseService.get(api, { params })
}
/**
 * 添加菜单
 * @param data
 * @returns {Promise}
 */
export const addMenu: API._EditMenu = data => {
    const api = baseURL + `/v1/menus`
    return baseService.post(api, data)
}
/**
 * 菜单授权
 * @param {id, data} 菜单id，授权的菜单id
 * @returns {Promise}
 */
export const authMenu: API._AuthMenu = (id, data) => {
    const api = baseURL + `/v1/roles/${id}/menus`
    return baseService.post(api, data)
}
/**
 * 编辑菜单
 * @param {number} param
 * @param {object} data
 * @returns {Promise}
 */
export const editMenu: API._EditMenu = (param, data) => {
    const api = baseURL + `/v1/menus/` + param
    return baseService.put(api, data)
}
/**
 * 删除菜单
 * @param {number} param 节点id
 * @returns {Promise}
*/
export const deleteMenu: API._MenuList = param => {
    const api = baseURL + `/v1/menus/` + param
    return baseService.delete(api)
}

export interface States {
    rememberMe: boolean;
    username: string;
    password: string;
    mobile: string;
    captcha: string;
}
