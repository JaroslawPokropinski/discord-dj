<template>
  <div id="app">
    <navbar class="navibar"/>
    <div class="content">
      <transition name='router-anim' enter-active-class="animated fadeIn faster" leave-active-class="animated fadeOut faster" mode="out-in">
        <router-view />
      </transition>
    </div>

  </div>
</template>

<script>
import Navbar from './components/Navbar'
export default {
  name: 'app',
  components: {
    'navbar': Navbar
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Roboto');
@import url("https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.0/animate.min.css");
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}
#app {
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;

  overflow: hidden;
  display: flex;
  height: 100%;
  justify-content: center;
  /* align-items: center; */
  flex-direction: column;
  background-color: #141d26;
}
.content {
  padding: 8px;
}
.navibar {
  overflow: hidden;
  position: fixed;
  top: 0;
  width: 100%;
}
</style>
