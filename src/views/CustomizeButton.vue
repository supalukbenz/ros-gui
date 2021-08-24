<template>
  <div class="flex flex-row h-full">
    <SideBar></SideBar>
    <div class="m-10">
      <div class="flex mb-2">
        <button
          @click="handleShowVideo()"
          type="button"
          class="border py-1 px-2 rounded bg-gray-600 text-white"
        >
          Video
        </button>
      </div>
      <VideoFrame
        v-show="showVideo"
        srcVideo="http://10.204.226.190:8081/"
        :width="420"
        :height="260"
      ></VideoFrame>
      <ConnectionPart></ConnectionPart>
    </div>
  </div>
</template>

<script>
import SideBar from '@/components/main/SideBar.vue';
import ConnectionPart from '@/components/robotConnection/ConnectionPart.vue';
import VideoFrame from '@/components/streaming/VideoFrame.vue';

export default {
  components: {
    SideBar,
    ConnectionPart,
    VideoFrame,
  },
  data() {
    return {
      showVideo: false,
    };
  },
  methods: {
    handleShowVideo() {
      this.showVideo = !this.showVideo;
    },
  },
};
</script>
