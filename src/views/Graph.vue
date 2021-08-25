<template>
  <div class="flex flex-row h-full">
    <SideBar></SideBar>
    <div class="m-10 w-2/3">
      <GraphTopic></GraphTopic>
      <RealtimeChart></RealtimeChart>
      <!-- <GraphTopic></GraphTopic>
      <GraphContainer></GraphContainer> -->
    </div>
  </div>
</template>

<script>
import SideBar from '@/components/main/SideBar.vue';
import RealtimeChart from '@/components/graph/RealtimeChart.vue';
import GraphTopic from '@/components/graph/GraphTopic.vue';
// import GraphContainer from '@/components/graph/GraphContainer.vue';

export default {
  components: {
    SideBar,
    RealtimeChart,
    GraphTopic,
    // GraphContainer,
  },
};
</script>
