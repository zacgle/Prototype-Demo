<template>
  <el-container>
    <el-header>Chatbot</el-header>
    <el-main>
      <div class="chat-messages">
        <el-card v-for="(message, index) in messages" :key="index" class="message-card">
          <div :class="{ 'bot-message': message.isBot, 'user-message': !message.isBot }">
            {{ message.text }}
          </div>
        </el-card>
      </div>
    </el-main>
    <el-footer>
      <el-row>
        <el-col :span="24">
          <el-input
            v-model="userInput"
            placeholder="Type a message..."
            @keyup.enter.native="sendMessage"
          />
          <el-button type="primary" @click="sendMessage">Send</el-button>
        </el-col>
      </el-row>
    </el-footer>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      messages: [],
      userInput: ''
    }
  },
  methods: {
    sendMessage() {
      if (!this.userInput) return
      this.addMessage(this.userInput, false)
      this.getBotResponse(this.userInput)
      this.userInput = ''
    },
    addMessage(text, isBot) {
      this.messages.push({ text, isBot })
    },
    async getBotResponse(message) {
      try {
        const response = await this.$http.post('YOUR_BACKEND_API_ENDPOINT', { message })
        this.addMessage(response.data.reply, true)
      } catch (error) {
        console.error('Error:', error)
      }
    }
  }
}
</script>

<style scoped>
.el-container {
  margin: 30px;
}
.chat-messages {
  height: 400px;
  overflow-y: auto;
  margin-bottom: 20px;
}
.message-card {
  margin: 10px 0;
}
.bot-message {
  background-color: #f0f2f5;
  padding: 10px;
}
.user-message {
  background-color: #b3d8ff;
  padding: 10px;
  text-align: right;
}
</style>
