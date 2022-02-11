import { FormSchema } from "@/../types/schema";
import { createVNode } from 'vue';
import FontPicker from './fontPicker.vue'
import * as api from '../service'
import { useI18n } from 'vue-i18n'
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
            label: useI18n().t('auth.menu.menuName'),
            field: 'label',
            value: '',
            props: {
                placeholder: useI18n().t('common.pleaseInput'),
            },
            rules: [
                {
                    required: true,
                    message: useI18n().t('auth.menu.menuValidate')
                }
            ]
        },
        {
            type: 'input',
            label: useI18n().t('auth.menu.componentName'),
            field: 'name',
            value: '',
            props: {
                placeholder: useI18n().t('common.pleaseInput') + useI18n().t('auth.menu.componentName')
            },
            rules: [
                {
                    required: true,
                    message: useI18n().t('auth.menu.componentNameValidate')
                }
            ]
        },
        {
            type: 'select',
            label: useI18n().t('auth.menu.parentMenu'),
            field: 'parent_id',
            value: undefined,
            options: [],
            asyncOptions: async () => {
                const data = await api.menuList({ options: 'true' })
                if (data.code === 200200) {
                    return [{ key: 0, value: useI18n().t('auth.menu.rootNode') }, ...data.data]
                }
            },
            props: {
                placeholder: useI18n().t('auth.menu.pleaseSelectMenu')
            },
            rules: [
                {
                    required: true,
                    message: useI18n().t('auth.menu.parentMenuValidate')
                }
            ]
        },
        {
            type: 'input',
            label: useI18n().t('auth.menu.route'),
            field: 'path',
            value: '',
            props: {
                placeholder: useI18n().t('auth.menu.pleaseEnterRoute')
            },
            rules: [
                {
                    required: true,
                    message: useI18n().t('auth.menu.route') + useI18n().t('common.noEmpty')
                }
            ]
        },
        {
            type: 'input',
            label: useI18n().t('auth.menu.redirect'),
            field: 'redirect',
            value: '',
            props: {
                placeholder: useI18n().t('common.pleaseInput') + useI18n().t('auth.menu.redirectUrl')
            }
        },
        {
            type: createVNode(FontPicker),
            label: useI18n().t('auth.menu.icon'),
            field: 'icon',
            value: '',
            props: {
                placeholder: useI18n().t('auth.menu.pleaseSelect') + useI18n().t('auth.menu.icon')
            },
            rules: [
                {
                    required: false,
                    message: useI18n().t('auth.menu.icon') + useI18n().t('common.noEmpty')
                }
            ]
        },
        {
            type: 'radio',
            label: useI18n().t('auth.menu.display'),
            field: 'show',
            value: 1,
            options: [{ key: 1, value: '是' }, { key: 0, value: '否' }]
        }
    ]
})
