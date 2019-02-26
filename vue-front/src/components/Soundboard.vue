<template>
<div>
  <b-container fluid>
    <b-row align-h="center">
      <b-col sm="4">
        <div class="sound-box">
          <ul class="sound-list">
            <li v-for="sound in soundList" :key="sound.id" v-on:click="onSound(sound.id)">
              {{ sound.title }}
            </li>
          </ul>
        </div>
      </b-col>
    </b-row>
  </b-container>
</div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'soundboard',
  data: function () {
    return {
      member: this.$root.$data.state.member,
      guild: this.$root.$data.state.guild,
      soundList: [
        {
          id: 0,
          title: 'GLaDOS: horrible person'
        },
        {
          id: 1,
          title: 'GLaDOS: guilty people'
        }
      ]
    }
  },
  methods: {
    onSound: function (id) {
      const promise = axios
        .post(`${process.env.VUE_APP_SERVER_URL}playSound?id=${id}&member=${this.member}&guild=${this.guild}`)
      this.$awn.async(promise, () => {}, () => this.$awn.alert('Failed to play a sound'))
    }
  }
}
</script>

<style>
.sound-box {
    background: #334a66;
}

.sound-box .sound-list {
  list-style-type: none;
  padding: 8px 0;
  background: #334a66;
  color: white;
}

.sound-box .sound-list li {
  padding: 16px;
}

.sound-box .sound-list li:hover {
  background-color: #141d26;
}
</style>
