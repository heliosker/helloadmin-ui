import { VNode, ComponentInternalInstance, HTMLAttributes } from 'vue'
import { RuleObject } from 'ant-design-vue/lib/form/interface'
import { FormItemProps } from 'ant-design-vue/lib/form/FormItem'
import { FormProps, ValidationRule } from 'ant-design-vue/lib/form/Form'

declare interface OptionItem {
    key: string | number;
    value: string;
}

type Rule = ValidationRule & {

}

export declare interface FormItem extends Partial<typeof FormItemProps> {
    type?: 'input' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'input-number' | 'inputRange' | 'switch' | 'upload' | 'date' | VNode;
    label?: string; // 表单标签
    field: string; // 表单字段
    value: any; // 表单默认值
    props?: Partial<HTMLAttributes | HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | any>; // 表单属性
    rules?: Rule[]; // 表单验证规则
    class?: string; // 自定义类名
    options?: OptionItem[]; // 可选项
    eventObject?: object; // 事件对象，例如：{ mousedown: doThis, mouseup: doThat } 将会动态绑定为：v-on="{ mousedown: doThis, mouseup: doThat }"
    loading?: boolean; // 异步数据是否加载
    method?: (param: any) => Promise<any>;
    asyncValue?: (formItem: FormItem, formInstance: ComponentInternalInstance | null) => Promise<any>; // 异步数据
    asyncOptions?: (formItem: FormItem, formInstance: ComponentInternalInstance | null) => Promise<any>; // 异步选项的数据
    hidden?: boolean; // 是否隐藏表单项
    placeholder?: string;
}

export declare interface FormSchema extends Partial<typeof FormProps> {
    style?: object; // 表单样式
    formItemLayout?: object; // 表单布局
    watchKeys?: string[];
    watchCallback?: (watchKeys: string[], { formRef, modelRef }) => any;
    formItem: FormItem[];
}
