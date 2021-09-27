import Vue from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import store from './store';
import '@/assets/css/tailwind.css';
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';
// import LoadScript from 'vue-plugin-load-script';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

import VueApexCharts from 'vue-apexcharts';

import VueDraggableResizable from 'vue-draggable-resizable';
var EventEmitter2 = require('eventemitter2');

Vue.config.productionTip = false;
Vue.use(VueApexCharts);
window.EventEmitter2 = EventEmitter2;

Vue.component('apexchart', VueApexCharts);
Vue.component('vue-draggable-resizable', VueDraggableResizable);

// Vue.use(LoadScript);
axios.defaults.baseURL = 'http://localhost:5000/';

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
