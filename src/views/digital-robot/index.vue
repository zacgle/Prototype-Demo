<template>
  <div>
    <div class="title">
      <h3>请选择预置音频文件或现场录音体验</h3>
    </div>
    <div class="fileInput">
      <!-- 文件选择 -->
      <label class="custom-file-upload">
        <input type="file" accept=".wav" :disabled="isRecording" @change="handleFileChange">
        <el-button :disabled="isRecording">选择文件</el-button>
      </label>
      <el-button type="primary" style="margin-left: 8px;" :disabled="isRecording" @click="uploadFile">上传并播放</el-button>
    </div>
    <div class="record">
      <el-button ref="recordBtn" @click="toggleRecording">{{ isRecording ? '停止录音' : '开始录音' }}</el-button>
    </div>
    <!-- 视频播放区域，初始时不显示 -->
    <div v-show="currentVideo || videoUrl" class="displayArea">
      <video v-if="tag === 1" ref="videoPlayer" style="max-width: 100%; margin-top: 20px;" autoplay controls :src="currentVideo" type="video/mp4" @ended="playNextVideo" />
      <video v-else-if="tag === 2" ref="videoPlayer" style="max-width: 100%; margin-top: 20px;" autoplay controls :src="videoUrl" type="video/mp4" />
    </div>
  </div>
</template>

<script>
import { upload } from '@/api/digital-robot'
import Recorder from '@/manual-modules/recorderjs/recorder.js'
export default {
  data() {
    return {
      selectedFile: null,
      videoUrl: null, // 视频播放URL
      isRecording: false, // 是否正在录音
      mediaRecorder: null,
      audioChunks: [],
      startTime: null,
      formData: new FormData(),
      count: 0,
      audioContext: new (window.AudioContext || window.webkitAudioContext)(),
      recorder: null,
      recordingInterval: null,
      videoQueue: [], // 用于存储视频URL的队列
      audioQueue: [], // 用于存储音频URL的队列
      currentVideo: null, // 当前正在播放的视频URL
      stream: null,
      playerInterval: null,
      tag: 0
    }
  },
  watch: {
    videoQueue(newVal) {
      if (this.videoQueue.length > 0 && this.currentVideo === null) {
        this.currentVideo = this.videoQueue.shift()
        this.$refs.videoPlayer.play()
      }
    },
    audioQueue(newVal) {
      if (this.audioQueue.length > 0) {
        this.uploadAudioFiles()
      }
    }
  },
  mounted() {
    // 初始化录音
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      console.log('MediaDevices supported.')
    } else {
      console.log('MediaDevices not supported!')
      alert('您的浏览器不支持录音功能！相关按钮已被禁用')
      this.$refs.recordBtn.disabled = true
      return
    }
  },
  beforeDestroy() {
    // 组件销毋时，释放资源
    if (this.videoUrl) {
      URL.revokeObjectURL(this.videoUrl)
    }
    if (this.recordingInterval) {
      clearInterval(this.recordingInterval)
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop())
    }
    if (this.playerInterval) {
      clearInterval(this.playerInterval)
    }
    if (this.videoQueue.length > 0) {
      this.videoQueue.forEach(url => {
        URL.revokeObjectURL(url)
      })
    }
    if (this.recorder) {
      this.recorder.clear()
      this.recorder = null
    }
  },
  methods: {
    handleFileChange(e) {
      URL.revokeObjectURL(this.videoUrl)
      this.videoUrl = null
      this.selectedFile = e.target.files[0]
    },
    async uploadFile() {
      if (!this.selectedFile) {
        this.$message.error('请先选择一个文件')
        return
      }
      this.tag = 2

      this.formData = new FormData()
      this.formData.append('file', this.selectedFile)

      upload(this.formData).then(res => {
        console.log(res)
        this.videoUrl = URL.createObjectURL(new Blob([res.data], { type: 'video/mp4' }))
      }).catch(error => {
        // 错误处理
        console.error('请求失败:', error)
      })
    },
    startRecording() {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          if (this.recorder) {
            this.recorder.clear()
            this.recorder = null
          }
          this.stream = stream
          const input = this.audioContext.createMediaStreamSource(stream)
          this.recorder = new Recorder(input, { numChannels: 2 })
          this.recorder.record()
          this.isRecording = true
          console.log('录音开始...')
          this.tag = 1
          // 每一分钟导出一次音频
          this.recordingInterval = setInterval(() => {
            this.exportWAV()
          }, 45000)
        }).catch(err => console.error('获取音频流失败:', err))
    },
    stopRecording() {
      clearInterval(this.recordingInterval) // 停止定时器
      this.recorder.stop()

      this.isRecording = false
      console.log('录音停止.')
      // 导出最后一段音频（如果有）
      this.exportWAV()
      this.stream.getTracks().forEach(track => track.stop())
    },
    exportWAV() {
      this.recorder.exportWAV(blob => {
        // const url = URL.createObjectURL(blob)
        // const a = document.createElement('a')
        // document.body.appendChild(a)
        // a.style = 'display: none'
        // a.href = url
        // a.download = `recording-${Date.now()}.wav`
        // a.click()
        // window.URL.revokeObjectURL(url)
        this.audioQueue.push(blob) // 将录音文件加入队列
        // 重置并重新开始录音以切分下一个文件
        this.recorder.clear()
        this.recorder.record()
      })
    },
    toggleRecording() {
      if (this.isRecording) {
        this.stopRecording()
      } else {
        this.startRecording()
      }
    },
    enqueueVideo(url) {
      this.videoQueue.push(url)
      // if (this.currentVideo === null) {
      //   this.playNextVideo()
      // }
    },
    playNextVideo() {
      if (this.videoQueue.length > 0) {
        if (this.playerInterval) {
          clearInterval(this.playerInterval)
          this.playerInterval = null
        }
        console.log('videoqueue: ' + this.videoQueue)
        URL.revokeObjectURL(this.currentVideo) // 释放当前视频资源
        this.currentVideo = this.videoQueue.shift() // 从队列中取出下一个视频
        this.$refs.videoPlayer.src = this.currentVideo // 设置视频源
        this.$refs.videoPlayer.play() // 播放视频
      } else {
        if (this.playerInterval) {
          return
        }
        this.playerInterval = setInterval(() => {
          this.playNextVideo()
        }, 1000)
      }
    },
    async uploadAudioFiles() {
      console.log('uploadAudioFiles' + this.audioQueue)

      while (this.audioQueue.length > 0) {
        const audioBlob = this.audioQueue.shift()
        this.formData = new FormData()
        this.formData.append('file', audioBlob, `recording-${Date.now()}.wav`)

        // wrap upload promise in a then statement
        // enqueue video URL as soon as they are available
        upload(this.formData)
          .then(res => {
            console.log(res)
            const url = URL.createObjectURL(new Blob([res.data], { type: 'video/mp4' }))
            this.enqueueVideo(url)
          })
          .catch(error => {
            // 错误处理
            console.error('请求失败:', error)
          })
      }
    }
  }
}
</script>
<style scoped>
/* 隐藏原生的input */
.custom-file-upload {
  position: relative;
  overflow: hidden;
  display: inline-block;
}

.custom-file-upload input[type='file'] {
  position: absolute;
  opacity: 0;
  right: 0;
  top: 0;
  z-index: 2;
}
.fileInput {
  margin-top: 8px;
  margin-left:16px;
  margin-right: 8px;
  display: inline-flex;
}
.record,
.title{
  margin-top: 24px;
  margin-left:16px;
  display: block;
}
.displayArea {
  margin-top: 24px;
  margin-left:16px;
  display: block;
  width: 100%
}
</style>
