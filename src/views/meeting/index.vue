<template>
  <div>
    <div style="width: 98%; margin-left: 10px; margin-top: 16px">
      <video-player
        ref="player1"
        :options="playerOptions"
        class="vjs-theme-city"
        autoplay
        playsinline
      />
    </div>

  </div>
</template>
<script>
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
import { videoPlayer } from 'vue-video-player'
import 'videojs-contrib-hls'
export default {
  name: 'Meeting',
  components: {
    videoPlayer
  },
  data() {
    return {
      bandwidthLimit: 100,
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
        autoplay: true, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        controls: true,
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: 'application/x-mpegURL',
            src: 'http://10.112.216.158:19356/meeting/mystream.m3u8' // 这里填写你的OBS推流地址
          }
        ],
        poster: '', // 你的封面地址
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        techOrder: ['html5', 'flash'],
        controlBar: {
          durationDisplay: true
        }
      }
    }
  },
  mounted() {
    console.log('Meeting mounted')
  },
  methods: {
    createMeeting() {
      console.log(this.meeting)
    }
  }
}

</script>
