<template>
  <div class="h-full">
    <div class="font-bold flex flex-col justify-start my-3">
      <!-- {{ robotConnected.ip }} -->
      <div class="flex flex-row">
        <span class="mr-2">Robot IP:</span>
        <span>{{ this.robotConnected.ip }}</span>
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
    <div class="my-10">
      <div class="flex flex-row">
        <span class="mr-2">Width:</span>
        <input type="number" class="border-b border-black w-20 pl-1 outline-none" v-model="width" />
      </div>
      <div class="flex flex-row">
        <span class="mr-2">Height:</span>
        <input
          type="number"
          class="border-b border-black w-20 pl-1 outline-none"
          v-model="height"
        />
      </div>
    </div>
    <iframe v-if="srcVideo !== ''" :width="width" :height="height" :src="srcVideo"> </iframe>
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
      // srcVideo: '',
      portVideo: 8000,
      width: 640,
      height: 480,
    };
  },
  computed: {
    ...mapGetters({
      rosbridgeURL: 'getRosbridgeURL',
      robotConnected: 'getRobotConnected',
    }),
    srcVideo() {
      // if (this.portVideo.trim() !== '' && this.robotConnected.ip.trim() !== '') {
      //   return `http://${this.robotConnected.ip}:${this.portVideo}`;
      // }
      return `http://${this.robotConnected.ip}:${this.portVideo}`;
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
