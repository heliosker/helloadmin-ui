<template>
  <div class="config">
    <div class="title">
      <span>{{ $t('general.config.page.title') }}</span>
      <a-button type="primary" @click="addConfig()">
        <template #icon>
          <PlusOutlined />
        </template>
        {{ $t('common.add') }}
      </a-button>
    </div>
    <a-divider />
    <a-tabs
      v-model:activeKey="state.activeKey"
      @change="() => getConfigData()"
      type="editable-card"
      @edit="onEdit"
    >
      <a-tab-pane
        v-for="pane in state.moduleList"
        :key="pane.key"
        :tab="pane.value"
        :closable="pane.closable"
      >
        <a-table
          class="ant-table-striped"
          :columns="state.columns"
          :data-source="state.dataSource"
          :pagination="false"
          :rowClassName="(record, index) => (index % 2 === 1 ? 'table-striped' : null)"
        >
          <template #value="{ record }">
            <div class="config-content">
              <a-input v-model:value="state.editableData[record.key]" />
              <span class="tips">
                <a-tooltip placement="top">
                  <template #title>
                    <span>{{ record.tip }}</span>
                  </template>
                  <QuestionCircleOutlined /></a-tooltip
              ></span>
            </div>
          </template>
        </a-table>
        <div class="action">
          <a-button @click="cancel()">{{ $t('common.reset') }}</a-button>
          <a-button type="primary" @click="submit()"> {{ $t('common.save') }}</a-button>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { QuestionCircleOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { formDrawer } from '@/hooks/formDrawer'
import { useFormModal } from '@/hooks/formModal'
import { getFormSchema } from './form-schema'
import { getModuleFormSchema } from './module-schema'
import * as api from './service'
import { openNotification } from '@/utils/util'
import { Modal } from 'ant-design-vue'

export default defineComponent({
  name: 'Config',
  components: { QuestionCircleOutlined, PlusOutlined },
  setup(props) {
    const state = reactive({
      moduleList: [],
      columns: [
        {
          title: '标题',
          dataIndex: 'title',
          width: 120
        },
        {
          title: '变量值',
          dataIndex: 'value',
          slots: { customRender: 'value' }
        },
        {
          title: '变量名',
          dataIndex: 'key',
          width: 180
        }
      ],
      editableData: {},
      dataSource: [],
      activeKey: ''
    })
    /**
     * 编辑module
     * @param {targetKey, action} 编辑的当前key，操作的类型
     */
    const onEdit = (targetKey: string | MouseEvent, action: string) => {
      if (action === 'add') {
        useFormModal({
          title: '添加组',
          formSchema: getModuleFormSchema(),
          handleOk: async (modelRef) => {
            const { module } = modelRef
            const params = {
              module
            }
            const obj = new FormData()
            Object.keys(params).forEach((k) => {
              obj.append(k, params[k])
            })
            const data = await api.addModule(obj)
            if (data.code === 200200) {
              getConfigData()
              getModuleList()
              openNotification('success', '提示', '创建成功！')
            }
          }
        })
      } else {
        Modal.warning({
          title: () => '提示',
          content: () => '确认执行删除此操作？',
          okText: '确认',
          onOk: async () => {
            const ob = new FormData()
            ob.append('id', targetKey)
            const data = api.delModule(ob)
            if (data.code === 200200) {
              openNotification('success', '提示', '删除成功！')
              getConfigData()
            }
            Modal.destroyAll()
          }
        })
      }
    }
    const cancel = () => {}
    const addConfig = () => {
      formDrawer({
        title: '添加配置',
        formSchema: getFormSchema(),
        handleOk: async (modelRef) => {
          const { tip, value, key, module_id, status, title } = modelRef
          const params = {
            tip,
            value,
            key,
            module_id,
            status,
            title
          }
          const obj = new FormData()
          Object.keys(params).forEach((k) => {
            obj.append(k, params[k])
          })
          const data = await api.addConfig(obj)
          if (data.code === 200200) {
            getConfigData()
            openNotification('success', '提示', '创建成功！')
          }
        }
      })
    }
    /**
     * 提交配置
     */
    const submit = async () => {
      console.log(state.editableData)
      let arr = []
      Object.keys(state.editableData).forEach((v) => {
        let obj = {}
        obj[v] = state.editableData[v]
        arr.push(obj)
      })
      const data = await api.editConfig(arr)
      if (data.code === 200200) {
        openNotification('success', '提示', '修改成功！')
      }
    }
    /**
     * 获取配置数据
     */
    const getConfigData = async () => {
      const data = await api.getConfig({ module: state.activeKey })
      if (data.code === 200200) {
        state.dataSource = data.data
        let obj = {}
        data.data.forEach((val) => {
          obj[val.key] = val.value
        })
        state.editableData = obj
      }
    }
    /**
     * 获取组列表
     * */
    const getModuleList = async () => {
      const data = await api.getModule({ options: 1 })
      if (data.code === 200200) {
        state.activeKey = data.data[0].key
        state.moduleList = data.data
      }
    }
    getModuleList()
    getConfigData()
    return {
      state,
      onEdit,
      getConfigData,
      getModuleList,
      submit,
      cancel,
      addConfig
    }
  }
})
</script>
<style lang="less" scoped>
.config {
  background: #fff;
  padding: 20px;
  .ant-table-striped :deep(.table-striped) td {
    background-color: #fafafa;
  }
  .ant-table-striped :deep(.config-content) {
    width: calc(100% - 240px);
    display: flex;
    .tips {
      margin-left: 20px;
      .anticon {
        vertical-align: bottom;
      }
    }
  }
  .action {
    display: flex;
    justify-content: center;
    padding-bottom: 20px;
    margin-top: 40px;
    button {
      margin-right: 20px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
  &:deep(.ant-tabs-top-bar) {
    height: 40px;
  }
  &:deep(.ant-tabs-nav-container) {
    float: left !important;
  }
  &:deep(.ant-tabs-extra-content) {
    float: none !important;
    display: inline-block;

    .ant-tabs-new-tab {
      width: 40px;
      height: 40px;
      svg {
        width: 20px;
        height: 20px;
      }
    }
  }
  .title {
    padding-bottom: 10px;
    font-size: 22px;
    font-weight: 600;
    padding-bottom: 0px;
    display: flex;
    justify-content: space-between;
  }
}
</style>
