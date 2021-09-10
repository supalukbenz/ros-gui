import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/robot-list',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  {
    path: '/robot/:robotName',
    name: 'RobotConnected',
    component: () => import(/* webpackChunkName: "robot" */ '../views/RobotConnectedHome.vue'),
  },
  {
    path: '/robot/:robotName/customize-button',
    name: 'CustomizeButton',
    component: () =>
      import(/* webpackChunkName: "customizeButton" */ '../views/RobotConnectedHome.vue'),
  },
  {
    path: '/robot/:robotName/graph',
    name: 'Graph',
    component: () => import(/* webpackChunkName: "graph" */ '../views/RobotConnectedHome.vue'),
  },
  {
    path: '/robot/:robotName/streaming-video',
    name: 'StreamingVideo',
    component: () =>
      import(/* webpackChunkName: "streamingVideo" */ '../views/RobotConnectedHome.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.path == '/') {
    next({
      name: 'Home',
    });
  } else {
    next();
  }
});

export default router;
