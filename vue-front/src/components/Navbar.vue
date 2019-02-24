<template>
<ul class="navbar-ul">
  <li class="navbar-member selected"><router-link to="/" class="navbar-link">Dj</router-link></li>
  <li class="navbar-member"><router-link to="/soundboard" class="navbar-link">Soundboard</router-link></li>
</ul>
</template>

<script>
export default {
  name: 'navbar'
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
