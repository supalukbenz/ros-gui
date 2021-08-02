<template>
  <div>
    <RobotList></RobotList>
    <!-- <ConnectionPart></ConnectionPart> -->
  </div>
</template>

<script>
import RobotList from '@/components/robotConnection/RobotList.vue';
// import ConnectionPart from '@/components/robotConnection/ConnectionPart.vue';

export default {
  name: 'Home',
  components: {
    RobotList,
    // ConnectionPart,
  },
};
</script>
