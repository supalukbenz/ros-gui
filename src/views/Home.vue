<template>
  <div
    class="bg-cover bg-no-repeat min-h-100"
    :style="{
      backgroundImage: `url(${require('@/assets/images/homepage_bg_2.webp')})`,
    }"
  >
    <RobotList></RobotList>
  </div>
</template>

<script>
import RobotList from '@/components/robotConnection/RobotList.vue';

export default {
  name: 'Home',
  components: {
    RobotList,
  },
  mounted() {},
};
</script>

<style scoped>
.background-size-100 {
  background-size: 100% 100%;
}

.min-h-100 {
  min-height: 100vh;
}
</style>
