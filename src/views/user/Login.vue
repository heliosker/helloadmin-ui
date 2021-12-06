<template>
  <div class="main">
    <a-form id="formLogin" class="user-layout-login" @submit="handleSubmit" :model="formRef">
      <a-tabs
        :activeKey="customActiveKey"
        :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }"
        @change="handleTabClick"
      >
        <!-- 账户密码登录 -->
        <a-tab-pane key="tab1" :tab="$t('user.login.tab-login-credentials')">
          <a-alert
            v-if="isLoginError"
            type="error"
            showIcon
            style="margin-bottom: 24px"
            :message="$t('user.login.message-invalid-credentials')"
          />
          <a-form-item v-bind="validateInfos.username">
            <a-input
              size="large"
              type="text"
              :placeholder="$t('user.login.username.placeholder')"
              v-model:value="formRef.username"
            >
              <template #prefix>
                <UserOutlined class="login-icon" />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item v-bind="validateInfos.password">
            <a-input-password
              size="large"
              :placeholder="$t('user.login.password.placeholder')"
              v-model:value="formRef.password"
            >
              <template #prefix>
                <LockOutlined class="login-icon" />
              </template>
            </a-input-password>
          </a-form-item>
        </a-tab-pane>
        <!-- 手机号登录 -->
        <!-- <a-tab-pane key="tab2" :tab="$t('user.login.tab-login-mobile')">
          <a-form-item v-bind="validateInfos.mobile">
            <a-input
              size="large"
              type="text"
              :placeholder="$t('user.login.mobile.placeholder')"
              v-model:value="formRef.mobile"
            >
              <MobileOutlined :style="{ color: 'rgba(0,0,0,.25)' }" />
            </a-input>
          </a-form-item>

          <a-row :gutter="16">
            <a-col class="gutter-row" :span="16">
              <a-form-item v-bind="validateInfos.captcha">
                <a-input
                  size="large"
                  type="text"
                  :placeholder="$t('user.login.mobile.verification-code.placeholder')"
                  v-model:value="formRef.captcha"
                >
                  <MailOutlined :style="{ color: 'rgba(0,0,0,.25)' }" />
                </a-input>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" :span="8">
              <a-button
                class="getCaptcha"
                tabindex="-1"
                :disabled="state.smsSendBtn"
                @click.stop.prevent="getCaptcha"
              >
                {{
                (!state.smsSendBtn && $t("user.register.get-verification-code")) ||
                state.time + " s"
                }}
              </a-button>
            </a-col>
          </a-row>
        </a-tab-pane> -->
      </a-tabs>

      <a-form-item v-bind="validateInfos.rememberMe">
        <a-checkbox v-model:checked="formRef.rememberMe" style="float: left">
          {{ $t('user.login.remember-me') }}
        </a-checkbox>
        <router-link
          :to="{ name: 'recover', params: { user: 'aaa' } }"
          class="forge-password"
          style="float: right"
          >{{ $t('user.login.forgot-password') }}</router-link
        >
      </a-form-item>

      <a-form-item style="margin-top: 24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="state.loginBtn"
          :disabled="state.loginBtn"
          >{{ $t('user.login.login') }}</a-button
        >
      </a-form-item>

      <!-- <div class="user-login-other">
        <span>{{ $t('user.login.sign-in-with') }}</span>
        <a>
          <AlipayCircleOutlined />
        </a>
        <a>
          <TaobaoCircleOutlined />
        </a>
        <a>
          <WeiboCircleOutlined />
        </a>
        <router-link class="register" :to="{ name: 'register' }">
          {{ $t('user.login.signup') }}
        </router-link>
      </div> -->
    </a-form>

    <!-- <two-step-captcha
      v-if="requiredTwoStepCaptcha"
      :visible="stepCaptchaVisible"
      @success="stepCaptchaSuccess"
      @cancel="stepCaptchaCancel"
    ></two-step-captcha>-->
  </div>
</template>

