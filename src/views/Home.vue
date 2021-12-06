<template>
  <div>
    <a-row :gutter="24">
      <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '24px' }">
        <chart-card
          :loading="state.loading"
          :icon="'UserAddOutlined'"
          :background="'#3283fc'"
          :title="$t('user.dashboard.analysis.addCustomer')"
          total="23,560"
        >
          <div>
            <div>较上月</div>
            <div class="percentage">23%</div>
          </div>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '24px' }">
        <chart-card
          :loading="state.loading"
          :icon="'CoffeeOutlined'"
          :background="'#4A5DFB'"
          :title="$t('user.dashboard.analysis.money')"
          total="￥126,560"
        >
          <div>
            <div>较上月</div>
            <div class="percentage">12%</div>
          </div>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '24px' }">
        <chart-card
          :loading="state.loading"
          :icon="'GithubOutlined'"
          :background="'#F79323'"
          :title="$t('user.dashboard.analysis.concerned')"
          total="326,560"
        >
          <div>
            <div>较上月</div>
            <div class="percentage">22%</div>
          </div>
        </chart-card>
      </a-col>
    </a-row>
    <a-card :bordered="false" :body-style="{ padding: '0' }">
      <div class="card_content">
        <div class="title">快速入口</div>
        <a-row :gutter="24" type="flex" justify="space-between">
          <a-col
            v-for="(item, index) in state.card_data"
            :sm="12"
            :md="6"
            :xl="4"
            :style="{ marginBottom: '14px', textAlign: 'center' }"
          >
            <div class="card">
              <Icon :icon="item.icon"></Icon>
            </div>
            <span class="card_title">{{ item.title }}</span>
          </a-col>
        </a-row>
      </div>
    </a-card>
    <a-card :bordered="false" :body-style="{ padding: '0' }">
      <div class="card_content">
        <div class="title">访问统计</div>
        <Column :data="state.barData" :title="''" />
      </div>
    </a-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { useStore } from 'vuex'
import ChartCard from '@/components/Chart/ChartCard.vue'
import { Icon } from '@/utils/icon.ts'
import Column from '@/components/Chart/Column.vue'

export default defineComponent({
  name: 'Home',
  components: {
    ChartCard,
    Column,
    Icon
  },
  setup() {
    const store = useStore()
    const state = reactive({
      loading: false,
      card_data: [
        {
          title: '用户管理',
          icon: 'UserOutlined',
          color: '#',
          background: '#',
          url: '/'
        },
        {
          title: '菜单管理',
          icon: 'MenuUnfoldOutlined',
          color: '#',
          background: '#',
          url: '/'
        },
        {
          title: '表单生成',
          icon: 'FormOutlined',
          color: '#',
          background: '#',
          url: '/'
        },
        {
          title: '仓库地址',
          icon: 'GithubOutlined',
          color: '#',
          background: '#',
          url: '/'
        },
        {
          title: '关于我们',
          icon: 'BulbOutlined',
          color: '#',
          background: '#',
          url: '/'
        }
      ],
      barData: []
    })
    for (let i = 0; i < 12; i += 1) {
      state.barData.push({
        x: `${i + 1}月`,
        y: Math.floor(Math.random() * 1000) + 200
      })
    }
    return {
      store,
      state
    }
  }
})
</script>

<style scoped lang="less">
.Home {
  height: 200vh;
}
.card_content {
  padding: 10px 14px;
  border-radius: 5px;
  .title {
    font-size: 18px;
    padding-bottom: 14px;
  }
  .card {
    width: 60px;
    height: 60px;
    background: #cef4f2;
    border-radius: 8px;
    line-height: 60px;
    text-align: center;
    margin: 0 auto;
    cursor: pointer;
    transition: all 0.3s;
    &:hover {
      transform: scale(1.08);
    }
    .anticon {
      font-size: 30px;
      margin-top: 15px;
      color: #6bcfb0;
    }
  }
  .ant-col {
    &:nth-child(2) {
      .card {
        background: #fef3d1;
        .anticon {
          color: #f79323;
        }
      }
    }
    &:nth-child(3) {
      .card {
        background: #e8d8f9;
        .anticon {
          color: #ad5cff;
        }
      }
    }
    &:nth-child(4) {
      .card {
        background: #c3dbed;
        .anticon {
          color: #3283fc;
        }
      }
    }
    &:nth-child(5) {
      .card {
        background: #fcdaec;
        .anticon {
          color: #ee76b6;
        }
      }
    }
  }
  .card_title {
    padding-top: 10px;
    display: inline-block;
  }
}
.percentage {
  line-height: 38px;
  margin-top: 4px;
  color: #38ba4a;
}
</style>
