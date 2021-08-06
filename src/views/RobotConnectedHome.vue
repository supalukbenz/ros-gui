<template>
  <div class="m-10 flex flex-row">
    <SideBar></SideBar>
    <div class="ml-4">
      <!-- <GraphContainer></GraphContainer> -->
      <GraphTopic></GraphTopic>
    </div>
  </div>
</template>

<script>
import SideBar from '@/components/main/SideBar.vue';
// import GraphContainer from '@/components/robotTools/GraphContainer.vue';
import GraphTopic from '@/components/graph/GraphTopic.vue';

export default {
  components: {
    SideBar,
    // GraphContainer,
    GraphTopic,
  },
};
</script>
