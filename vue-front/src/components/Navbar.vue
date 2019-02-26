<template>
<ul class="navbar-ul">
  <li v-for="link in links" :key="link.id" v-on:click="selectLink(link.id)" class="navbar-member" v-bind:class="{ selected: link.selected }">
    <router-link :to="link.to" class="navbar-link">{{ link.name }}</router-link>
  </li>
  <!-- <li class="navbar-member selected"><router-link to="/" class="navbar-link">Dj</router-link></li>
  <li class="navbar-member"><router-link to="/soundboard" class="navbar-link">Soundboard</router-link></li> -->
</ul>
</template>

<script>
export default {
  name: 'navbar',
  data () {
    return {
      links: [
        {
          id: 0,
          name: 'Dj',
          to: '/',
          selected: true
        },
        {
          id: 1,
          name: 'Soundboard',
          to: '/soundboard',
          selected: false
        }
      ]
    }
  },
  methods: {
    selectLink: function (id) {
      for (let link of this.links) {
        if (link.id === id) {
          link.selected = true
        } else {
          link.selected = false
        }
      }
    }
  }
}
</script>

<style>
.navbar-ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #334a66;
}

.navbar-member {
  float: left;
}

.navbar-member .navbar-link {
  display: block;
  color: white;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
}

/* Change the link color to #111 (black) on hover */
.navbar-member .navbar-link:hover {
  background-color: #141d26;
}

.selected {
 background-color: #c51f5d;
}

.selected .navbar-link:hover {
 background-color: #6e1133;
}
</style>
