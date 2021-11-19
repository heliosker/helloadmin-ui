import { FormSchema } from "@/types/schema";

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
            label: '角色',
            field: 'email',
            value: '',
            props: {
                placeholder: '请输入角色'
            },
            rules: [
                {
                    required: true,
                    message: '角色不能为空'
                }
            ]
        },
        {
            type: 'input',
            label: '备注',
            field: 'name',
            value: '',
            props: {
                placeholder: '请输入备注'
            },
            rules: [
                {
                    required: false,
                    message: ''
                }
            ]
        }
    ]
})
