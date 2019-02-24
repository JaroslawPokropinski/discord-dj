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
import axios from 'axios';
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
        }
      ]
    }
  },
  methods: {
    onSound: function (id) {
      axios
        .post(`${process.env.VUE_APP_SERVER_URL}playSound?id=${id}&member=${this.member}&guild=${this.guild}`)
        .then(res => {})
        .catch(err => { console.error(err) })
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
  background: #334a66;
  color: white;
}

.sound-box .sound-list:hover {
  background-color: #141d26;
}
</style>
