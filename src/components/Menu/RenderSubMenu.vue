<template>
  <a-sub-menu
    class="smenu"
    v-if="menu.children && !menu.hideChildrenInMenu"
    :key="menu.path"
    popupClassName="popupSubMenu"
  >
    <template #icon>
      <SvgIcon :name="menu.meta.icon" v-if="menu.meta.icon" />
    </template>
    <template #title>{{ $t(menu.meta.title) }}</template>
    <template v-if="!menu.hideChildrenInMenu">
      <template v-for="sub in menu.children">
        <!-- 递归组件 -->
        <RenderSubMenu :menu="sub" />
      </template>
    </template>
  </a-sub-menu>
  <a-menu-item :key="menu.path" v-else-if="!menu.meta.hidden">
    <template #icon>
      <SvgIcon :name="menu.meta.icon" v-if="menu.meta.icon" />
    </template>
    <!-- 外部链接 -->
    <a
      v-if="menu.meta.target"
      :href="menu.meta.target"
      :target="menu.meta.blank === false ? '' : '_blank'"
    >
      <!-- span重复了吧?这就是template的弊端,jsx才是王道 -->
      <span>{{ $t(menu.meta.title) }}</span>
    </a>
    <router-link :to="filterParams(menu.path)" v-else>
      <span>{{ $t(menu.meta.title) }}</span>
    </router-link>
  </a-menu-item>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'

export default defineComponent({
  name: 'RenderSubMenu',
  props: ['menu'],
  components: {
    SvgIcon
  },
  setup(prop) {
    // info:todo:貌似没用
    if (prop.menu.children && prop.menu.hideChildrenInMenu) {
      // 把有子菜单的 并且 父菜单是要隐藏子菜单的
      // 都给子菜单增加一个 hidden 属性
      // 用来给刷新页面时， selectedKeys 做控制用
      prop.menu.children.forEach((item) => {
        item.meta = Object.assign(item.meta, { hidden: true })
      })
    }

    // info:todo:目前没有发现需要入口带参数的情况,一般这种跳转的都是二级页面,是从其他页面跳转过来的,不需要显示在菜单中,目前菜单中是这种路径的,点击也会报404,因为没有对:pageNo([1-9]\\d*)?进行翻译,直接当做了路径去匹配,目前做法是去掉后面的参数
    const filterParams = (menu) => {
      return menu.indexOf('/:') > 0 ? menu.split('/:')[0] : menu
    }
    return {
      filterParams
    }
  }
})
</script>
<style lang="less" scoped>
@import '../../style/index.less';
.smenu {
  &.ant-menu-submenu-open,
  &.ant-menu-submenu-open .ant-menu-item-selected {
    svg {
      &:last-of-type {
        fill: @primary-color;
      }
    }
  }
}
.ant-menu-submenu {
  svg {
    &:last-of-type {
      fill: rgba(255, 255, 255, 0.65);
    }
  }

  &.ant-menu-submenu-active,
  &.ant-menu-submenu-selected {
    svg {
      &:last-of-type {
        fill: #fff;
      }
    }
  }
}
.ant-menu-dark {
  .smenu {
    &.ant-menu-submenu-open,
    &.ant-menu-submenu-open .ant-menu-item-selected,
    &.ant-menu-submenu-open {
      svg {
        &:last-of-type {
          fill: #fff;
        }
      }
      .ant-menu-sub {
        svg {
          &:last-of-type {
            fill: rgba(255, 255, 255, 0.65);
          }
        }
      }
      .ant-menu-item-active,
      .ant-menu-item-selected {
        svg {
          &:last-of-type {
            fill: #fff;
          }
        }
      }
    }
  }
}

.menuName {
  svg,
  span {
    vertical-align: middle;
  }
  svg {
    margin-right: 10px;
    &:last-of-type {
      fill: rgba(255, 255, 255, 0.65);
    }
  }
}
</style>
