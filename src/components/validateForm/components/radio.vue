<template>
  <a-radio-group v-model:value="modelValue" v-bind="formItem.props" v-on="formItem.eventObject">
    <a-radio v-for="(item, index) in formItem.options" :key="index" :value="item.key">{{
      item.label
    }}</a-radio>
  </a-radio-group>
</template>
<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import { Radio } from 'ant-design-vue'
import { FormItem } from '@/types/schema'

export default defineComponent({
  name: 'schema-form-radio',
  emits: ['update:value'],
  components: {
    [Radio.name]: Radio,
    [Radio.Group.name]: Radio.Group
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
