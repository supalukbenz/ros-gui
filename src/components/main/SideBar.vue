<template>
  <div class="text-left py-4 px-3 z-0 border hidden">
    <div>
      <div class="flex flex-row justify-between items-center">
        <div class="font-semibold text-2xl">Robot Tools</div>
        <div @click="handleMenu()"><i class="fas fa-bars"></i></div>
      </div>
      <hr />
      <div class="mt-4">
        <div
          class="
            flex
            justify-between
            items-center
            font-bold
            text-xl
            cursor-pointer
            text-blue-custom
          "
          :class="{ 'text-gray-400': pageName !== 'Graph' }"
          @click="changePage('Graph')"
        >
          <span v-if="handleMenu" class="ml-2">Graph</span>
          <i class="fas fa-chart-area"></i>
        </div>
        <div
          class="
            flex
            justify-between
            items-center
            font-bold
            text-xl
            mt-3
            text-blue-custom
            cursor-pointer
          "
          :class="{ 'text-gray-400': pageName !== 'StreamingVideo' }"
          @click="changePage('StreamingVideo')"
        >
          <span v-if="handleMenu" class="ml-2">Streaming Video</span>
          <i class="fas fa-photo-video"></i>
        </div>
        <div
          class="
            flex
            justify-between
            items-center
            font-bold
            text-xl
            mt-3
            cursor-pointer
            text-blue-custom
          "
          :class="{ 'text-gray-400': pageName !== 'CustomizeButton' }"
          @click="changePage('CustomizeButton')"
        >
          <span v-if="handleMenu" class="ml-2">Customize Button</span>
          <i class="fas fa-pencil-alt"></i>
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
    return {
      hideMenu: false,
    };
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
    handleMenu() {
      this.hideMenu = !this.hideMenu;
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
  color: #3f13a6;
}
</style>
