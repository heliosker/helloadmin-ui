import { FormSchema } from "@/../types/schema";
import { createVNode } from 'vue';
import FontPicker from './fontPicker.vue'
import * as api from '../service'

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
            value: undefined,
            options: [],
            asyncOptions: async () => {
                const data = await api.menuList({ options: 'true' })
                if (data.code === 200200) {
                    return [{ key: 0, value: '根节点' }, ...data.data]
                }
            },
            props: {
                placeholder: '请选择父级菜单'
            },
            rules: [
                {
                    required: true,
                    message: '父级菜单不能为空！'
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
            type: createVNode(FontPicker),
            label: '图标',
            field: 'icon',
            value: '',
            props: {
                placeholder: '请选择图标'
            },
            rules: [
                {
                    required: false,
                    message: '图标不能为空'
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
