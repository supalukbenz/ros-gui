<template>
  <div class="flex flex-row">
    <SideBar></SideBar>
    <div class="m-10">
      <!-- <GraphContainer></GraphContainer> -->
      <GraphTopic></GraphTopic>
      <StreamingCamera></StreamingCamera>
    </div>
  </div>
</template>

<script>
import SideBar from '@/components/main/SideBar.vue';
// import GraphContainer from '@/components/robotTools/GraphContainer.vue';
import GraphTopic from '@/components/graph/GraphTopic.vue';
import StreamingCamera from '@/components/robotTools/StreamingCamera.vue';

export default {
  components: {
    SideBar,
    // GraphContainer,
    GraphTopic,
    StreamingCamera,
  },
};
</script>
