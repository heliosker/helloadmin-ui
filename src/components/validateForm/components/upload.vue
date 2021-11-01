<template>
  <a-upload
    v-model:file-list="fileList"
    name="avatar"
    list-type="picture-card"
    class="avatar-uploader"
    v-bind="formItem.props"
    v-on="formItem.eventObject"
    :show-upload-list="false"
    action=""
    :customRequest="customRequest"
    :before-upload="beforeUpload"
    @change="handleChange"
  >
    <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
    <div v-else>
      <!-- todo -->
      <LoadingOutlined v-if="loading" />
      <PlusOutlined v-else />
      <div class="ant-upload-text">上传</div>
    </div>
  </a-upload>
</template>
<script lang="ts">
import { defineComponent, PropType, computed, reactive, toRefs } from 'vue'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { message, Upload } from 'ant-design-vue'
import { FormItem } from '@/types/schema'
// import server from '@/server/index';

function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

export default defineComponent({
  name: 'schema-form-upload',
  emits: ['update:value'],
  components: {
    [Upload.name]: Upload,
    LoadingOutlined,
    PlusOutlined
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
    const fileList = computed({
      get: () => props.value,
      set: (val) => emit('update:value', val)
    })
    const state = reactive({
      loading: false,
      imageUrl: '',
      prop: props
    })
    // 上传请求
    const customRequest = ({ onSuccess, onError }) => {
      // console.log(state.prop.formItem.method)
      onSuccess()
      onError()
      // const method: any = state.prop.formItem.method;
      // server.task.uploadFile(file).then(res => {
      //   res.subscribe({
      //     next: (result) => {
      //       console.log(result)
      //     },
      //     error: (err) => {
      //       console.log(err)
      //     },
      //     complete: (e) => {
      //       console.log(e)
      //       e.key
      //       emit('update:value', e.key)
      //       state.imageUrl = 'http://static.hellokefu.com/' + e.key;
      //       // let data = {
      //       //   ...this.postsData,
      //       //   cover: "https://cdn.leafage.top/" + e.key,
      //       // };
      //   }
      //   })
      // })
    }
    const handleChange = (info) => {
      if (info.file.status === 'uploading') {
        state.loading = true
        return
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, (imageUrl) => {
          state.imageUrl = imageUrl
          state.loading = false
        })
      }
      if (info.file.status === 'error') {
        state.loading = false
      }
    }
    const beforeUpload = (file) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        message.error('You can only upload JPG file!')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        message.error('Image must smaller than 2MB!')
      }
      return isJpgOrPng && isLt2M
    }
    return {
      ...toRefs(state),
      fileList,
      handleChange,
      customRequest,
      beforeUpload
    }
  }
})
</script>
<style lang="less">
.avatar-uploader {
  img {
    width: 100%;
  }
}
</style>
