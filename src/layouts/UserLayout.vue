<template>
  <div id="userLayout" :class="['user-layout-wrapper', isMobile && 'mobile']">
    <div class="container">
      <!-- <div class="user-layout-lang">
        <select-lang class="select-lang-trigger" />
      </div> -->
      <div class="user-layout-right">
        <img src="~@/assets/logo.png" alt="" />
        <div class="desc">{{ $t('user.login.system') }}</div>
        <div class="more">了解更多</div>
        <div class="footer">Copyright &copy;&nbsp;2021 HelloAdmin 技术团队出品</div>
      </div>
      <a-card class="card" :bordered="false">
        <div class="user-layout-content ant-card">
          <div class="top">
            <div class="header">
              <a href="/">
                <!-- <img src="~@/assets/icons/logo.svg" class="logo" alt="logo" /> -->
                <span class="title">HelloAdmin</span>
              </a>
            </div>
            <div class="desc"></div>
          </div>

          <router-view />
          <!--
        <div class="footer">
          <div class="links">
            <a href="_self">帮助</a>
            <a href="_self">隐私</a>
            <a href="_self">条款</a>
          </div>
          <div class="copyright">Copyright &copy;&nbsp;2021 Ones</div>
        </div> -->
        </div>
      </a-card>
    </div>
  </div>
</template>

<script lang="ts">
import SelectLang from '@/components/SelectLang'
import { isMobile } from '@/utils/device'
import { onMounted, onBeforeUnmount, defineComponent } from 'vue'

export default defineComponent({
  components: {
    SelectLang
  },
  setup() {
    onMounted(() => {
      document.body.classList.add('userLayout')
    })
    onBeforeUnmount(() => {
      document.body.classList.remove('userLayout')
    })

    return {
      isMobile
    }
  }
})
</script>

<style lang="less" scoped>
@import '@/style/index.less';
#userLayout.user-layout-wrapper {
  height: 100%;
  padding-top: 15%;

  .container {
    width: 80%;
    height: 80%;
    margin: 0 auto;
    background: #f0f2f5 url(../assets/background.svg) no-repeat 50%;
    background-size: 100%;
    //padding: 50px 0 84px;
    position: relative;

    .user-layout-lang {
      width: 100%;
      height: 40px;
      line-height: 44px;
      text-align: right;

      &:deep(.select-lang-trigger) {
        cursor: pointer;
        padding: 12px;
        margin-right: 16px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        vertical-align: middle;
      }
    }
    .user-layout-right {
      width: calc(100% - 500px);
      display: inline-block;
      height: 100%;
      padding: 20px 20px 20px 100px;
      background: url(../assets/right_background.png) no-repeat;
      background-size: 100% 100%;
      position: relative;
      z-index: 2;
      img {
        width: 80px;
      }
      .desc {
        padding-top: 160px;
        color: #fff;
      }
      .footer {
        position: absolute;
        bottom: 18px;
        text-align: center;
        color: #fff;
      }
      .more {
        background: #fff;
        color: #3a62d7;
        width: 145px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        border-radius: 20px;
        margin-top: 80px;
        cursor: pointer;
        &:hover {
          color: @primary-color;
        }
      }
      &:after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        z-index: -3;
        width: 100%;
        height: 100%;
        background-color: rgba(58, 98, 215, 0.5);
      }
    }
    .card {
      padding: 0px;
      display: inline-block;
      vertical-align: top;
      background: #fff;
      box-shadow: 0px 1px 10px 1px rgba(0, 0, 0, 0.2);
      width: 500px;
      height: 100%;
      &:deep(.ant-card-body) {
        padding: 0px;
      }
      .card-body {
        height: 100%;
      }
      .top {
        text-align: center;
        .header {
          height: 44px;
          line-height: 44px;

          .badge {
            position: absolute;
            display: inline-block;
            line-height: 1;
            vertical-align: middle;
            margin-left: -12px;
            margin-top: -10px;
            opacity: 0.8;
          }

          .logo {
            height: 44px;
            vertical-align: top;
            margin-right: 16px;
            border-style: none;
          }

          .title {
            font-size: 33px;
            color: rgba(0, 0, 0, 0.85);
            font-family: Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif;
            font-weight: 600;
            position: relative;
            top: 2px;
            font-family: unset;
          }
        }
        .desc {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.45);
          margin-top: 12px;
          margin-bottom: 40px;
        }
      }

      .main {
        min-width: 260px;
        width: 368px;
        margin: 0 auto;
      }

      .footer {
        // position: absolute;
        // width: 100%;
        // bottom: 0;
        // padding: 0 16px;
        // margin: 48px 0 24px;
        text-align: center;
        color: #fff;
        // .links {
        //   margin-bottom: 8px;
        //   font-size: 14px;
        //   a {
        //     color: rgba(0, 0, 0, 0.45);
        //     transition: all 0.3s;
        //     &:not(:last-child) {
        //       margin-right: 40px;
        //     }
        //   }
        // }
        // .copyright {
        //   color: rgba(0, 0, 0, 0.45);
        //   font-size: 14px;
        // }
      }
    }

    a {
      text-decoration: none;
    }
  }
  &.mobile {
    padding: 0px;
    .container {
      width: 100%;
      height: 100%;
      .main {
        max-width: 368px;
        width: 98% !important;
      }
      .user-layout-right {
        display: none;
      }
      .user-layout-content {
        box-shadow: none;
      }
    }
  }
}
</style>
