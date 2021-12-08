import baseService from '@/utils/http/axios'
import { baseURL } from '@/utils/util'
import { API } from './types'
/**
 * 获取配置信息
 * @returns {Promise}
 */
export const getConfig: API._GetConfig = (params: string) => {
    const api = baseURL + `/v1/config`
    return baseService.get(api, { params })
}
