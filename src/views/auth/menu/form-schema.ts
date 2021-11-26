import { FormSchema } from "@/../types/schema";
// import team from '@/server/team';
import { createVNode } from 'vue'
import * as api from '../service'
// import Avater from './avater.vue'

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
            type: 'input',
            label: '菜单名称',
            field: 'label',
            value: '',
            props: {
                placeholder: '请输入菜单名称'
            },
            rules: [
                {
                    required: true,
                    message: '菜单名称不能为空'
                }
            ]
        },
        {
            type: 'input',
            label: '组件名称',
            field: 'name',
            value: '',
            props: {
                placeholder: '请输入组件名称'
            },
            rules: [
                {
                    required: true,
                    message: '组件名称不能为空'
                }
            ]
        },
        {
            type: 'select',
            label: '父级菜单',
            field: 'parent_id',
            value: '',
            options: [{ key: 0, value: '根节点' }],
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
            label: '路由',
            field: 'path',
            value: '',
            props: {
                placeholder: '请输入路由'
            },
            rules: [
                {
                    required: true,
                    message: '路由不能为空'
                }
            ]
        },
        {
            type: 'input',
            label: '重定向',
            field: 'redirect',
            value: '',
            props: {
                placeholder: '请输入重定向路径'
            }
        },
        {
            type: 'select',
            label: '图标',
            field: 'icon',
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
            type: 'radio',
            label: '展示',
            field: 'show',
            value: 1,
            options: [{ key: 1, value: '是' }, { key: 0, value: '否' }]
        }
    ]
})
