<template>
  <div :style="{ padding: '0 0 32px 32px' }">
    <h4 :style="{ marginBottom: '20px' }">{{ title }}</h4>
    <div id="container"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { Column } from '@antv/g2plot'

export default defineComponent({
  name: 'Column',
  props: {
    title: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: 'container'
    },
    data: {
      type: Array,
      default: []
    }
  },
  setup(props) {
    onMounted(() => {
      const data = [
        { month: '1月', sales: 38 },
        { month: '2月', sales: 52 },
        { month: '3月', sales: 61 },
        { month: '4月', sales: 145 },
        { month: '5月', sales: 48 },
        { month: '6月', sales: 40 },
        { month: '7月', sales: 46 },
        { month: '8月', sales: 78 }
      ]
      const bar = new Column('container', {
        data: data,
        xField: 'month',
        yField: 'sales',
        maxColumnWidth: 40
        // columnBackground: {
        //   style: {
        //     fill: '#08d7ff',
        //     fillOpacity: 0.25
        //   }
        // }
      })
      bar.render()
    })
  }
})
</script>
