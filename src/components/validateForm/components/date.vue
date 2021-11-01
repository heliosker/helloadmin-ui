<template>
  <a-range-picker
    v-model:value="modelValue"
    v-bind="formItem.props"
    v-on="formItem.eventObject"
    :placeholder="['开始时间', '结束时间']"
  />
</template>
<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import { DatePicker } from 'ant-design-vue'
import { FormItem } from '@/types/schema'
const { RangePicker } = DatePicker
export default defineComponent({
  name: 'schema-form-date',
  emits: ['update:value'],
  components: {
    [RangePicker.name]: RangePicker
  },
  props: {
    formItem: {
      // 表单项
      type: Object as PropType<FormItem>,
      default: () => ({})
    },
    value: undefined as any // 表单项值
  },
  // eslint-disable-next-line
  setup(props, { attrs, emit }) {
    const modelValue = computed({
      get: () => props.value,
      set: (val) => emit('update:value', val)
    })
    return {
      modelValue
    }
  }
})
</script>
