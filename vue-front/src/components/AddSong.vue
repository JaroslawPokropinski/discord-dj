<template>
<div class="song-box">
  <b-container fluid>
    <b-row align-h="center">
      <b-col sm="4">
        <form @submit.prevent="onAddSong">
          <input type="text" v-model="songName" class="song-input">
          <input type="submit" value="Add song" class="song-submit">
        </form>
      </b-col>
    </b-row>
  </b-container>
</div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'AddSong',
  data: function () {
    return {
      songName: '',
      member: this.$root.$data.state.member,
      guild: this.$root.$data.state.guild
    }
  },
  beforeCreate: function () {
    if (this.$route.query.member) {
      this.$root.$data.state.member = this.$route.query.member
    }
    if (this.$route.query.guild) {
      this.$root.$data.state.guild = this.$route.query.guild
    }
  },
  methods: {
    onAddSong: function () {
      if (this.songName.length > 1) {
        this.songName = ''
        const promise = axios.post(`${process.env.VUE_APP_SERVER_URL}addSong?title=${encodeURIComponent(this.songName)}&member=${this.member}&guild=${this.guild}`)
        this.$awn.async(promise, () => {}, () => this.$awn.alert('Failed to add a song!'))
      } else {
        this.$awn.alert('Song title is too short!')
      }
    }
  }
}
</script>

<style>
.song-box {

}
.song-input {
  font-family: 'Roboto', sans-serif;
  display: block;
  width: 100%;
  box-sizing:border-box;
  margin: 8px 0px;
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
