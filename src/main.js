import Vue from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import store from './store';
import '@/assets/css/tailwind.css';
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

Vue.config.productionTip = false;
axios.defaults.baseURL = 'http://localhost:5000/';

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
