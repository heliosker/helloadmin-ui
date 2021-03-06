import ls from '@/utils/Storage'
import { ACCESS_TOKEN, PERMISSION, USER_INFO, MENU_NAV } from '@/store/mutation-types'
import { notification } from 'ant-design-vue'

export function clearUserInfo() {
    ls.remove(ACCESS_TOKEN)
    ls.remove(PERMISSION)
    ls.remove(USER_INFO)
    ls.remove(MENU_NAV)
}

export function timeFix() {
    const time = new Date()
    const hour = time.getHours()
    return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
    ls.remove(ACCESS_TOKEN)
    ls.remove(PERMISSION)
    ls.remove(USER_INFO)
    ls.remove(MENU_NAV)
}


// aes encryption key
export const encryptKeys = {
    // key最少4位,否则报错
    key: '1111',
    iv: '1',
};

export const firstLetterIsUpperCase = function (str) {
    var reg = /^[A-Z][A-z0-9]*$/;
    return reg.test(str);
    // key最少4位,否则报错
};

export const getQueryParameters = (options) => {
    const url = options.url
    const search = url.split('?')[1]
    if (!search) {
        return {}
    }
    return JSON.parse('{"' + decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"') + '"}')
}

export const getBody = (options) => {
    return options.body && JSON.parse(options.body)
}
export const openNotification = (type: string, message: string, description: string, placement?: string) => {
    notification[type]({
        message,
        description,
        placement,
        class: type
    });
};
export function scorePassword(pass) {
    let score = 0
    if (!pass) {
        return score
    }
    // award every unique letter until 5 repetitions
    const letters = {}
    for (let i = 0; i < pass.length; i++) {
        letters[pass[i]] = (letters[pass[i]] || 0) + 1
        score += 5.0 / letters[pass[i]]
    }

    // bonus points for mixing it up
    const variations = {
        digits: /\d/.test(pass),
        lower: /[a-z]/.test(pass),
        upper: /[A-Z]/.test(pass),
        nonWords: /\W/.test(pass)
    }

    let variationCount = 0
    for (var check in variations) {
        variationCount += (variations[check] === true) ? 1 : 0
    }
    score += (variationCount - 1) * 10

    return parseInt(score)
}

export const separator = ';'

export const divisionStringToArray = (string, customSeparator) => {
    return string ? string.split(customSeparator || separator) : []
}

const sitUrl = 'xxxxx'
export const isDev = import.meta.env.DEV
export const baseURL = isDev ? '/api' : 'http://47.103.204.136:9010/api'
