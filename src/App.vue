<template>
  <div id="app">
    <Navbar></Navbar>
    <router-view />
    <!-- <Footer></Footer> -->
  </div>
</template>

<script>
import Navbar from '@/components/main/Navbar.vue';
// import Footer from '@/components/main/Footer.vue';

export default {
  components: {
    Navbar,
    // Footer,
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

.bg-gray-custom {
  background: #3c3c3b;
}

.bg-purple-custom {
  background: #592583;
}

.text-purple-custom {
  color: #592583;
}

.bg-yellow-custom {
  background: #dea01e;
}

.bg-yellow-btn {
  background: #dea01e;
}

.bg-yellow-btn:hover {
  background: #b88518;
}

.bg-purple-btn {
  background: #592583;
}

.bg-purple-btn:hover {
  background: #461e68;
}

.text-yellow-custom {
  color: #dea01e;
}

.w-fit {
  width: fit-content;
}

.z-200 {
  z-index: 200;
}

/* .modal-backdrop {
  z-index: 0 !important;
} */
.modal-backdrop {
  position: relative;
}
</style>
