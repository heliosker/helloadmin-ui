<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="12" :sm="24">
            <a-form-item label="角色ID">
              <a-input placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="Ref.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => (state.queryParam = {})"
                >重置</a-button
              >
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <s-table row-key="id" ref="Ref" size="default" :columns="columns" :data="loadData" @add="add">
      <!-- <div slot="expandedRowRender" slot-scope="record" style="margin: 0">
        <a-row :gutter="24" :style="{ marginBottom: '12px' }">
          <a-col
            :span="12"
            v-for="(role, index) in record.permissions"
            :key="index"
            :style="{ marginBottom: '12px', height: '23px' }"
          >
            <a-col :lg="4" :md="24">
              <span>{{ role.permissionName }}：</span>
            </a-col>
            <a-col :lg="20" :md="24" v-if="role.actionList && role.actionList.length > 0">
              <a-tag color="cyan" v-for="action in role.actionList" :key="action">{{
                action | permissionFilter
              }}</a-tag>
            </a-col>
            <a-col :span="20" v-else>-</a-col>
          </a-col>
        </a-row>
      </div> -->
      <!-- <a-tag color="blue" slot="status" slot-scope="text">{{ text | statusFilter }}</a-tag> -->
      <!-- <span slot="createTime" slot-scope="text">{{ text | moment }}</span> -->
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a-dropdown>
          <a class="ant-dropdown-link"> 更多 <DownOutlined /> </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="javascript:;">详情</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">禁用</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">删除</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </span>
    </s-table>
  </a-card>
</template>

<script lang="ts">
import pick from 'lodash.pick'
import STable from '@/components/table/index.tsx'
import { Form } from 'ant-design-vue'
import { defineComponent, reactive, ref, h, createVNode } from 'vue'
import { Icon } from '@/utils/icon.ts'
import { useFormModal } from '@/hooks/formModal'
import { DownOutlined, SettingOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { getFormSchema } from './form-schema'
import { Divider, Menu, Dropdown, message, Modal } from 'ant-design-vue'
import { ColumnProps } from 'ant-design-vue/es/table/interface'
import * as api from '../service'

const useForm = Form.useForm

export default defineComponent({
  name: 'RoleList',
  components: {
    STable,
    DownOutlined,
    SettingOutlined,
    ExclamationCircleOutlined,
    Icon
  },
  setup(props) {
    const Ref = ref(null)
    const state = reactive({
      visible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      data: [{ id: 0, name: 'test', status: 1, createTime: '2021-01-09' }],
      //   form: this.$form.createForm(this),
      permissions: [],

      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {}
      // 加载数据方法 必须为 Promise 对象
    })
    // 表头
    const columns: ColumnProps[] = [
      {
        title: '唯一识别码',
        dataIndex: 'id'
      },
      {
        title: '角色名称',
        dataIndex: 'name'
      },
      {
        title: '备注',
        dataIndex: 'describe'
      },
      {
        title: '创建时间',
        dataIndex: 'created_at'
      },
      {
        title: '操作',
        width: '150px',
        dataIndex: 'action',
        customRender: (row) => {
          return h(
            'span',
            {},
            h('a', { onClick: () => setAuth(row.record) }, '设置权限'),
            h('a', { onClick: () => handleEdit(row.record) }, '编辑'),
            h(Divider, { type: 'vertical' }),
            h('a', { onClick: () => handleDelete(row.record) }, '删除')
          )
        }
      }
    ]

    const rulesRef = reactive({
      name: [
        {
          required: true,
          message: 'Please input Activity name'
        },
        {
          min: 3,
          max: 5,
          message: 'Length should be 3 to 5',
          trigger: 'blur'
        }
      ],
      region: [
        {
          required: true,
          message: 'Please select region'
        }
      ]
    })

    // getServiceList().then((res) => {
    //   console.log('getServiceList.call()', res)
    // })
    // 获取角色列表
    const loadData = (parameter) => {
      const param = Object.assign(parameter, state.queryParam)
      return api.getRoleList().then((res) => {
        return res
      })
    }
    // 编辑
    const handleEdit = (record) => {
      const fields = record
      useFormModal({
        title: '编辑角色',
        fields,
        formSchema: getFormSchema(),
        handleOk: async (modelRef) => {
          const { name, describe } = modelRef
          const params = {
            name,
            describe
          }
          const { code } = await api.editRole(fields.id, params)
          if (code === 200200) {
            message.success('编辑成功！')
            Ref.value.refresh()
          }
        }
      })
    }
    // 删除
    const handleDelete = (row) => {
      Modal.confirm({
        title: () => '提示',
        content: () => '确认执行删除此操作？',
        icon: () => createVNode(ExclamationCircleOutlined),
        okText: () => '确认',
        closable: true,
        cancelText: () => '取消',
        onOk: async () => {
          const { code } = await api.deleteRole(row.id)
          if (code === 200200) {
            message.success('删除成功！')
            Ref.value.refresh()
          }
          Modal.destroyAll()
        },
        onCancel: () => {
          Modal.destroyAll()
        }
      })
    }
    const setAuth = () => {}
    // const onChange = (selectedRowKeys, selectedRows) => {
    //   state.selectedRowKeys = selectedRowKeys
    //   state.selectedRows = selectedRows
    // }
    const handleExpand = (expanded, record) => {
      //   console.log('expanded', expanded, record)
      //   if (expanded) {
      //     state.expandedRowKeys.push(record.id)
      //   } else {
      //     state.expandedRowKeys = state.expandedRowKeys.filter((item) => record.id !== item)
      //   }
    }
    const add = () => {
      useFormModal({
        title: '创建角色',
        formSchema: getFormSchema(),
        handleOk: async (modelRef) => {
          const { name, describe } = modelRef
          const params = {
            name,
            describe
          }
          const { code } = await api.addRole(params)
          if (code === 200200) {
            Ref.value.refresh()
            message.success('创建成功！')
          }
        }
      })
    }
    const toggleAdvanced = () => {
      state.advanced = !state.advanced
    }
    return {
      state,
      Ref,
      handleExpand,
      toggleAdvanced,
      handleEdit,
      add,
      columns,
      loadData
    }
  }
})
</script>

<style lang="less" scoped>
.permission-form {
  &:deep(.permission-group) {
    margin-top: 0;
    margin-bottom: 0;
  }
}
</style>
