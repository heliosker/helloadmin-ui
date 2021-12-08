<template>
  <div class="permissions">
    <div class="title">
      <ArrowLeftOutlined @click="cancel" class="arrow" />
      权限配置
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
            <span class="label"><SvgIcon name="menu" />菜单权限</span>
          </template>
          <a-tree
            checkable
            :tree-data="state.treeData"
            :replaceFields="state.replaceFields"
            v-model:selectedKeys="state.selectedKeys"
            v-model:checkedKeys="state.checkedKeys"
          >
          </a-tree>
        </a-tab-pane>
        <a-tab-pane key="2" force-render>
          <template #tab>
            <span class="label"><SvgIcon name="interface" />接口权限</span>
          </template>
        </a-tab-pane>
      </a-tabs>
      <div class="action">
        <a-button @click="cancel()">取消</a-button>
        <a-button type="primary" @click="submit()">提交</a-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, h, createVNode } from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import * as api from '../service'
import { ArrowLeftOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'permissions',
  components: { SvgIcon, ArrowLeftOutlined },
  setup(props) {
    const router = useRouter()
    const state = reactive({
      activeKey: ref('1'),
      treeData: [],
      checkedKeys: ref<number[]>([]),
      selectedKeys: ref<number[]>([]),
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

    getMenuList()
    return {
      state,
      router,
      getMenuList,
      cancel
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
