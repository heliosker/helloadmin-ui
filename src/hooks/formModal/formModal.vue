<template>
  <a-modal
    v-bind="$attrs"
    v-model:visible="visible"
    :confirm-loading="confirmLoading"
    :afterClose="afterClose"
    @ok="onOk"
  >
    <validate-form ref="formRef" :fields="fields" :form-schema="validateForm" />
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref, PropType } from 'vue'
import { Modal } from 'ant-design-vue'
import ValidateForm from '@/components/com-common/validateForm/validateForm.vue'
import { FormSchema } from '@/types/schema'

export default defineComponent({
  name: 'form-modal',
  components: { [Modal.name]: Modal, ValidateForm },
  props: {
    afterClose: {
      // 关闭回调
      type: Function
    },
    formSchema: {
      // 表单项
      type: Object as PropType<FormSchema>,
      default: () => ({})
    },
    fields: {
      // 默认值，一般编辑时传入
      type: Object,
      default: () => ({})
    },
    hiddenFields: {
      // 不需要显示的字段（表单项）
      type: Array,
      default: () => []
    },
    handleOk: {
      // 点击确定
      type: Function
    }
  },
  setup(props) {
    const formRef = ref<any>(null)
    const state = reactive({
      visible: true,
      confirmLoading: false,
      // validateForm: cloneDeep(props.formSchema)
      validateForm: props.formSchema
    })

    props.hiddenFields.forEach(
      (field) =>
        (state.validateForm.formItem.find((item) => item.field == field)!.hidden = !!props.fields)
    )

    const onOk = () => {
      state.confirmLoading = true
      formRef.value
        .validate()
        .then(async () => {
          await (props.handleOk && props.handleOk(formRef.value.modelRef, state)).finally(
            () => (state.confirmLoading = false)
          )
          state.visible = false
        })
        .catch((err) => {
          console.log('error', err)
          state.confirmLoading = false
        })
    }

    return {
      ...toRefs(state),
      onOk,
      formRef
    }
  }
})
</script>

<style scoped></style>
