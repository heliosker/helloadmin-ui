<template>
  <div class="menu-list">
    <a-card class="card" :body-style="{ padding: '10px 14px' }" :bordered="false">
      <div class="menu-tree">
        <p class="chart-card-header">
          <a-button type="primary" @click="() => toggleOpen()"
            ><PlusOutlined />{{ $t('auth.menu.unfold') }}</a-button
          ><a-button type="primary" danger @click="() => toggleClose()"
            ><MinusOutlined />{{ $t('auth.menu.pickUp') }}</a-button
          ><a-button type="primary" @click="() => refresh()" :loading="state.refreshLoading">
            <template #icon>
              <SyncOutlined />
            </template>
            {{ $t('common.refresh') }}</a-button
          >
        </p>
        <a-tree
          v-model:expandedKeys="state.expandedKeys"
          :tree-data="state.treeData"
          default-expand-all
          show-icon
          :replaceFields="state.replaceFields"
        >
          <template #label="item">
            <span class="tree-parent">
              <span><SvgIcon :name="item.icon" />{{ item.label }}</span>
              <span class="but_operation">
                <span class="but_type" @click="() => add(item.id)"><PlusSquareOutlined /></span>
                <span class="but_type" @click="() => edit(item)"><FormOutlined /></span>
                <span class="but_type" style="right: 120px" @click="() => remove(item.id)"
                  ><DeleteOutlined
                /></span>
              </span>
            </span>
          </template>
          <template #icon="item"></template>
          <template #n_icon="item">
            <SvgIcon :name="item.icon" />
          </template>
          <template #custom="item">
            <span class="tree-node">
              <span>{{ item.label }}</span>
              <span class="but_operation">
                <span class="but_type" @click="() => edit(item)"><FormOutlined /></span>
                <span class="but_type" style="right: 120px" @click="() => remove(item.id)"
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
      <div class="chart-card-header">
        {{ state.isAdd ? $t('auth.menu.addMenu') : $t('auth.menu.editMenu') }}
      </div>
      <div class="menu-form">
        <validate-form
          ref="formRef"
          v-if="state.show"
          :fields="state.fields"
          :form-schema="state.formSchema"
        />
        <div class="footer-btn">
          <a-button>{{ $t('common.reset') }}</a-button>
          <a-button type="primary" @click="handleSave" :loading="confirmLoading">{{
            $t('common.save')
          }}</a-button>
        </div>
      </div>
    </a-card>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, createVNode, ref, h } from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import { Modal } from 'ant-design-vue'
import ValidateForm from '@/components/validateForm/validateForm.vue'
import { openNotification } from '@/utils/util'
import { useI18n } from 'vue-i18n'
import {
  FormOutlined,
  PlusSquareOutlined,
  DeleteOutlined,
  PlusOutlined,
  MinusOutlined,
  SyncOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons-vue'
import * as api from '../service'
import { getFormSchema } from './form-schema'

export default defineComponent({
  name: 'MenuList',
  components: {
    SvgIcon,
    PlusSquareOutlined,
    FormOutlined,
    DeleteOutlined,
    SyncOutlined,
    MinusOutlined,
    PlusOutlined,
    ExclamationCircleOutlined
  },
  setup(props) {
    const formRef = ref<any>(null)
    const { t } = useI18n()
    const getInitalState = () => {
      return {
        label: '',
        parent_id: '',
        path: '',
        icon: '',
        show: 1
      }
    }
    const state = reactive({
      loading: false,
      refreshLoading: false,
      expandedKeys: [],
      confirmLoading: false,
      allExpandedKeys: [],
      formSchema: getFormSchema(),
      menuOptions: [],
      isAdd: true,
      show: true,
      id: '',
      fields: getInitalState(),
      treeData: [],
      selected: false,
      replaceFields: {
        key: 'id',
        title: 'label',
        children: 'children'
      }
    })
    const newMenu = (data, a) => {
      data.forEach((v) => {
        if (v.children && v.children.length > 0) {
          v.slots = { icon: 'icon', title: 'label' }
          newMenu(v.children, true)
        } else {
          if (a) {
            v.slots = { icon: 'n_icon', title: 'custom' }
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
          let allExpandedKeys = []
          const newData = newMenu(data)
          for (let i = 0; i <= data.length - 1; i++) {
            const item = data[i]
            allExpandedKeys.push(item.id)
          }
          state.allExpandedKeys = allExpandedKeys
          state.treeData = newData
        }
      })
    }
    menuData()
    /**
     * 重置数据
     */
    const resetState = () => {
      Object.assign(state.fields, getInitalState())
      state.show = false
      setTimeout(() => {
        state.show = true
      }, 0)
    }
    /**
     * 添加菜单
     * @param {number} id 节点id
     */
    const add = (id) => {
      state.isAdd = true
      state.show = true
      const item = { ...state.fields }
      item.parent_id = id
      state.loading = true
      setTimeout(() => {
        state.loading = false
      }, 0)
      state.fields = item
    }

    /**
     * 编辑菜单
     * @param {object} item 节点信息
     */
    const edit = (item) => {
      let obj = {}
      state.isAdd = false
      state.show = false
      state.id = item.id
      Object.keys(state.fields).forEach((v) => {
        obj[v] = item[v]
      })
      state.loading = true
      setTimeout(() => {
        state.show = true
        state.loading = false
      }, 10)
      state.fields = obj
    }

    /**
     * 删除菜单节点
     * @param {number} id 菜单节点id
     */
    const remove = (id) => {
      Modal.confirm({
        title: t('common.tip'),
        icon: createVNode(ExclamationCircleOutlined),
        content: t('common.confirmDelete'),
        okText: t('common.confirm'),
        cancelText: t('common.cancel'),
        onOk: async () => {
          const data = await api.deleteMenu(id)
          if (data.code == 200200) {
            openNotification('success', t('common.tip'), t('common.deleteSuccess'))
            refresh()
            Modal.destroyAll()
          }
        }
      })
    }
    /* 保存 */
    const handleSave = () => {
      formRef.value
        .validate()
        .then(async () => {
          const param = formRef.value.modelRef
          state.confirmLoading = true
          if (state.isAdd) {
            const { code } = await api.addMenu(param)
            if (code === 200200) {
              openNotification('success', t('common.tip'), t('common.submitSuccess'))
            }
          } else {
            const { code } = await api.editMenu(state.id, param)
            if (code === 200200) {
              openNotification('success', t('common.tip'), t('common.updatedSuccess'))
            }
          }
          resetState()
        })
        .catch((err) => {
          console.log('error', err)
        })
    }
    /* 展开 */
    const toggleOpen = () => {
      state.expandedKeys = state.allExpandedKeys
    }
    /* 收起 */
    const toggleClose = () => {
      state.expandedKeys = []
    }
    /* 刷新 */
    const refresh = async () => {
      state.refreshLoading = true
      const data = await menuData()
      setTimeout(() => {
        state.refreshLoading = false
      }, 400)
    }
    return {
      state,
      edit,
      remove,
      add,
      handleSave,
      newMenu,
      menuData,
      formRef,
      toggleClose,
      toggleOpen,
      refresh
    }
  }
})
</script>
<style lang="less" scoped>
@import '@/style/index.less';
@import './index.less';
</style>
