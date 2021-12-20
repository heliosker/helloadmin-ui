import baseService from '@/utils/http/axios'
import { baseURL } from '@/utils/util'
import { API } from './types'
/**
 * 获取配置信息
 * @param params 组id参数
 * @returns {Promise}
 */
export const getConfig: API._GetConfig = (params: string) => {
    const api = baseURL + `/v1/config`
    return baseService.get(api, { params })
}
/**
 * 编辑配置信息
 * @param data 配置参数
 * @returns {Promise}
 */
export const editConfig: API._editConfig = (data: object) => {
    const api = baseURL + `/v1/config`
    return baseService.put(api, data)
}
/**
 * 获取组数据
 * @param params 是否是下拉列表
 * @returns {Promise}
 */
export const getModule: API._ModuleData = (params: string) => {
    const api = baseURL + `/v1/config/module`
    return baseService.get(api, { params })
}
/**
 * 添加组数据
 * @param data 组名
 * @returns {Promise}
 */
export const addModule: API._AddModule = (data: object) => {
    const api = baseURL + `/v1/config/module`
    return baseService.post(api, data)
}
/**
 * 删除模块组
 * @param param 删除组的id
 * @returns {Promise}
 */
export const delModule: API._ModuleData = (data: object) => {
    const api = baseURL + `/v1/config/module`
    return baseService.delete(api, { data })
}
/**
 * 新增配置信息
 * @param data 新增参数
 * @returns {Promise}
 */
export const addConfig: API._AddConfig = (data: any) => {
    const api = baseURL + `/v1/config`
    return baseService.post(api, data)
}
