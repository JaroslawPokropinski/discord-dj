<template>
  <div>
    <b-container fluid>
      <b-row align-h="center">
        <b-col>
          <a v-if="!this.$route.query.code" :href="`${serverUrl}login`" class="oauth-button">Login with discord</a>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'login',
  data () {
    return {
      serverUrl: process.env.VUE_APP_SERVER_URL
    }
  },
  mounted () {
    const root = this.$root
    const router = this.$router
    if (this.$route.query.code) {
      const code = this.$route.query.code
      this.$awn.async(new Promise(function (resolve, reject) {
        let rsp = {}
        axios.get(`${process.env.VUE_APP_SERVER_URL}getUserInfo?code=${code}`)
          .then((auth) => {
            rsp.headers = {
              Authorization: `${auth.data.token_type} ${auth.data.access_token}`
            }
            return axios.get(`${process.env.VUE_APP_SERVER_URL}getGuilds`, { headers: rsp.headers })
          })
          .then((guilds) => {
            if (guilds.data[0]) {
              rsp.guildId = guilds.data[0].id
            } else {
              throw new Error('There are no compatible guilds!')
            }
            return axios.get(`${process.env.VUE_APP_SERVER_URL}getUser?guild=${rsp.guildId}`, { headers: rsp.headers })
          })
          .then((memberId) => {
            root.$data.state.member = memberId.data
            root.$data.state.guild = rsp.guildId
            router.push('/')
            resolve()
          })
          .catch((err) => {
            reject(err)
          })
      }), () => {}, () => this.$awn.alert('Failed to login!'))
    }
  }
}
</script>

<style>
.oauth-button:link, .oauth-button:visited {
  background-color: #f44336;
  color: white;
  padding: 14px 25px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
}

.oauth-button:hover, .oauth-button:active {
  background-color: red;
}
</style>
