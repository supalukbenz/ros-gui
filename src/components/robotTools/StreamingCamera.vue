<template>
  <div class="video"></div>
</template>

<script>
// import MJPEGCANVAS from 'mjpegcanvas';
import { mapGetters } from 'vuex';
// import Vue from 'vue';
// import LoadScript from 'vue-plugin-load-script';

export default {
  computed: {
    ...mapGetters({
      robotConnected: 'getRobotConnected',
    }),
  },
  data() {
    return {
      camereViewer: null,
    };
  },
  async mounted() {
    // Vue.use(LoadScript);
    // await Vue.loadScript(
    //   'https://cdn.jsdelivr.net/npm/eventemitter2@5.0.1/lib/eventemitter2.min.js'
    // );
    // await Vue.loadScript('http://cdn.robotwebtools.org/mjpegcanvasjs/current/mjpegcanvas.min.js');
    this.setStremingVideo();
  },
  methods: {
    setStremingVideo() {
      // this.camereViewer = new MJPEGCANVAS.Viewer({
      //   divID: 'mjpeg',
      //   host: this.robotConnected.ip,
      //   width: 640,
      //   height: 480,
      //   topic: '/camera/rgb/image_raw',
      //   port: 11315,
      // });
    },
  },
};
</script>
