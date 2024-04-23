<template>
  <div style="overflow-y: auto;">

    <div id="delayChart" class="charts" />
    <div id="bandChart" class="charts" />
    <el-table
      :data="tableData"
      border
      style="width:567px; margin:10px 10px 0px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);border-radius: 4px; border: 1px solid #ddd; font-size: 24px;"
    >
      <el-table-column
        prop="content"
        label="内容"
        width="190"
      />
      <el-table-column
        prop="value"
        label="数值"
        width="375"
      />
    </el-table>
  </div>
</template>
<script>
import { delayChart, bandChart } from '@/api/prototype'
import echarts from 'echarts'
export default {
  name: 'ChartView',
  props: {
    timer: {
      type: Boolean,
      default: false
    }

  },
  data() {
    return {
      chartTimer: null,
      chartOne: null,
      chartTwo: null,
      dataOne: { x: [], y: [[], []] },
      dataTwo: { x: [], y: [[], []] },
      timeOne: -1,
      timeTwo: -1,
      tableData: [{ content: '正常节点', value: '1508个' }, { content: '异常节点', value: '6个' }, { content: '节点总数', value: '1514个' }, { content: 'pcap包大小', value: '10MB' }, { content: 'pcap发包频率', value: '3包/秒' }, { content: '模型更新时间', value: '27.15分钟' }]

    }
  },
  watch: {
    timer: {
      handler(val) {
        if (val) {
          if (this.chartOne === null && this.chartTwo === null) {
            this.initCharts()
            console.log('charts initialized')
          }
          this.chartTimer = setInterval(() => {
            this.getChartData()
          }, 3000)
        } else {
          clearInterval(this.chartTimer)
          this.chartTimer = null
        }
      },
      immediate: true
    }
  },

  mounted() {
    // this.initCharts()

  },
  beforeDestroy() {
    clearInterval(this.chartTimer)
    this.chartTimer = null
  },
  methods: {
    getChartData() {
      delayChart().then(res => {
        if (res.data.xAxis.data[ res.data.xAxis.data.length - 1 ] === this.timeOne) {
          return
        }
        this.timeOne = res.data.xAxis.data[ res.data.xAxis.data.length - 1 ]
        if (this.dataOne.x.length >= 20) {
          this.dataOne.x.shift()
          this.dataOne.y[ 0 ].shift()
          this.dataOne.y[1].shift()
        }
        this.dataOne.x.push(res.data.xAxis.data[ res.data.xAxis.data.length - 1 ])
        this.dataOne.y[ 0 ].push(res.data.yAxis.lines[ 0 ].data[ res.data.yAxis.lines[ 0 ].data.length - 1 ])
        this.dataOne.y[ 1 ].push(res.data.yAxis.lines[ 1 ].data[ res.data.yAxis.lines[ 1 ].data.length - 1 ])
        this.chartOne.setOption({
          xAxis: {
            data: this.dataOne.x
          },
          series: [
            {
              data: this.dataOne.y[ 0 ]
            },
            {
              data: this.dataOne.y[ 1 ]
            }
          ]
        })
      })
      bandChart().then(res => {
        if (res.data.xAxis.data[ res.data.xAxis.data.length - 1 ] === this.timeTwo) {
          return
        }
        this.timeTwo = res.data.xAxis.data[ res.data.xAxis.data.length - 1 ]
        if (this.dataTwo.x.length >= 20) {
          this.dataTwo.x.shift()
          this.dataTwo.y[0].shift()
          this.dataTwo.y[1].shift()
        }
        this.dataTwo.x.push(res.data.xAxis.data[ res.data.xAxis.data.length - 1 ])
        this.dataTwo.y[ 0 ].push(res.data.yAxis.lines[ 0 ].data[ res.data.yAxis.lines[ 0 ].data.length - 1 ])
        this.dataTwo.y[ 1 ].push(res.data.yAxis.lines[ 1 ].data[ res.data.yAxis.lines[ 1 ].data.length - 1 ])
        this.chartTwo.setOption({
          xAxis: {
            data: this.dataTwo.x
          },
          series: [
            {
              data: this.dataTwo.y[ 0 ]
            },
            {
              data: this.dataTwo.y[ 1 ]
            }
          ]
        })
      })
    },
    initCharts() {
      const optionfirst = {
        title: {
          text: '时延对照图'
        },
        tooltip: {},
        grid: {
          left: '1%',
          right: '10%',
          bottom: '3%',
          containLabel: true
        },
        legend: {
          data: ['智能组', '对照组'],
          left: 'right',
          orient: 'vertical'
        },
        xAxis: {
          type: 'category',
          data: [],
          name: '时刻',
          axisLine: { show: true }
        },
        yAxis: { axisLine: { show: false }, name: '时延' },
        series: [
          {
            name: '智能组',
            type: 'line',
            data: [],
            itemStyle: { color: '#409EFF' },
            lineStyle: { color: '#409EFF' }
          },
          {
            name: '对照组',
            type: 'line',
            data: [],
            itemStyle: { color: '#1f2d3d' },
            lineStyle: { color: '#1f2d3d' }
          }
        ]
      }
      const optionsecond = {
        title: {
          text: '带宽对比图'
        },
        tooltip: {},
        legend: {
          data: ['智能组', '对照组'],
          left: 'right',
          orient: 'vertical'
        },
        grid: {
          left: '1%',
          right: '10%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: [],
          name: '时刻', axisLine: { lineStyle: { width: 3 }}
        },
        yAxis: { name: '带宽', axisLine: { show: false }},
        series: [
          {
            name: '智能组',
            type: 'line',
            data: [],
            itemStyle: { color: '#409EFF' },
            lineStyle: { color: '#409EFF' }
          },
          {
            name: '对照组',
            type: 'line',
            data: [],
            itemStyle: { color: '#1f2d3d' },
            lineStyle: { color: '#1f2d3d' }
          }
        ]
      }
      this.chartOne = echarts.init(document.getElementById('delayChart'))
      this.chartOne.setOption(optionfirst)
      this.chartTwo = echarts.init(document.getElementById('bandChart'))
      this.chartTwo.setOption(optionsecond)
    }
  }
}

</script>

<style lang="scss" scoped>
.charts {
  min-height: 35vh;
  min-width: 80%;
  padding: 10px;
  border: 1px solid #ddd; /* 添加边框 */
  border-radius: 4px; /* 圆角 */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* 轻微阴影 */
  margin: 10px 10px 20px 10px;
}

</style>
<style scoped>
/deep/ .el-table .el-table__row td{
  line-height: 24px;
  height: 60px;
}
</style>
