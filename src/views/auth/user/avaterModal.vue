<template>
  <a-modal
    title="修改头像"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    :width="800"
    :footer="null"
    @cancel="cancelHandel"
  >
    <a-row>
      <a-col :xs="24" :md="12" :style="{ height: '350px' }">
        <vue-cropper
          ref="cropper"
          :img="newValue"
          :info="true"
          :autoCrop="options.autoCrop"
          :autoCropWidth="options.autoCropWidth"
          :autoCropHeight="options.autoCropHeight"
          :fixedBox="options.fixedBox"
          @realTime="realTime"
        >
        </vue-cropper>
      </a-col>
      <a-col :xs="24" :md="12" :style="{ height: '350px' }">
        <div class="avatar-upload-preview">
          <img :src="previews.url" :style="previews.img" />
        </div>
      </a-col>
    </a-row>
    <br />
    <a-row>
      <a-col :lg="2" :md="2">
        <a-upload name="file" :beforeUpload="beforeUpload" :showUploadList="false">
          <a-button>
            <template #icon><UploadOutlined /></template>
            {{ $t('user.select.picture') }}</a-button
          >
        </a-upload>
      </a-col>
      <a-col :lg="{ span: 1, offset: 2 }" :md="2">
        <a-button @click="changeScale(1)">
          <template #icon><PlusOutlined /></template>
        </a-button>
      </a-col>
      <a-col :lg="{ span: 1, offset: 1 }" :md="2">
        <a-button @click="changeScale(-1)">
          <template #icon><MinusOutlined /></template>
        </a-button>
      </a-col>
      <a-col :lg="{ span: 1, offset: 1 }" :md="2">
        <a-button @click="rotateLeft">
          <template #icon><UndoOutlined /></template>
        </a-button>
      </a-col>
      <a-col :lg="{ span: 1, offset: 1 }" :md="2">
        <a-button @click="rotateRight">
          <template #icon><RedoOutlined /></template>
        </a-button>
      </a-col>
      <a-col :lg="{ span: 2, offset: 6 }" :md="2">
        <a-button type="primary" @click="finish('blob')">{{ $t('common.save') }}</a-button>
      </a-col>
    </a-row>
  </a-modal>
</template>
<script>
import 'vue-cropper/dist/index.css'
import { VueCropper } from 'vue-cropper'
import { baseURL } from '@/utils/util'
import baseService from '@/utils/http/axios.ts'
import { useI18n } from 'vue-i18n'
import {
  PlusOutlined,
  MinusOutlined,
  UploadOutlined,
  RedoOutlined,
  UndoOutlined
} from '@ant-design/icons-vue'
export default {
  components: {
    VueCropper,
    PlusOutlined,
    MinusOutlined,
    UploadOutlined,
    RedoOutlined,
    UndoOutlined
  },
  props: {
    value: {
      default: '',
      type: String
    }
  },
  data() {
    return {
      visible: false,
      id: null,
      confirmLoading: false,
      fileList: [],
      uploading: false,
      options: {
        // img: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        img: '',
        autoCrop: true,
        autoCropWidth: 200,
        autoCropHeight: 200,
        fixedBox: true
      },
      previews: {}
    }
  },
  computed: {
    newValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('update:value', val)
      }
    }
  },
  methods: {
    edit(id) {
      this.visible = true
      this.id = id
      /* 获取原始头像 */
    },
    close() {
      this.id = null
      this.visible = false
    },
    cancelHandel() {
      this.close()
    },
    changeScale(num) {
      num = num || 1
      this.$refs.cropper.changeScale(num)
    },
    rotateLeft() {
      this.$refs.cropper.rotateLeft()
    },
    rotateRight() {
      this.$refs.cropper.rotateRight()
    },
    beforeUpload(file) {
      const reader = new FileReader()
      // 把Array Buffer转化为blob 如果是base64不需要
      // 转化为base64
      reader.readAsDataURL(file)
      reader.onload = () => {
        this.newValue = reader.result
      }
      // 转化为blob
      // reader.readAsArrayBuffer(file)

      return false
    },

    // 上传图片（点击上传按钮）
    finish(type) {
      console.log('finish')
      const _this = this
      const formData = new FormData()
      // 输出
      if (type === 'blob') {
        const that = this
        this.$refs.cropper.getCropBlob((data) => {
          const img = window.URL.createObjectURL(data)
          that.model = true
          that.modelSrc = img
          formData.append('file', data, 'test.png')
          baseService.post(baseURL + '/v1/upload/qiniu', formData).then((response) => {
            that.options.upLoadedAvatar = response
            that.$emit('ok', response)
            that.visible = false
          })
        })
      } else {
        this.$refs.cropper.getCropData((data) => {
          this.model = true
          this.modelSrc = data
        })
      }
    },
    okHandel() {
      const vm = this
      const { t } = useI18n()
      vm.confirmLoading = true
      setTimeout(() => {
        vm.confirmLoading = false
        vm.close()
        vm.$message.success(t('user.upload.acatar.success'))
      }, 2000)
    },

    realTime(data) {
      this.previews = data
    }
  }
}
</script>

<style lang="less" scoped>
.avatar-upload-preview {
  position: absolute;
  top: 50%;
  transform: translate(50%, -50%);
  width: 180px;
  height: 180px;
  border-radius: 50%;
  box-shadow: 0 0 4px #ccc;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
  }
}
</style>
