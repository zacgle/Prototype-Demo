<template>
  <div>
    <div style="display: flex">
      <div style="width: 49%; margin-left: 10px; margin-top: 16px">
        <p class="title">智能组</p>
        <video-player
          ref="player1"
          :options="playerOptions"
          class="vjs-theme-city"
          autoplay
          playsinline
          @play="onPlayerplay($event)"
          @pause="onPlayerpause($event)"
        />
      </div>
      <div
        style="
          border-right: 3px solid #efe9e9;
          width: 3px;
          height: calc(100vh - 420px);
          margin-left: 8px;
        "
      />
      <div style="width: 49%; margin-left: 10px; margin-top: 16px">
        <p class="title">对照组</p>
        <video-player
          ref="player2"
          :options="playerOptions2"
          class="vjs-theme-city"
          autoplay
        />
      </div>
    </div>
    <div
      style="
        display: flex;
        border-top: #efe9e9 3px solid;
        padding-top: 10px;
        margin: 0 7px 10px 10px;
      "
    >
      <el-card>
        <div id="chartOne" style="height: 300px" />
      </el-card>

      <el-card>
        <div id="chartTwo" style="height: 300px" />
      </el-card>

      <el-card>
        <div id="chartThree" style="height: 300px" />
      </el-card>

      <el-card>
        <div id="chartFour" style="height: 300px" />
      </el-card>
    </div>
  </div>
</template>

<script>
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
import { videoPlayer } from 'vue-video-player'
import 'videojs-contrib-hls'
import * as echarts from 'echarts'