<script lang="ts">
// import TwoStepCaptcha from '@/components/tools/TwoStepCaptcha.vue';
import { encryptByMd5 } from '@/utils/encrypt'
import { defineComponent, ref, reactive, UnwrapRef, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Form } from 'ant-design-vue'
import { loginSuccess, requestFailed } from './helper'
import { useRouter } from 'vue-router'
import {
  MobileOutlined,
  MailOutlined,
  AlipayCircleOutlined,
  TaobaoCircleOutlined,
  WeiboCircleOutlined,
  UserOutlined,
  LockOutlined
} from '@ant-design/icons-vue'
import * as api from './service'
import { FormState } from './types'
import config from '@/config/defaultSettings'
import generateAsyncRoutes from '@/router/generateAsyncRoutes'
import { useGetCaptcha } from './helper'

export default defineComponent({
  components: {
    // TwoStepCaptcha,
    MobileOutlined,
    UserOutlined,
    MailOutlined,
    AlipayCircleOutlined,
    TaobaoCircleOutlined,
    WeiboCircleOutlined,
    LockOutlined
  },
  setup() {
    const useForm = Form.useForm
    const { t } = useI18n()
    const router = useRouter()

    onMounted(() => {
      //   api
      //     .get2step()
      //     .then((res) => {
      //       requiredTwoStepCaptcha.value = res.result.stepCode
      //     })
      //     .catch(() => {
      //       requiredTwoStepCaptcha.value = 0
      //     })
      //   requiredTwoStepCaptcha.value = 1
    })

    const state = reactive({
      time: 60,
      loginBtn: false,
      // login type: 0 email, 1 username, 2 telephone
      loginType: 0,
      smsSendBtn: false
    })

    // #region 表单相关
    const formRef: UnwrapRef<FormState> = reactive({
      //   rememberMe: false,
      username: '',
      password: ''
    })

    const handleUsernameOrEmail = (rule, value: string) => {
      const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
      if (regex.test(value)) {
        state.loginType = 0
      } else {
        state.loginType = 1
      }
      return Promise.resolve()
    }
    const rulesRef = reactive({
      rememberMe: [{ trigger: 'checked' }],
      username: [
        {
          required: true,
          message: t('user.email.required')
        },
        {
          validator: handleUsernameOrEmail,
          trigger: 'change'
        }
      ],
      password: [{ required: true, message: t('user.password.required') }, {}],
      mobile: [
        {
          required: true,
          pattern: /^1[34578]\d{9}$/,
          message: t('user.login.mobile.placeholder'),
          validateTrigger: 'change'
        }
      ],
      captcha: [
        {
          required: true,
          message: t('user.verification-code.required'),
          validateTrigger: 'blur'
        }
      ]
    })
    const { validate, validateInfos } = useForm(formRef, rulesRef)
    const isLoginError = ref(false)
    const handleSubmit = (e: Event) => {
      e.preventDefault()
      state.loginBtn = true
      const validateFieldsKey =
        customActiveKey.value === 'tab1' ? ['username', 'password'] : ['mobile', 'captcha']

      validate(validateFieldsKey)
        .then(async () => {
          //   formRef.password = encryptByMd5(formRef.password)
          const res = await api.login(formRef)
          if (res) {
            // mock用,可删
            if (res.code === 403) {
              isLoginError.value = true
              formRef.password = ''
              state.loginBtn = false
              return
            }
            if (config.useAsyncRouter) {
              const menu = [
                {
                  name: 'dashboard',
                  parent_id: 0,
                  id: 1,
                  meta: {
                    icon: 'dashboard',
                    title: '仪表盘',
                    show: true
                  },
                  component: 'RouteView',
                  redirect: '/dashboard/workplace'
                },
                {
                  name: 'workplace',
                  parent_id: 1,
                  id: 7,
                  meta: {
                    title: '工作台',
                    show: true
                  },
                  component: 'Workplace'
                },
                {
                  name: 'monitor',
                  path: 'monitor',
                  parent_id: 1,
                  id: 3,
                  meta: {
                    title: '监控页（外部）',
                    show: true,
                    target: 'http://www.baidu.com',
                    blank: true
                  }
                },
                {
                  name: 'Analysis',
                  parent_id: 1,
                  id: 2,
                  meta: {
                    title: '分析页',
                    show: true
                  },
                  component: 'Analysis',
                  path: '/dashboard/analysis'
                },
                {
                  name: 'tests',
                  parent_id: 1,
                  id: 8,
                  meta: {
                    title: '测试功能',
                    show: true
                  },
                  component: 'TestWork'
                },
                {
                  name: 'form',
                  parent_id: 0,
                  id: 10,
                  meta: {
                    icon: 'form',
                    title: '表单页'
                  },
                  redirect: '/form/base-form',
                  component: 'PageView'
                },
                {
                  name: 'basic-form',
                  parent_id: 10,
                  id: 6,
                  meta: {
                    title: '基础表单'
                  },
                  component: 'BasicForm'
                },
                {
                  name: 'step-form',
                  parent_id: 10,
                  id: 5,
                  meta: {
                    title: '分步表单'
                  },
                  component: 'StepForm'
                },
                {
                  name: 'advanced-form',
                  parent_id: 10,
                  id: 4,
                  meta: {
                    title: '高级表单'
                  },
                  component: 'AdvanceForm'
                },
                {
                  name: 'list',
                  parent_id: 0,
                  id: 10010,
                  meta: {
                    icon: 'table',
                    title: '列表页',
                    show: true
                  },
                  redirect: '/list/table-list',
                  component: 'PageView'
                },
                {
                  name: 'table-list',
                  parent_id: 10010,
                  id: 10011,
                  path: '/list/table-list/:pageNo([1-9]\\d*)?',
                  meta: {
                    title: '查询表格',
                    show: true
                  },
                  component: 'TableList'
                },
                {
                  name: 'basic-list',
                  parent_id: 10010,
                  id: 10012,
                  meta: {
                    title: '标准列表',
                    show: true
                  },
                  component: 'StandardList'
                },
                {
                  name: 'card',
                  parent_id: 10010,
                  id: 10013,
                  meta: {
                    title: '卡片列表',
                    show: true
                  },
                  component: 'CardList'
                },
                {
                  name: 'search',
                  parent_id: 10010,
                  id: 10014,
                  meta: {
                    title: '搜索列表',
                    show: true
                  },
                  redirect: '/list/search/article',
                  component: 'SearchLayout'
                },
                {
                  name: 'article',
                  parent_id: 10014,
                  id: 10015,
                  meta: {
                    title: '搜索列表（文章）',
                    show: true
                  },
                  component: 'SearchArticles'
                },
                {
                  name: 'project',
                  parent_id: 10014,
                  id: 10016,
                  meta: {
                    title: '搜索列表（项目）',
                    show: true
                  },
                  component: 'SearchProjects'
                },
                {
                  name: 'application',
                  parent_id: 10014,
                  id: 10017,
                  meta: {
                    title: '搜索列表（应用）',
                    show: true
                  },
                  component: 'SearchApplications'
                },
                {
                  name: 'profile',
                  parent_id: 0,
                  id: 10018,
                  meta: {
                    title: '详情页',
                    icon: 'profile',
                    show: true
                  },
                  redirect: '/profile/basic',
                  component: 'RouteView'
                },
                {
                  name: 'basic',
                  parent_id: 10018,
                  id: 10019,
                  meta: {
                    title: '基础详情页',
                    show: true
                  },
                  component: 'ProfileBasic'
                },
                {
                  name: 'advanced',
                  parent_id: 10018,
                  id: 10020,
                  meta: {
                    title: '高级详情页',
                    show: true
                  },
                  component: 'ProfileAdvanced'
                },
                {
                  name: 'result',
                  parent_id: 0,
                  id: 10021,
                  meta: {
                    title: '结果页',
                    icon: 'check-circle-o',
                    show: true
                  },
                  redirect: '/result/success',
                  component: 'PageView'
                },
                {
                  name: 'success',
                  parent_id: 10021,
                  id: 10022,
                  meta: {
                    title: '成功',
                    hiddenHeaderContent: true,
                    show: true
                  },
                  component: 'ResultSuccess'
                },
                {
                  name: 'fail',
                  parent_id: 10021,
                  id: 10023,
                  meta: {
                    title: '失败',
                    hiddenHeaderContent: true,
                    show: true
                  },
                  component: 'ResultFail'
                },
                {
                  name: 'exception',
                  parent_id: 0,
                  id: 10024,
                  meta: {
                    title: '异常页',
                    icon: 'warning',
                    show: true
                  },
                  redirect: '/exception/403',
                  component: 'RouteView'
                },
                {
                  name: '403',
                  parent_id: 10024,
                  id: 10025,
                  meta: {
                    title: '403',
                    show: true
                  },
                  component: 'Exception403'
                },
                {
                  name: '404',
                  parent_id: 10024,
                  id: 10026,
                  meta: {
                    title: '404',
                    show: true
                  },
                  component: 'Exception404'
                },
                {
                  name: '500',
                  parent_id: 10024,
                  id: 10027,
                  meta: {
                    title: '500',
                    show: true
                  },
                  component: 'Exception500'
                },
                {
                  name: 'account',
                  parent_id: 0,
                  id: 10028,
                  meta: {
                    title: '个人页',
                    icon: 'user',
                    show: true
                  },
                  redirect: '/account/center',
                  component: 'RouteView'
                },
                {
                  name: 'center',
                  parent_id: 10028,
                  id: 10029,
                  meta: {
                    title: '个人中心',
                    show: true
                  },
                  component: 'AccountCenter'
                },
                {
                  name: 'settings',
                  parent_id: 10028,
                  id: 10030,
                  meta: {
                    title: '个人设置',
                    hideHeader: true,
                    hideChildren: true,
                    show: true
                  },
                  redirect: '/account/settings/base',
                  component: 'AccountSettings'
                },
                {
                  name: 'BaseSettings',
                  path: '/account/settings/base',
                  parent_id: 10030,
                  id: 10031,
                  meta: {
                    title: '基本设置',
                    show: false
                  },
                  component: 'BaseSettings'
                },
                {
                  name: 'SecuritySettings',
                  path: '/account/settings/security',
                  parent_id: 10030,
                  id: 10032,
                  meta: {
                    title: '安全设置',
                    show: false
                  },
                  component: 'SecuritySettings'
                },
                {
                  name: 'CustomSettings',
                  path: '/account/settings/custom',
                  parent_id: 10030,
                  id: 10033,
                  meta: {
                    title: '个性化设置',
                    show: false
                  },
                  component: 'CustomSettings'
                },
                {
                  name: 'BindingSettings',
                  path: '/account/settings/binding',
                  parent_id: 10030,
                  id: 10034,
                  meta: {
                    title: '账户绑定',
                    show: false
                  },
                  component: 'BindingSettings'
                },
                {
                  name: 'NotificationSettings',
                  path: '/account/settings/notification',
                  parent_id: 10030,
                  id: 10034,
                  meta: {
                    title: '新消息通知',
                    show: false
                  },
                  component: 'NotificationSettings'
                }
              ]
              generateAsyncRoutes(router, menu)
            }
            loginSuccess(res.data, router)
            isLoginError.value = false
          } else {
            requestFailed(res)
            isLoginError.value = true
            formRef.password = ''
          }
          state.loginBtn = false
        })
        .catch((e) => {
          state.loginBtn = false
        })
    }
    // #endregion

    //#region 切换tab
    const customActiveKey = ref<string>('tab1')
    const handleTabClick = (key: string) => {
      customActiveKey.value = key
    }
    //#endregion

    //#region 获取验证码
    const getCaptcha = (e: Event) => {
      useGetCaptcha(e, validate, state, formRef, null)
    }
    //#endregion

    //#region TwoStepCaptcha暂时没用
    const requiredTwoStepCaptcha = ref<number>(0)
    const stepCaptchaVisible = ref<boolean>(false)
    const stepCaptchaSuccess = (res) => {
      loginSuccess(res, router)
    }
    const stepCaptchaCancel = () => {
      api.logout().then(() => {
        state.loginBtn = false
        stepCaptchaVisible.value = false
      })
    }
    //#endregion

    return {
      formRef,
      rulesRef,
      state,
      customActiveKey,
      isLoginError,
      requiredTwoStepCaptcha,
      stepCaptchaVisible,
      handleTabClick,
      handleSubmit,
      validateInfos,
      getCaptcha,
      stepCaptchaSuccess,
      stepCaptchaCancel
    }
  }
})
</script>

<style lang="less" scoped>
@import '../../style/index.less';

.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }
  .login-icon {
    color: @primary-color;
  }
  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .anticon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: @primary-color;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>
