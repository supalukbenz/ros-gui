<template>
  <div id="app">
    <Navbar></Navbar>
    <router-view />
  </div>
</template>

<script>
import Navbar from '@/components/main/Navbar.vue';

export default {
  components: {
    Navbar,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}

body,
html {
  height: 100%;
}

input {
  color: #000000 !important;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.bg-purple-custom {
  background: #3f13a6;
}

.text-purple-custom {
  color: #3f13a6;
}

.z-200 {
  z-index: 200;
}
</style>
