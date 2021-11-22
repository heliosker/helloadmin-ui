<template>
  <div>
    <div class="ant-upload-preview" @click="edit">
      <CloudUploadOutlined class="upload-icon" />
      <div class="mask">
        <PlusOutlined />
      </div>
      <img :src="modelValue" error="@/assets/default.png" />
    </div>
    <AvaterModal ref="Ref" />
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, computed, ref } from 'vue'
// import { FormItem } from '@/types/schema'
import { Image } from 'ant-design-vue'
import { CloudUploadOutlined, PlusOutlined } from '@ant-design/icons-vue'
import AvaterModal from './avaterModal.vue'
export default defineComponent({
  name: 'avater',
  emits: ['update:value'],
  components: {
    PlusOutlined,
    Image,
    CloudUploadOutlined,
    AvaterModal
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
    const Ref = ref<any>(null)
    const modelValue = computed({
      get: () => props.value,
      set: (val) => emit('update:value', val)
    })
    const edit = () => {
      Ref.value.edit(1)
    }
    return {
      edit,
      Ref,
      modelValue
    }
  }
})
</script>
<style lang="less">
.ant-upload-preview {
  position: relative;
  margin: 0 auto;
  width: 100%;
  max-width: 110px;
  border-radius: 50%;
  height: 110px;
  box-shadow: 0 0 4px #ccc;

  .upload-icon {
    position: absolute;
    top: 0;
    right: 10px;
    font-size: 1.4rem;
    padding: 0.5rem;
    background: rgba(222, 221, 221, 0.7);
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }
  .mask {
    opacity: 0;
    position: absolute;
    background: rgba(0, 0, 0, 0.4);
    cursor: pointer;
    transition: opacity 0.4s;

    &:hover {
      opacity: 1;
    }

    i {
      font-size: 2rem;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -1rem;
      margin-top: -1rem;
      color: #d6d6d6;
    }
  }

  img,
  .mask {
    width: 100%;
    max-width: 180px;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
  }
}
</style>
