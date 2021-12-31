<template>
  <div class="permissions">
    <div class="title">
      <ArrowLeftOutlined @click="cancel" class="arrow" />
      {{ $t('auth.role.permissionConfiguration') }}
    </div>
    <a-divider />
    <div class="p-content">
      <a-tabs
        tab-position="left"
        class="tabs"
        :animated="false"
        v-model:activeKey="state.activeKey"
      >
        <a-tab-pane key="1">
          <template #tab>
            <span class="label"><SvgIcon name="menu" />{{ $t('auth.role.menuPermission') }}</span>
          </template>
          <a-tree
            checkable
            :tree-data="state.treeData"
            :replaceFields="state.replaceFields"
            v-model:checkedKeys="state.checkedKeys"
          >
          </a-tree>
        </a-tab-pane>
        <a-tab-pane key="2" force-render>
          <template #tab>
            <span class="label"
              ><SvgIcon name="interface" />{{ $t('auth.role.interfacePermission') }}</span
            >
          </template>
        </a-tab-pane>
      </a-tabs>
      <div class="action">
        <a-button @click="cancel()">{{ $t('common.cancel') }}</a-button>
        <a-button type="primary" @click="submit()">{{ $t('common.submit') }}</a-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, h, createVNode } from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import * as api from '../service'
import { ArrowLeftOutlined } from '@ant-design/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import { openNotification } from '@/utils/util'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'permissions',
  components: { SvgIcon, ArrowLeftOutlined },
  setup(props) {
    const { t } = useI18n()
    const router = useRouter()
    const route = useRoute()
    const state = reactive({
      activeKey: ref('1'),
      treeData: [],
      checkedKeys: ref<number[]>([]),
      replaceFields: {
        key: 'id',
        title: 'label',
        children: 'children'
      }
    })

    /**
     * 返回操作
     */
    const cancel = () => {
      router.go(-1)
    }

    /**
     * 获取菜单列表
     */
    const getMenuList = () => {
      api.menuList().then((res) => {
        if (res.code === 200200) {
          state.treeData = res.data
        }
      })
    }
    /**
     * 菜单授权
     */
    const submit = async () => {
      const obj = new FormData()
      obj.append('menu_id', state.checkedKeys.join(','))
      const data = await api.authMenu(Number(route.query.id), obj)
      if (data.code === 200200)
        openNotification('success', t('common.tip'), t('common.submitSuccess'))
    }
    getMenuList()
    return {
      state,
      router,
      getMenuList,
      cancel,
      submit
    }
  }
})
</script>
<style lang="less" scoped>
@import '@/style/index.less';
.permissions {
  background: #fff;
  .action {
    display: flex;
    justify-content: center;
    padding-bottom: 20px;
    button {
      margin-right: 20px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
  .arrow {
    color: #999;
    cursor: pointer;
    padding: 0 5px;
    transition: all 0.3s;
    &:hover {
      color: #555;
    }
  }
  .title {
    padding: 10px;
    font-size: 22px;
    font-weight: 600;
    padding-bottom: 0px;
  }
  .tabs {
    .label {
      display: flex;
      align-items: center;
      svg:last-of-type {
        margin-right: 5px;
        width: 14px;
        height: 14px;
      }
    }
    //  &:deep(.ant-tabs-tab-active) {
    &:deep(.ant-tabs-tab-active) {
      svg:last-of-type {
        fill: @primary-color;
      }
    }
  }
}
</style>
