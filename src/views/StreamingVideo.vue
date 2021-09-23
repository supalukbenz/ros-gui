<template>
  <div class="h-full m-10">
    <div class="flex justify-end mb-2">
      <button
        class="btn btn-secondary flex flex-row"
        type="button"
        data-toggle="dropdown"
        id="dropdownCam"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <div class="font-bold">
          {{ camActive }} <span class="ml-3"><i class="fas fa-caret-down"></i></span>
        </div>
      </button>
      <div class="dropdown-menu" aria-labelledby="dropdownCam">
        <div class="flex flex-col items-start pr-2 break-all w-full">
          <a
            class="dropdown-item cursor-pointer"
            @click="setCamActive('Raspberry Pi Camera: Stream Port')"
            >Raspberry Pi Camera: Stream Port</a
          >
          <a class="dropdown-item cursor-pointer" @click="setCamActive('Webserver Video')"
            >Webserver Video</a
          >
        </div>
      </div>
    </div>
    <StreamByPort v-show="camActive === 'Raspberry Pi Camera: Stream Port'"></StreamByPort>
    <WebserverVideo v-show="camActive === 'Webserver Video'"></WebserverVideo>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import StreamByPort from '@/components/streaming/StreamByPort.vue';
import WebserverVideo from '@/components/streaming/WebserverVideo.vue';

export default {
  components: {
    StreamByPort,
    WebserverVideo,
  },
  data() {
    return {
      camActive: 'Webserver Video',
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
    // if (this.objectNotEmpty(this.robotConnected)) {
    //   // this.srcVideo = `http://${this.robotConnected.ip}:${this.portVideo}`;
    // }
  },
  methods: {
    setCamActive(source) {
      this.camActive = source;
    },
  },
};
</script>
