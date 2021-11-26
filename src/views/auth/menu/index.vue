<template>
  <div class="menu-list">
    <a-card
      :loading="state.loading"
      class="card"
      :body-style="{ padding: '10px 14px' }"
      :bordered="false"
    >
      <div class="menu-tree">
        <p class="chart-card-header">使用 scoped slot</p>
        <a-tree
          :tree-data="state.treeData"
          default-expand-all
          show-icon
          :replaceFields="state.replaceFields"
        >
          <!-- <template #label="item"><DeleteOutlined /> </template> -->
          <template #icon="item"> <DeleteOutlined /></template>
          <template #custom="item">
            <span class="tree-node">
              <span>{{ item.label }}</span>
              <span class="but_operation">
                <span class="but_type" @click="(e) => add(item)"><PlusSquareOutlined /></span>
                <span class="but_type" @click="() => edit(item)"><FormOutlined /></span>
                <span class="but_type" style="right: 120px" @click="() => remove(item)"
                  ><DeleteOutlined
                /></span>
              </span>
            </span>
          </template>
        </a-tree>
      </div>
    </a-card>
    <a-card
      :loading="state.loading"
      class="card"
      :body-style="{ padding: '10px 14px' }"
      :bordered="false"
    >
      <div class="chart-card-header">新增菜单</div>
      <div class="menu-form">
        <validate-form ref="formRef" :fields="state.fields" :form-schema="state.formSchema" />
        <div class="footer-btn">
          <a-button>重置</a-button>
          <a-button type="primary" @click="handleSave" :loading="confirmLoading">保存</a-button>
        </div>
      </div>
    </a-card>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, h } from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import ValidateForm from '@/components/com-common/validateForm/validateForm.vue'
import { FormOutlined, PlusSquareOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import * as api from '../service'
import { getFormSchema } from './form-schema'

export default defineComponent({
  name: 'MenuList',
  components: {
    SvgIcon,
    PlusSquareOutlined,
    FormOutlined,
    DeleteOutlined
  },
  setup(props) {
    const formRef = ref<any>(null)
    const state = reactive({
      loading: false,
      confirmLoading: false,
      formSchema: getFormSchema(),
      fields: {
        label: '',
        parent_id: '',
        path: '',
        icon: '',
        show: 1
      },
      treeData: [
        {
          id: '3',
          label: '23',
          children: [
            {
              id: '111',
              label: '1111',
              slots: { icon: 'dashborad', title: 'custom' }
            },
            {
              id: '1112',
              label: '1121',
              slots: { icon: 'dashborad', title: 'custom' }
            }
          ]
        }
      ],
      selected: false,
      replaceFields: {
        key: 'id',
        title: 'label',
        children: 'children'
      }
    })
    const newMenu = (data, a) => {
      // let arr = [];
      data.forEach((v) => {
        if (v.children.length > 0) {
          newMenu(v.children, true)
        } else {
          if (a) {
            v.slots = { icon: v.icon, title: 'custom' }
          } else {
            v.slots = { icon: 'icon', title: 'label' }
          }
        }
      })
      return data
    }
    const menuData = async () => {
      api.menuList().then((res) => {
        if (res.code === 200200) {
          const data = res.data
          let arr = []
          const newData = newMenu(data)
          console.log(newData)
          state.treeData = newData
        }
      })
    }
    menuData()
    const add = (item) => {
      console.log(item)
    }
    const edit = (item) => {
      console.log(123)
    }
    const del = (item) => {
      console.log(123)
    }
    const handleSave = () => {
      debugger
      console.log(formRef.value)
      formRef.value
        .validate()
        .then(async () => {
          const param = formRef.value.modelRef
          state.confirmLoading = true
          debugger
          const data = api.addMenu(param)
          debugger
          if (data.code === 200200) {
          }
        })
        .catch((err) => {
          console.log('error', err)
        })
    }
    return {
      state,
      edit,
      del,
      add,
      handleSave,
      newMenu,
      menuData,
      formRef
    }
  }
})
</script>
<style lang="less" scoped>
@import '@/style/index.less';
@import './index.less';
</style>
