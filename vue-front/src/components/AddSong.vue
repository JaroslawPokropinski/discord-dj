<template>
  <div>
    <form @submit.prevent="onAddSong">
      <input type="text" v-model="songName" class="song-input">
      <input type="submit" value="Add song" class="song-submit">
    </form>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'AddSong',
  data: function () {
    return {
      songName: '',
      member: this.$route.query.member,
      guild: this.$route.query.guild
    }
  },
  methods: {
    onAddSong: function () {
      if (this.songName.length > 1) {
        axios
          .post(`${process.env.VUE_APP_SERVER_URL}addSong?title=${encodeURIComponent(this.songName)}&member=${this.member}&guild=${this.guild}`)
          .then(res => {})
          .catch(err => {})
        this.songName = ''
      } else {
        // push error
      }
    }
  }
}
</script>

<style>
.song-input {
  font-family: 'Roboto', sans-serif;
  width: 100%;
  margin: 8px 0;
  box-sizing: border-box;
  padding: 1rem 1rem;
  font-size: 2rem;
  border: 0;
  border-radius: 3px;
  background: #334a66;
}

.song-submit {
  font-family: 'Roboto', sans-serif;
  background-color: #c51f5d;
  border: none;
  color: white;
  padding: 16px 32px;
  text-decoration: none;
  margin: 4px 2px;
  cursor: pointer;
  color: white;
}
</style>
