<template>
  <div>
    <div class="text-left">
      <div class="font-bold text-xl">Select topic</div>
      <!-- <div v-for="(topic, index) in topicImg" :key="index">
        <div class="flex flex-row">
          <div class="w-5"></div>
          <div class="cursor-pointer hover:text-blue-600">{{ topic.name }}</div>
        </div>
      </div> -->
      <div class="w-min-dropdown">
        <treeselect
          v-if="topicImg.length > 0"
          :multiple="true"
          :options="topicImg"
          :always-open="false"
          placeholder="/topic_name"
          v-model="value"
          :value-consists-of="'ALL'"
        />
        <div
          v-if="topicImg.length <= 0 && topicMsg.length > 0"
          class="spinner-border text-blue-300"
          style="width: 2rem; height: 2rem"
          role="status"
        ></div>

        <!-- <div v-else>
          <input
            type="text"
            class="border w-full px-2 py-1 rounded outline-none"
            placeholder="/topic_name"
          />
        </div> -->
      </div>
    </div>
    <hr />
    <div class="mt-4" v-if="value.length > 0">
      <div
        v-for="(source, index) in value"
        :key="index"
        class="flex justify-center flex-col w-full"
      >
        <div class="font-bold">{{ source }}</div>
        <p align="center">
          <iframe v-if="source !== ''" width="640" height="480" :src="srcVideo(source)"> </iframe>
        </p>
        <div id="mjpeg"></div>
      </div>
    </div>
    <div v-else class="flex justify-center">
      <div
        class="
          video
          border
          bg-gray-100
          text-gray-300
          flex
          justify-center
          text-5xl
          items-center
          mt-3
        "
      >
        <i class="fas fa-video-slash"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Treeselect from '@riophae/vue-treeselect';
// var EventEmitter2 = require('eventemitter2');
// import Vue from 'vue';
// import LoadScript from 'vue-plugin-load-script';

export default {
  components: {
    Treeselect,
  },
  mounted() {
    // Vue.use(LoadScript);
  },
  computed: {
    ...mapGetters({
      rosbridgeURL: 'getRosbridgeURL',
      robotConnected: 'getRobotConnected',
      topicMsg: 'getTopicMsg',
    }),
    topicImg() {
      let filteredTopicImg = this.topicMsg.filter(topic => topic.type === this.typeImg);
      filteredTopicImg.map(topic => {
        topic.id = topic.name;
        topic.label = topic.name;
        return topic;
      });
      return filteredTopicImg;
      // return [];
    },
  },
  data() {
    return {
      imageTopic: '',
      value: [],
      // srcVideo: 'http://10.204.226.247:8080/stream?topic=/camera/color/image_raw',
      typeImg: 'sensor_msgs/Image',
      cameraViewer: null,
    };
  },
  methods: {
    srcVideo(topic) {
      return `http://10.204.226.247:8080/stream?topic=${topic}`;
    },
  },
};
</script>

<style scoped>
.video {
  width: 640px;
  height: 480px;
}

.w-min-dropdown {
  min-width: 25rem;
  width: 20rem;
}
</style>
