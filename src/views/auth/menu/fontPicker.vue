<template>
  <div>
    <a-popover placement="bottom" v-model:visible="state.fontVisible" trigger="click">
      <template v-slot:content>
        <a-input-search
          placeholder="搜索图标"
          @search="fontSearch"
          v-model="state.fontSearchValue"
        />
        <div :style="{ width: '265px', height: '250px', overflow: 'auto', overflowX: 'hidden' }">
          <div class="font-container">
            <div
              v-for="item in state.showJson"
              :key="item"
              @click="fontClick(item)"
              class="my-font"
            >
              <SvgIcon class="a-svg" :name="item" />
            </div>
          </div>
        </div>
      </template>
      <template v-slot:title>
        <span>图标</span>
      </template>
      <a-input :read-only="true" :value="value" @mouseover="mouseOver" :placeholder="placeholder">
        <template #addonBefore>
          <div class="icon" v-if="value">
            <SvgIcon class="svg" :name="value" />
          </div>
        </template>
      </a-input>
    </a-popover>
  </div>
</template>

<script lang="ts">
import fontJson from './fonts.json'
import { FormItem } from '@/types/schema'
import { defineComponent, reactive, computed } from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
export default defineComponent({
  name: 'fontPicker',
  components: {},
  emits: ['update:value'],
  props: {
    formItem: {
      // 表单项
      type: Object as PropType<FormItem>,
      default: () => ({})
    },
    value: undefined as any, // 表单项值
    placeholder: {
      type: String,
      default: null
    }
  },
  setup(props, { attrs, emit }) {
    const state = reactive({
      showJson: null,
      fontVisible: false,
      fontSearchValue: null
    })
    const modelValue = computed({
      get: () => props.value,
      set: (val) => emit('update:value', val)
    })
    const mouseOver = () => {
      state.fontSearchValue = null
      state.showJson = fontJson
    }
    const fontSearch = (value) => {
      if (value) {
        this.showJson = fontJson.filter((item) => {
          return item.startsWith(value)
        })
      } else {
        this.showJson = fontJson
      }
    }
    const fontClick = (item) => {
      modelValue.value = item
      state.fontVisible = false
    }
    return {
      state,
      mouseOver,
      fontSearch,
      fontClick
    }
  }
})
</script>

<style lang="less" scoped>
.font-container {
  padding-top: 10px;
  font-size: 18px;
  height: 235px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-content: flex-start;
  justify-content: flex-start;
  margin: 0 -5px;
}
.my-font {
  cursor: pointer;
  margin: 5px 5px 5px 5px;
  padding-top: 8px;
  text-align: center;
  border-radius: 6px;
  width: 45px;
  height: 40px;
  border: 1px solid #ccc;
}
.my-font:hover {
  background-color: #92ddca;
  border-color: #92ddca;
  .a-svg,
  .icon {
    color: #fff;
  }
}
.icon {
  .svg {
    vertical-align: middle;
  }
}
</style>