export default {
  components: {
    videoPlayer
  },
  data() {
    return {
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
        autoplay: true, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        controls: false,
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: 'application/x-mpegURL',
            src: 'http://10.112.216.158:19356/hls/mystream.m3u8' // 这里填写你的OBS推流地址
          }
        ],
        poster: '', // 你的封面地址
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        techOrder: ['html5', 'flash'],
        controlBar: {
          durationDisplay: true
        }
      },
      playerOptions2: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
        autoplay: true, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        controls: false,
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: 'application/x-mpegURL',
            src: 'http://10.112.216.158:19356/hls/mystream_360p.m3u8' // 这里填写你的OBS推流地址
          }
        ],
        poster: '', // 你的封面地址
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        techOrder: ['html5', 'flash']
      },
      chartList: [{ name: 'chartOne', chart: null, option: null, id: 1 }, { name: 'chartTwo', chart: null, option: null, id: 2 }, { name: 'chartThree', chart: null, option: null, id: 3 }, { name: 'chartFour', chart: null, option: null, id: 4 }],
      chart1: null,
      chart2: null,
      chart3: null,
      chart4: null,
      chartOption1: {
        title: {
          text: '渲染帧率对比'
        },
        // grid: {
        //   show: true
        // },
        tooltip: {},
        legend: {
          data: ['智能组', '对照组'],
          left: 'right',
          selectedMode: true,
          orient: 'vertical'
        },
        xAxis: {
          type: 'category',
          data: [],
          smooth: true,
          name: '时刻', axisLine: { lineStyle: { width: 3 }}
        },
        yAxis: {
          name: '帧率(fps)', axisLine: { lineStyle: { width: 3 }}
        },
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
      },
      chartOption4: {
        title: {
          text: '端到端时延'
        },
        tooltip: {},
        legend: {
          data: ['智能组', '对照组'],
          left: 'right',
          orient: 'vertical'
        },
        xAxis: {
          type: 'category',
          name: '时刻',
          data: [], axisLine: { lineStyle: { width: 3 }}
        },
        yAxis: { axisLine: { lineStyle: { width: 3 }}, name: '时延(毫秒)' },
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
      },
      chartOption2: {
        title: {
          text: '比特率对比'
        },
        tooltip: {},
        legend: {
          data: ['智能组', '对照组'],
          left: 'right',
          orient: 'vertical'
        },
        xAxis: {
          type: 'category',
          data: [],
          name: '时刻', axisLine: { lineStyle: { width: 3 }}
        },
        yAxis: { name: '比特率(kbps)', axisLine: { lineStyle: { width: 3 }}},
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
      },
      chartTimer: null,
      chartOption3: {
        title: {
          text: 'Buffer值对比'
        },
        tooltip: {},
        legend: {
          data: ['智能组', '对照组'],
          left: 'right',
          orient: 'vertical'
        },
        xAxis: {
          type: 'category',
          data: [],
          name: '时刻',
          axisLine: { lineStyle: { width: 3 }}
        },
        yAxis: { axisLine: { lineStyle: { width: 3 }}, name: '视频Buffer等级' },
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
      },
      wordList: ['fps1', 'bitrate', 'bufferLevel'],
      fps1: [1, 5, 12, 46, 45, 28, 27, 28, 26, 19, 20, 32, 34, 36, 42, 45, 43, 39, 40, 45, 42, 44, 34, 44, 44, 40, 42, 44, 45, 45, 45, 45, 44, 45, 45, 45, 45, 45, 44, 45, 40, 44, 38, 44, 72],
      bitrate: [27, 27, 27, 27, 27, 27, 27, 270, 270, 270, 270, 53, 53, 53, 53, 53, 53, 270, 270, 270, 53, 53, 270, 270, 53, 53, 53, 53, 270, 270, 270, 270, 270, 270, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53],
      bufferLevel: [0, 16.42, 15.618, 14.557, 15.915, 15.101, 14.024, 12.938, 12.093, 34.26, 33.242, 32.434, 31.349, 30.281, 29.213, 28.414, 27.344, 26.225, 25.431, 24.369, 23.3, 22.236, 21.452, 20.36, 19.298, 18.233, 17.432, 16.36, 15.295, 14.225, 13.435, 12.368, 11.305, 10.242, 9.17, 8.388, 7.318, 6.253, 5.19, 4.408, 3.342, 2.275, 1.176, 0.379],
      index: 0
    }
  },

  created() {
    this.ace()
  },
  mounted() {
    this.index = JSON.parse(sessionStorage.getItem('currentIndex')) || 0
    this.initChart('chart1', 'chartOne', 'chartOption1')
    this.initChart('chart2', 'chartTwo', 'chartOption2')
    this.initChart('chart3', 'chartThree', 'chartOption3')
    this.initChart('chart4', 'chartFour', 'chartOption4')
    this.ace()
    this.chartTimer = setInterval(() => this.updateChart(), 1500)
  },
  beforeDestroy() {
    this.chartList.forEach((item) => {
      item.chart.dispose()
      item.chart = null
    })
    clearInterval(this.chartTimer)
    this.chartTimer = null
    sessionStorage.setItem('currentIndex', JSON.stringify(this.index))
  },
  methods: {
    initChart(target, chartName, chartOption) {
      this[target] = echarts.init(document.getElementById(chartName))
      this[target].setOption(this[chartOption])
    },
    ace() {
      this.chartList[ 0 ].chart = this.chart1
      this.chartList[ 0].option = this.chartOption1
      this.chartList[ 1 ].chart = this.chart2
      this.chartList[ 1 ].option = this.chartOption2
      this.chartList[ 2 ].chart = this.chart3
      this.chartList[ 2 ].option = this.chartOption3
      this.chartList[ 3 ].chart = this.chart4
      this.chartList[3].option = this.chartOption4
    },
    updateChart() {
      // getChartData(id).then((response) => {
      //   const resData = response.data
      //   if (resData.graphNO !== id) {
      //     return
      //   }
      //   if (chartOption.xAxis.length >= 20) {
      //     chartOption.xAxis.data.shift()
      //     chartOption.series[ 0 ].data.shift()
      //     chartOption.series[ 1 ].data.shift()
      //   }
      //   chartOption.xAxis.data.push(resData.timestamp)
      //   chartOption.series[ 0 ].data.push(resData.intelliGraph)
      //   chartOption.series[ 1 ].data.push(resData.compareGraph)
      //   target.setOption(chartOption)
      // })
      var count = 0
      this.chartList.forEach((item) => {
        const random = Math.random() * 8.9 + 1.0

        if (item.option.xAxis.data.length >= 20) {
          item.option.xAxis.data.shift()
          item.option.series[ 0 ].data.shift()
          item.option.series[1].data.shift()
        }
        item.option.xAxis.data.push(this.index)
        if (item.option.title.text === '端到端时延') {
          item.option.series[ 1 ].data.push(Math.max(this[this.wordList[count % 3]][ this.index % 40], Math.random() * 0.9 + 15))
          item.option.series[ 0 ].data.push(Math.max(this[ this.wordList[ count % 3 ] ][ this.index % 40 ] / random, Math.random() * 0.9 + 10))
        } else {
          item.option.series[ 0 ].data.push(Math.max(this[this.wordList[count % 3]][ this.index % 40], Math.random() * 0.9 + 15))
          item.option.series[ 1 ].data.push(Math.max(this[ this.wordList[ count % 3 ] ][ this.index % 40 ] / random, Math.random() * 0.9 + 10))
        }

        item.chart.setOption(item.option)
        count++
      })
      this.index++
    },
    onPlayerplay(player) {
      // this.$refs.player1.play()
      // this.$refs.player2.play()
      this.chartTimer = setInterval(() => this.updateChart(), 500)
      var temp = setInterval(() => this.updateChart(), 500)
    },
    onPlayerpause(player) {
      // this.$refs.player1.pause()
      // this.$refs.player2.pause()
      console.log('player paused')
      clearInterval(this.chartTimer)
      this.chartTimer = null
    }
  }
}
</script>
<style>
.title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

.el-card {
  width: 25%;
  margin-right: 3px;
}
</style>
