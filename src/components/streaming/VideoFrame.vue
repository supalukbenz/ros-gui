<template>
  <div>
    <iframe v-if="srcVideo !== ''" :width="width" :height="height" :src="srcVideo"> </iframe>
    <div
      class="border bg-gray-100 text-gray-300 flex justify-center text-5xl items-center"
      :style="{ width: width + 'px', height: height + 'px' }"
      v-else
    >
      <i class="fas fa-video-slash"></i>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    srcVideo: String,
    width: Number,
    height: Number,
    rosolutionVideo: Object,
  },
};
</script>

<style scoped>
.video {
  width: 640px;
  height: 480px;
}
</style>
