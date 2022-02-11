import { FormSchema } from "@/../types/schema";
// import team from '@/server/team';
import { createVNode } from 'vue'
import * as api from '../service'
import Avater from './avater.vue'
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

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
            class: 'f_avater',
            value: 'https://image.shenjumiaosuan.com/article/1635218188362.png'
        },
        {
            type: 'input',
            label: t('user.account'),
            field: 'username',
            value: '',
            props: {
                placeholder: t('common.pleaseInput') + t('user.account')
            },
            rules: [
                {
                    required: true,
                    message: t('user.account') + t('common.noEmpty')
                }
            ]
        },
        {
            type: 'input',
            label: t('user.email'),
            field: 'email',
            value: '',
            props: {
                placeholder: t('common.pleaseInput') + t('user.email')
            },
            rules: [
                {
                    required: false,
                    message: t('user.email') + t('common.noEmpty')
                }
            ]
        },
        {
            type: 'select',
            label: t('user.role'),
            field: 'role_id',
            value: undefined,
            options: [],
            asyncOptions: async () => {
                const data = await api.getRoleList({ options: 'true' })
                if (data.code === 200200) {
                    return data.data
                }
            },
            props: {
                placeholder: t('common.pleaseSelect') + t('user.role')
            },
        },
        {
            type: 'radio',
            label: t('user.status'),
            field: 'status',
            value: 0,
            options: [{ key: 0, value: t('user.normal') }, { key: 1, value: t('user.lock') }]
        }
    ]
})
