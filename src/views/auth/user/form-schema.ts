import { FormSchema } from "@/types/schema";
// import team from '@/server/team';
import { createVNode } from 'vue'
import * as api from '../service'
import Avater from './avater.vue'

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
            type: createVNode(Avater),
            field: 'avater',
            class: 'f_avater'
        },
        {
            type: 'input',
            label: '账户',
            field: 'username',
            value: '',
            props: {
                placeholder: '请输入账户'
            },
            rules: [
                {
                    required: true,
                    message: '账户不能为空'
                }
            ]
        },
        {
            type: 'input',
            label: '邮箱',
            field: 'email',
            value: '',
            props: {
                placeholder: '请输入邮箱'
            },
            rules: [
                {
                    required: false,
                    message: '邮箱不能为空'
                }
            ]
        },
        {
            type: 'select',
            label: '角色',
            field: 'role_id',
            value: undefined,
            options: [],
            asyncOptions: async () => {
                const data = await api.getRoleList({ options: 'true' })
                if (data.code === 0) {
                    return data.data
                }
            },
            props: {
                placeholder: '请选择员角色'
            },
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
