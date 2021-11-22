<template>
  <a-card :loading="loading" class="card" :body-style="{ padding: '10px 14px' }" :bordered="false">
    <div class="icon" :style="{ backgroundColor: background }">
      <Icon :icon="icon"></Icon>
    </div>
    <div class="chart-card-header">
      <div class="meta">
        <span class="chart-card-title">
          <slot name="title">
            {{ title }}
          </slot>
        </span>
        <span class="chart-card-action">
          <slot name="action"></slot>
        </span>
      </div>
      <div class="total">
        <slot name="total">
          <span>{{ (typeof total === 'function' && total()) || total }}</span>
        </slot>
      </div>
    </div>
    <div class="chart-card-content">
      <div class="content-fix">
        <slot></slot>
      </div>
    </div>
  </a-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Icon } from '@/utils/icon.ts'

export default defineComponent({
  name: 'ChartCard',
  components: {
    Icon
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    total: {
      type: [Function, Number, String],
      required: false,
      default: null
    },
    icon: {
      type: String,
      default: ''
    },
    background: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    }
  }
})
</script>

<style lang="scss" scoped>
.card {
  border-radius: 5px;
<<<<<<< HEAD
  ::v-deep(.ant-card-body) {
=======
  &:deep(.ant-card-body) {
>>>>>>> 448872f46b2724e09b419b5826b6690fe7607cf7
    display: flex;
    align-items: center;
  }
}
.icon {
  width: 40px;
  height: 40px;
  // background: #3283fc;
  display: inline-block;
  border-radius: 50%;
  margin-right: 10px;
  line-height: 40px;
  text-align: center;
  .anticon {
    color: #fff;
    font-size: 20px;
  }
}
.chart-card-header {
  position: relative;
  overflow: hidden;
  flex: auto;
  //   width: 100%;

  .meta {
    position: relative;
    overflow: hidden;
    width: 100%;
    // color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    line-height: 22px;
  }
}

.chart-card-action {
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0;
}

.chart-card-footer {
  border-top: 1px solid #e8e8e8;
  padding-top: 9px;
  margin-top: 8px;

  > * {
    position: relative;
  }

  .field {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
  }
}

.chart-card-content {
  margin-bottom: 12px;
  width: 50px;
  position: relative;
  height: 46px;
}

.total {
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  white-space: nowrap;
  // color: #000;
  margin-top: 4px;
  margin-bottom: 0;
  font-size: 24px;
  line-height: 38px;
  height: 38px;
}
</style>
