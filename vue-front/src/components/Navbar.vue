<template>
<ul class="navbar">
  <li class="navbar-member selected"><a href="#">Dj</a></li>
  <li class="navbar-member"><a href="#">Soundboard</a></li>
</ul>
</template>

<script>
export default {
  name: 'navbar'
}
</script>

<style>
.navbar {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #334a66;
}

.navbar-member {
  float: left;
}

.navbar-member a {
  display: block;
  color: white;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
}

/* Change the link color to #111 (black) on hover */
.navbar-member a:hover {
  background-color: #141d26;
}

.selected {
 background-color: #c51f5d;
}

.selected a:hover {
 background-color: #6e1133;
}
</style>
