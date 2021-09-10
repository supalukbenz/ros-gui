<template>
  <div class="bg-gray-200 text-left py-4 px-3 z-0 h-full">
    <div>
      <div class="font-semibold text-2xl">Robot Tools</div>
      <hr />
      <div class="mt-4">
        <div
          class="flex items-center font-bold text-xl cursor-pointer text-blue-custom"
          :class="{ 'text-gray-400': pageName !== 'Graph' }"
          @click="changePage('Graph')"
        >
          <i class="fas fa-chart-area"></i>
          <span class="ml-2">Graph</span>
        </div>
        <div
          class="flex items-center font-bold text-xl mt-3 text-blue-custom cursor-pointer"
          :class="{ 'text-gray-400': pageName !== 'StreamingVideo' }"
          @click="changePage('StreamingVideo')"
        >
          <i class="fas fa-photo-video"></i>
          <span class="ml-2">Streaming Video</span>
        </div>
        <div
          class="flex items-center font-bold text-xl mt-3 cursor-pointer text-blue-custom"
          :class="{ 'text-gray-400': pageName !== 'CustomizeButton' }"
          @click="changePage('CustomizeButton')"
        >
          <i class="fas fa-pencil-alt"></i>
          <span class="ml-2">Customize Button</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters({
      robotConnected: 'getRobotConnected',
    }),
    pageName() {
      return this.$route.name;
    },
    robotName() {
      return this.$route.params.robotName;
    },
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    changePage(page) {
      this.$router
        .push({
          name: page,
          params: { robotName: this.robotName },
        })
        .catch(() => {});
    },
  },
};
</script>

<style scoped>
.-z-1 {
  z-index: -1;
}
.min-h-35 {
  min-height: 30rem;
}

.text-blue-custom:hover {
  color: #485a73;
}
</style>
