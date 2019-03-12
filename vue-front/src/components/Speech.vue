<template>
  <div>
    <h1 class="try_it">Try saying 'Alexa that's sad'</h1>
    <h1 class="try_it">{{ text }}</h1>
    <img src="./mic.svg" height="24px" width="24px" class="mic_icon">
  </div>
</template>

<script>
import Axios from 'axios'
export default {
  name: 'speech',
  data () {
    return {
      text: '...'
    }
  },
  mounted () {
    if ('webkitSpeechRecognition' in window) {
      var WebkitSpeechRecognition = window.webkitSpeechRecognition
      var recognition = new WebkitSpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = false
      recognition.lang = 'en-US'
      recognition.onstart = function (event) {
        console.log('onstart')
      }
      const awn = this.$awn
      const member = this.$root.$data.state.member
      const guild = this.$root.$data.state.guild

      recognition.onresult = (event) => {
        let out = ''
        for (var i = event.resultIndex; i < event.results.length; ++i) {
          out += event.results[i][0].transcript
        }
        this.text = out
        console.log(out)
        if (out.trim() === `Alexa that's sad`) {
          const song = 'hentacito'
          const promise = Axios.post(`${process.env.VUE_APP_SERVER_URL}addSong?title=${encodeURIComponent(song)}&member=${member}&guild=${guild}`)
          awn.async(promise, () => {}, () => awn.alert('Failed to add a song!'))
        }
      }
      recognition.onend = function () {
        console.log('onend')
      }
      recognition.onerror = function (event) {
        console.log(event.error)
        if (event.error === 'no-speech') {
          recognition.start()
        }
      }
      recognition.start()
      console.log('start')
    }
  }
}
</script>

<style scoped>
.try_it {
  background-color: #334a66;
  color: white;
}
.mic_icon {
  background-color: aliceblue;
}
</style>
