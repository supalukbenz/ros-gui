<template>
  <div
    class="bg-cover bg-no-repeat background-size-100"
    :style="{
      backgroundImage: `url(${require('@/assets/images/vector-bg.webp')})`,
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
</style>
