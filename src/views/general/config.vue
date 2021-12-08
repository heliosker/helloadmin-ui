<template>
  <div class="config">
    <div class="title">系统配置</div>
    <a-divider />
    <a-tabs
      v-model:activeKey="state.activeKey"
      @change="() => getConfigData()"
      type="editable-card"
      @edit="onEdit"
    >
      <a-tab-pane
        v-for="pane in state.panes"
        :key="pane.key"
        :tab="pane.title"
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
                    <span>{{ record.remark }}</span>
                  </template>
                  <QuestionCircleOutlined /></a-tooltip
              ></span>
            </div>
          </template>
        </a-table>
        <div class="action">
          <a-button @click="cancel()">重置</a-button>
          <a-button type="primary" @click="submit()">提交</a-button>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import * as api from './service'
export default defineComponent({
  name: 'Config',
  components: { QuestionCircleOutlined },
  setup(props) {
    const state = reactive({
      columns: [
        {
          title: '标题',
          dataIndex: 'name',
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
      panes: [
        { title: '基础配置', key: 'oss' },
        { title: 'Tab 2', key: '2' },
        { title: 'Tab 3', key: '3', closable: false }
      ],
      activeKey: 'oss'
    })
    const onEdit = () => {}
    const cancel = () => {}
    /**
     * 提交配置
     */
    const submit = () => {}
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
    getConfigData()
    return {
      state,
      onEdit,
      getConfigData
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
  }
}
</style>
