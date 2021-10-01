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

import VueDraggableResizable from 'vue-draggable-resizable';
import VueHighcharts from 'vue2-highcharts';
import Highcharts from 'highcharts';
// import HighchartsVue from 'highcharts-vue';
var EventEmitter2 = require('eventemitter2');
import More from 'highcharts/highcharts-more';
import Highcharts3D from 'highcharts/highcharts-3d';
import exportingInit from 'highcharts/modules/exporting';
import exportDataInit from 'highcharts/modules/export-data';
import accessibilityInit from 'highcharts/modules/accessibility';

exportingInit(Highcharts);
exportDataInit(Highcharts);
accessibilityInit(Highcharts);
More(Highcharts);
Highcharts3D(Highcharts);

Vue.use(VueHighcharts, { Highcharts });

Vue.component('VueHighcharts', VueHighcharts);
Vue.config.productionTip = false;
// Vue.use(HighchartsVue, {
//   highcharts: Highcharts,
// });
window.EventEmitter2 = EventEmitter2;

Vue.component('vue-draggable-resizable', VueDraggableResizable);

// Vue.use(LoadScript);
axios.defaults.baseURL = 'http://localhost:5000/';

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
