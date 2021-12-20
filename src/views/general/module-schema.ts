import { FormSchema } from "@/../types/schema";

export const getModuleFormSchema = (): FormSchema => ({
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
            label: '组名',
            field: 'module',
            value: '',
            props: {
                placeholder: '请输入组名'
            },
            rules: [
                {
                    required: true,
                    message: '组名不能为空'
                }
            ]
        }
    ]
})
