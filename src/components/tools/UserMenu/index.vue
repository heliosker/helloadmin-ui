<template>
  <div class="user-wrapper">
    <div class="content-box">
      <span class="action">
        <FullscreenExitOutlined v-if="state.fullscreen" @click="handleFullScreen" />
        <FullscreenOutlined v-else @click="handleFullScreen" />
      </span>
      <notice-icon class="action" />
      <a-dropdown>
        <span class="action ant-dropdown-link user-dropdown-menu">
          <a-avatar class="avatar" size="small" :src="avatar" />
          <span class="nickname">{{ nickname }}</span>
        </span>
        <template #overlay>
          <a-menu class="user-dropdown-menu-wrapper">
            <!-- <a-menu-item key="0">
            <router-link :to="{ name: 'center' }">
              <a-icon type="user" />
              <span>个人中心</span>
            </router-link>
            </a-menu-item>-->
            <!-- <a-menu-item key="1">
            <router-link :to="{ name: 'settings' }">
              <a-icon type="setting" />
              <span>账户设置</span>
            </router-link>
            </a-menu-item>-->
            <a-menu-item key="4" @click="showSystemSetting">
              <a>
                <SettingOutlined />
                <span>{{ $t('tools.userMenu.systemConfig') }}</span>
              </a>
            </a-menu-item>
            <!-- <a-menu-item key="2" disabled>
              <SettingOutlined />
              <span>{{ $t('tools.userMenu.test') }}</span>
            </a-menu-item>-->
            <a-menu-divider />
            <a-menu-item key="3">
              <a href="javascript:;" @click="handleLogout">
                <LogoutOutlined />
                <span>{{ $t('tools.userMenu.logout') }}</span>
              </a>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
      <span style="overflow: hidden; display: inline-block">
        <SelectLang :class="theme" class="action" />
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import NoticeIcon from '@/components/NoticeIcon/index.vue'
import { logout } from '@/views/user/service'
import { USER_INFO } from '@/store/mutation-types'
import { Modal } from 'ant-design-vue'
import {
  QuestionCircleOutlined,
  SettingOutlined,
  LogoutOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined
} from '@ant-design/icons-vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import SelectLang from '@/components/SelectLang'
import ls from '@/utils/Storage'
import { useRouter } from 'vue-router'
import { clearUserInfo } from '@/utils/util'

export default defineComponent({
  name: 'UserMenu',
  props: ['theme'],
  components: {
    NoticeIcon,
    QuestionCircleOutlined,
    SettingOutlined,
    LogoutOutlined,
    SelectLang,
    FullscreenExitOutlined,
    FullscreenOutlined
  },
  setup(props) {
    const { t } = useI18n()
    const router = useRouter()
    const UserInfo = ls.get(USER_INFO)
    const store = useStore()
    const state = reactive({
      fullscreen: false
    })
    // 全屏设置
    const handleFullScreen = () => {
      let element: any = document.documentElement
      let doc: any = document
      if (state.fullscreen) {
        if (doc.exitFullscreen) {
          doc.exitFullscreen()
        } else if (doc.webkitCancelFullScreen) {
          doc.webkitCancelFullScreen()
        } else if (doc.mozCancelFullScreen) {
          doc.mozCancelFullScreen()
        } else if (doc.msExitFullscreen) {
          doc.msExitFullscreen()
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen()
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen()
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen()
        }
      }
      state.fullscreen = !state.fullscreen
    }
    const handleLogout = () => {
      Modal.confirm({
        title: t('tools.userMenu.tip'),
        content: t('tools.userMenu.checkLogout'),
        onOk: () => {
          logout().then((res) => {
            clearUserInfo()
            router.push({ path: '/user/login' })
          })
        },
        onCancel() {}
      })
    }
    const showSystemSetting = () => {
      store.commit('SET_SETTING_DRAWER', true)
    }

    return {
      state,
      avatar: UserInfo.avatar,
      nickname: UserInfo.name,
      handleFullScreen,
      handleLogout,
      showSystemSetting
    }
  }
})
</script>
<style lang="less">
.user-dropdown-menu-wrapper {
  .ant-dropdown-menu-item {
    width: 100% !important;
  }
}
.user-wrapper {
  .action {
    .anticon {
      vertical-align: middle;
    }
  }
}
</style>
