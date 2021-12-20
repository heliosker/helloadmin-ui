import { FormSchema } from "@/../types/schema";
import * as api from './service'

export const getFormSchema = (): FormSchema => ({
    style: {
        width: "auto"
    },
    formItemLayout: {
        labelCol: {
            span: 6
        },
        wrapperCol: {
            span: 18
        }
    },
    formItem: [
        {
            type: 'select',
            label: '分组',
            field: 'module_id',
            value: '',
            asyncOptions: async () => {
                const data = await api.getModule({ options: 1 })
                if (data.code === 200200) {
                    return data.data
                }
            },
            props: {
                placeholder: '请选择分组'
            },
            rules: [
                {
                    required: true,
                    message: '分组不能为空'
                }
            ]
        },
        {
            type: 'input',
            label: '变量名',
            field: 'key',
            value: '',
            props: {
                placeholder: '请输入变量名'
            },
            rules: [
                {
                    required: true,
                    message: '变量名不能为空'
                }
            ]
        },
        {
            type: 'input',
            label: '变量值',
            field: 'value',
            value: '',
            props: {
                placeholder: '请输入变量值'
            },
            rules: [
                {
                    required: true,
                    message: '变量值不能为空'
                }
            ]
        },
        {
            type: 'input',
            label: '标题',
            field: 'title',
            value: '',
            props: {
                placeholder: '请输入变量值'
            },
            rules: [
                {
                    required: false,
                    message: '变量名不能为空'
                }
            ]
        },
        {
            type: 'input',
            label: '提示信息',
            field: 'tip',
            value: '',
            props: {
                placeholder: '请输入提示信息'
            },
            rules: [
                {
                    required: false
                }
            ]
        },
        {
            type: 'radio',
            label: '状态',
            field: 'status',
            value: 0,
            options: [{ key: 0, value: '正常' }, { key: 1, value: '锁定' }]
        }
    ]
})
