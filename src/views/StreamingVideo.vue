<template>
  <div class="h-full">
    <div class="m-10">
      <div class="flex justify-start mb-2">
        <button
          class="btn btn-secondary flex flex-row"
          type="button"
          data-toggle="dropdown"
          id="dropdownCam"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <div class="font-bold">{{ camActive }}</div>
        </button>
        <div class="dropdown-menu" aria-labelledby="dropdownCam">
          <div class="flex flex-col items-start pl-2 break-all">
            <a class="dropdown-item" href="#">...</a>
          </div>
        </div>
      </div>
      <div class="font-bold flex flex-col justify-start mb-4">
        <!-- {{ robotConnected.ip }} -->
        <div class="flex flex-row">
          <span class="mr-2">IP address:</span>
          <span>10.204.226.190</span>
        </div>
        <div class="flex flex-row">
          <span class="mr-2">Stream port:</span>
          <input type="text" class="border-b border-black w-20 pl-1" v-model="portVideo" />
        </div>
      </div>
      <iframe v-if="srcVideo !== ''" width="640" height="480" :src="srcVideo"> </iframe>
      <div
        class="video border bg-gray-100 text-gray-300 flex justify-center text-5xl items-center"
        v-else
      >
        <i class="fas fa-video-slash"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  components: {},
  data() {
    return {
      srcVideo: '',
      portVideo: 8081,
      width: 640,
      height: 480,
      camActive: 'Raspberry Pi Camera',
    };
  },
  computed: {
    ...mapGetters({
      ros: 'getROS',
      rosbridgeURL: 'getRosbridgeURL',
      robotConnected: 'getRobotConnected',
    }),
  },
  mounted() {
    if (this.objectNotEmpty(this.robotConnected)) {
      // this.srcVideo = `http://${this.robotConnected.ip}:${this.portVideo}`;
    }
  },
  methods: {
    objectNotEmpty(obj) {
      return Object.keys(obj).length !== 0;
    },
  },
};
</script>

<style scoped>
.video {
  width: 640px;
  height: 480px;
}
</style>
