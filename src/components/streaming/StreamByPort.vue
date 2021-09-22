<template>
  <div class="h-full">
    <div class="font-bold flex flex-col justify-start my-3">
      <!-- {{ robotConnected.ip }} -->
      <div class="flex flex-row">
        <span class="mr-2">Websocket address:</span>
        <span>{{ rosbridgeURL }}</span>
      </div>
      <div class="flex flex-row">
        <span class="mr-2">Stream port:</span>
        <input
          type="text"
          class="border-b border-black w-20 pl-1 outline-none"
          v-model="portVideo"
        />
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
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      srcVideo: '',
      portVideo: 8081,
      width: 640,
      height: 480,
    };
  },
  computed: {
    ...mapGetters({
      rosbridgeURL: 'getRosbridgeURL',
      robotConnected: 'getRobotConnected',
    }),
  },
  mounted() {
    this.srcVideo = `http://${this.robotConnected.ip}:${this.portVideo}`;
  },
};
</script>

<style scoped>
.video {
  width: 640px;
  height: 480px;
}
</style>
