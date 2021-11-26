<template>
  <a-drawer width="370" v-bind="$attrs" v-model:visible="visible" @close="close">
    <validate-form ref="formRef" :fields="fields" :form-schema="validateForm" />
    <div
      :style="{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e8e8e8',
        padding: '10px 16px',
        textAlign: 'right',
        left: 0,
        background: '#fff',
        borderRadius: '0 0 4px 4px'
      }"
    >
      <a-button style="margin-right: 8px" @click="close">取消</a-button>
      <a-button type="primary" :loading="confirmLoading" @click="certain">确认</a-button>
    </div>
  </a-drawer>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref, PropType } from 'vue'
import { Drawer } from 'ant-design-vue'
import ValidateForm from '@/components/com-common/validateForm/validateForm.vue'
import { FormSchema } from '@/types/schema'

export default defineComponent({
  name: 'form-modal',
  components: { [Drawer.name]: Drawer, ValidateForm },
  props: {
    close: {
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
      validateForm: props.formSchema
    })

    props.hiddenFields.forEach(
      (field) =>
        (state.validateForm.formItem.find((item) => item.field == field)!.hidden = !!props.fields)
    )

    const certain = () => {
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
          state.confirmLoading = true
        })
    }

    return {
      ...toRefs(state),
      certain,
      formRef
    }
  }
})
</script>

<style scoped></style>
