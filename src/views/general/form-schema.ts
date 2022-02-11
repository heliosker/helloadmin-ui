import { FormSchema } from "@/../types/schema";
import * as api from './service'
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
            type: 'select',
            label: t('general.module'),
            field: 'module_id',
            value: '',
            asyncOptions: async () => {
                const data = await api.getModule({ options: 1 })
                if (data.code === 200200) {
                    return data.data
                }
            },
            props: {
                placeholder: t('common.pleaseSelect') + t('general.module')
            },
            rules: [
                {
                    required: true,
                    message: t('general.module') + t('common.noEmpty')
                }
            ]
        },
        {
            type: 'input',
            label: t('general.config.name'),
            field: 'key',
            value: '',
            props: {
                placeholder: t('common.pleaseInput') + t('general.config.name')
            },
            rules: [
                {
                    required: true,
                    message: t('general.config.name') + t('common.noEmpty')
                }
            ]
        },
        {
            type: 'input',
            label: t('general.config.value'),
            field: 'value',
            value: '',
            props: {
                placeholder: t('common.pleaseInput') + t('general.config.value')
            },
            rules: [
                {
                    required: true,
                    message: t('general.config.value') + t('common.noEmpty')
                }
            ]
        },
        {
            type: 'input',
            label: t('general.title'),
            field: 'title',
            value: '',
            props: {
                placeholder: t('common.pleaseInput') + t('general.title')
            },
            rules: [
                {
                    required: false,
                    message: t('general.title') + t('common.noEmpty')
                }
            ]
        },
        {
            type: 'input',
            label: t('general.tip'),
            field: 'tip',
            value: '',
            props: {
                placeholder: t('common.pleaseInput') + t('general.tip')
            },
            rules: [
                {
                    required: false
                }
            ]
        }
    ]
})
