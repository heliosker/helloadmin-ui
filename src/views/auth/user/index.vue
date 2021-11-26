<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="角色ID">
              <a-input placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="状态">
              <a-select placeholder="请选择" default-value="0">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">关闭</a-select-option>
                <a-select-option value="2">运行中</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="(!state.advanced && 8) || 24" :sm="24">
            <span
              class="table-page-search-submitButtons"
              :style="(state.advanced && { float: 'right', overflow: 'hidden' }) || {}"
            >
              <a-button type="primary" @click="Ref.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => (state.queryParam = {})"
                >重置</a-button
              >
              <a @click="toggleAdvanced" style="margin-left: 8px">
                {{ state.advanced ? '收起' : '展开' }}
                <Icon :icon="state.advanced ? 'UpOutlined' : 'DownOutlined'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <s-table
      row-key="id"
      ref="Ref"
      size="default"
      :columns="state.columns"
      :data="loadData"
      :expandedRowKeys="state.expandedRowKeys"
      @expand="handleExpand"
      @add="add"
    >
      <!-- <template #action="{ record }">
        <a>{{ record }}</a>
      </template> -->
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
      </div>
      <a-tag color="blue" slot="status" slot-scope="text">{{ text | statusFilter }}</a-tag>
      <span slot="createTime" slot-scope="text">{{ text | moment }}</span>
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
      </span> -->
    </s-table>
    <!-- <a-modal title="操作" style="top: 20px" :width="800" v-model="state.visible" @ok="handleOk">
      <a-form class="permission-form">
        <a-form-item
          :labelCol="state.labelCol"
          :wrapperCol="state.wrapperCol"
          v-bind="validateInfos.id"
          label="唯一识别码"
          hasFeedback
          validateStatus="success"
        >
          <a-input placeholder="唯一识别码" disabled="disabled" />
        </a-form-item>

        <a-form-item
          :labelCol="state.labelCol"
          :wrapperCol="state.wrapperCol"
          label="角色名称"
          hasFeedback
          v-bind="validateInfos.name"
          validateStatus="success"
        >
          <a-input placeholder="起一个名字" />
        </a-form-item>

        <a-form-item
          :labelCol="statelabelCol"
          :wrapperCol="state.wrapperCol"
          label="状态"
          hasFeedback
          v-bind="validateInfos.status"
          validateStatus="warning"
        >
          <a-select>
            <a-select-option :value="1">正常</a-select-option>
            <a-select-option :value="2">禁用</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          :labelCol="state.labelCol"
          :wrapperCol="wrapperCol"
          label="描述"
          v-bind="validateInfos.describe"
          hasFeedback
        >
          <a-textarea :rows="5" placeholder="..." id="describe" />
        </a-form-item>

        <a-divider>拥有权限</a-divider>
        <template v-for="permission in state.permissions">
          <a-form-item
            class="permission-group"
            v-if="permission.actionsOptions && permission.actionsOptions.length > 0"
            :labelCol="state.labelCol"
            :wrapperCol="state.wrapperCol"
            :key="permission.permissionId"
            :label="permission.permissionName"
            v-bind="[`validateInfos.permissions${permission.permissionId}`]"
          >
            <a-checkbox>全选</a-checkbox>
            <a-checkbox-group :options="permission.actionsOptions" />
          </a-form-item>
        </template>
      </a-form>
    </a-modal> -->
  </a-card>
</template>

<script lang="ts">
import pick from 'lodash.pick'
import STable from '@/components/table/index.tsx'
import { Form } from 'ant-design-vue'
// import { PERMISSION_ENUM } from '@/core/permission/permission'
import { defineComponent, reactive, ref, h } from 'vue'
import { Icon } from '@/utils/icon.ts'
import { DownOutlined, SettingOutlined } from '@ant-design/icons-vue'
import { formDrawer } from '@/hooks/formDrawer'
import { DownOutlined, SettingOutlined } from '@ant-design/icons-vue'
import { ColumnProps } from 'ant-design-vue/es/table/interface'
import { getFormSchema } from './form-schema'
import { Divider, Menu, Dropdown, message, Modal } from 'ant-design-vue'
import * as api from '../service'
const MenuItem = Menu.Item
const status = [
  { key: 0, value: '正常' },
  { key: 1, value: '锁定' }
]
const useForm = Form.useForm

export default defineComponent({
  name: 'UserList',
  components: {
    STable,
    DownOutlined,
    Divider,
    Menu,
    Dropdown,
    // UpOutlined,
    SettingOutlined,
    Icon
  },
  setup(props) {
    const Ref = ref(null)
    const columns: ColumnProps[] = [
      {
        title: '唯一识别码',
        dataIndex: 'id'
      },
      {
        title: '用户名称',
        dataIndex: 'username'
      },
      {
        title: '头像',
        dataIndex: 'avatar'
      },
      {
        title: '状态',
        dataIndex: 'status',
        customRender: ({ text }) => {
          return status.filter((v) => v.key === text)[0].value
        }
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        slots: { customRender: 'created_at' },
        sorter: true
      },
      {
        title: '操作',
        width: '150px',
        dataIndex: 'action',
        customRender: (row) => {
          return h(
            'span',
            {},
            h('a', { onClick: () => handleEdit(row.record) }, '编辑'),
            h(Divider, { type: 'vertical' }),
            h('a', { onClick: () => handleDelete(row.record) }, '删除')
          )
        }
      }
    ]
    const state = reactive({
      description:
        '列表使用场景：后台管理中的权限管理以及角色管理，可用于基于 RBAC 设计的角色权限控制，颗粒度细到每一个操作类型。',
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
      permissions: [],
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {}
    })
    const modelRef = reactive({
      id: '',
      status: '',
      describe: '',
      name: ''
    })
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

    // getRoleList().then((res) => {
    //   console.log('getRoleList.call()', res)
    // })
    const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef)
    // 编辑
    const handleEdit = (record) => {
      const fields = record
      formDrawer({
        title: '编辑用户',
        fields,
        formSchema: getFormSchema(),
        handleOk: async (modelRef) => {
          const { avater, username, email, role_id, status } = modelRef
          const params = {
            avater,
            username,
            email,
            role_id,
            status
          }
          const { code } = await api.editUser(fields.id, params)
          if (code === 200200) {
            message.success('编辑成功！')
            Ref.value.refresh()
          }
        }
      })
    }
    // 删除
    const handleDelete = (row) => {
      Modal.warning({
        title: () => '提示',
        content: () => '确认执行删除此操作？',
        okText: '确认',
        onOk: async () => {
          const { code } = await api.deleteUser(row.id)
          if (code === 200200) {
            message.success('删除成功！')
            Ref.value.refresh()
          }
          Modal.destroyAll()
        }
      })
    }
    const handleOk = (e) => {
      e.preventDefault()
      //   validate().then(() => {
      //     consol.log('da')
      //   }
      //   )
    }
    const loadData = (parameter) => {
      const param = Object.assign(parameter, state.queryParam)
      return api.getUserList().then((res) => {
        // 展开全部行
        if (res.data) state.expandedRowKeys = res.data.map((item) => item.id)
        return res
      })
    }
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
      formDrawer({
        title: '创建用户',
        formSchema: getFormSchema(),
        handleOk: async (modelRef) => {
          const { avater, username, email, role_id, status } = modelRef
          const params = {
            avater,
            username,
            email,
            role_id,
            status
          }
          const data = await api.addUser(params)
          if (data.code === 200200) {
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
      handleOk,
      handleExpand,
      toggleAdvanced,
      handleEdit,
      handleDelete,
      columns,
      add,
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
