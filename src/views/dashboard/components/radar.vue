<template>
  <div
    id="radar-box"
    class="box"
  />
</template>

<script>
// echarts5新版本已经不是默认导出了,而是按需导出(函数化思想)
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core'
// 引入柱状图图表，图表后缀都为 Chart
import { RadarChart } from 'echarts/charts'
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TitleComponent,
  LegendComponent,
  TooltipComponent
} from 'echarts/components'

// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers'

// 注册必须的组件
echarts.use([
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  RadarChart,
  CanvasRenderer
])
export default {
  name: 'Radar',
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('radar-box'))
    // 绘制图表
    myChart.setOption({
      title: {
        text: '个人能力图'
      },
      // 图例 铭文
      legend: {
        data: ['平均水平', '个人能力'],
        right: 20,
        orient: 'vertical'
      },
      radar: {
        // shape: 'circle',
        indicator: [
          { name: 'Sales', max: 6500 },
          { name: 'Administration', max: 16000 },
          { name: 'Information Technology', max: 30000 },
          { name: 'Customer Support', max: 38000 },
          { name: 'Development', max: 52000 },
          { name: 'Marketing', max: 25000 }
        ]
      },
      tooltip: {},
      series: [
        {
          name: 'Budget vs spending',
          type: 'radar',
          data: [
            {
              value: [4200, 3000, 20000, 35000, 50000, 18000],
              name: '平均水平'
            },
            {
              value: [5000, 14000, 28000, 26000, 42000, 21000],
              name: '个人能力'
            }
          ]
        }
      ]
    })
  }
}
</script>
<style lang="scss" scoped>
.box {
  width: 100%;
  height: 400px;
}
</style>
