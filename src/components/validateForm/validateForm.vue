<template>
  <div>
    <a-form ref="validateFormRef" v-bind="formItemLayout">
      <template
        v-for="formItem in formSchema.formItem.filter((item) => !item.hidden)"
        :key="formItem.field"
      >
        <a-spin :spinning="formItem.loading || false">
          <a-form-item
            :help="formItem.help"
            :extra="formItem.extra"
            :label="formItem.label"
            v-bind="{ ...formItem.props, ...validateInfos[formItem.field] }"
          >
            <component
              v-model:value="modelRef[formItem.field]"
              :form-item="formItem"
              :is="getComponent(formItem.type)"
            />
          </a-form-item>
        </a-spin>
      </template>
      <template v-if="$slots['operate-button']">
        <a-form-item
          :wrapper-col="{
            span: formItemLayout.wrapperCol.span,
            offset: formItemLayout.labelCol.span
          }"
        >
          <slot name="operate-button" />
        </a-form-item>
      </template>
    </a-form>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  getCurrentInstance,
  isReactive,
  ref,
  isRef,
  createVNode
} from 'vue'
import { Form, Spin } from 'ant-design-vue'
import { useForm } from '@ant-design-vue/use'
import { isFunction, isAsyncFunction } from '@/utils/is'
import components from './components'
import { FormItem } from '@/types/schema'

export default defineComponent({
  name: 'dynamic-form',
  components: {
    ...components,
    [Spin.name]: Spin,
    [Form.name]: Form,
    [Form.Item.name]: Form.Item
  },
  props: {
    formSchema: {
      // 动态验证表单
      required: true,
      type: [Object]
    } as any,
    fields: {
      // 预置字段默认值
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    // a-form
    const schemaFormRef = ref<any>(null)
    // 表单实例
    const formInstance = getCurrentInstance()
    // 表单布局
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      ...props.formSchema.formItemLayout
    }

    // 表单项
    const modelRef = reactive(
      props.formSchema.formItem.reduce((previousValue, currentValue) => {
        currentValue.eventObject = {}
        previousValue[currentValue.field] = currentValue.value
        return previousValue
      }, {})
    )
    // 如果有默认值，则覆盖
    props.fields && Object.assign(modelRef, props.fields)

    // 异步设置默认数据
    props.formSchema.formItem.forEach(async (item: FormItem) => {
      // 是否需要loading
      if (item?.hasOwnProperty('loading')) {
        item.loading = true
      }
      // 异步选项
      if (isFunction(item.asyncOptions) || isAsyncFunction(item.asyncOptions)) {
        item.options = await item
          .asyncOptions(item, formInstance)
          .finally(() => (item.loading = false))
      } else if (isFunction(item.asyncValue) || isAsyncFunction(item.asyncValue)) {
        // 异步默认值
        modelRef[item.field] = await item
          .asyncValue(item, formInstance)
          .finally(() => (item.loading = false))
      }
    })

    // 生成表单验证规则
    const rulesRef = reactive(
      props.formSchema.formItem
        .filter((item) => !item.hidden)
        .reduce((previousValue, currentValue) => {
          currentValue.rules && (previousValue[currentValue.field] = currentValue.rules)
          return previousValue
        }, {})
    )

    // const watchCallback = props.formSchema.watchCallback ?? (() => ({}))
    //
    // // 是否有需要监测的字段
    // props.formSchema.watchKeys && watch(props.formSchema.watchKeys.map(item => () => modelRef[item]), (curr, prev) => watchCallback(curr, {
    //   dynamicForm: props.formSchema,
    //   modelRef
    // }))
    // watch(props.formSchema.watchKeys.map(item => () => modelRef[item]), eval(props.formSchema.watchCallback))

    const { resetFields, validate, validateInfos, validateField } = useForm(modelRef, rulesRef)

    const preset = [
      'input',
      'textarea',
      'select',
      'radio',
      'checkbox',
      'input-number',
      'input-range',
      'switch',
      'upload',
      'date'
    ]

    // 获取组件名称
    const getComponent = (type) => {
      // 预设组件
      if (preset.includes(type)) {
        return type
      } else if (isReactive(type) || isRef(type)) {
        // 自定义组件
        return createVNode(type)
      } else {
        // 不识别组件
        return type
      }
    }

    return {
      formItemLayout,
      validate,
      resetFields,
      validateField,
      validateInfos,
      modelRef,
      schemaFormRef,
      getComponent
    }
  }
})
</script>

<style lang="less" scoped>
.ant-form {
  .ant-input-group {
    display: flex;
  }
}
</style>
