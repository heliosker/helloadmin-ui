import { FormSchema } from "@/../types/schema";
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
            type: 'input',
            label: t('role.name'),
            field: 'name',
            value: '',
            props: {
                placeholder: t('role.pleaseEnter') + t('role.name')
            },
            rules: [
                {
                    required: true,
                    message: t('role.name') + t('role.noEmpty')
                }
            ]
        },
        {
            type: 'input',
            label: t('role.describe'),
            field: 'describe',
            value: '',
            props: {
                placeholder: t('role.pleaseEnter') + t('role.describe')
            }
        }
    ]
})
