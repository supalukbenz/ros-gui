<template>
  <div class="h-full w-full">
    <div class="m-10">
      <GraphTopic></GraphTopic>
      <RealtimeChart></RealtimeChart>
    </div>
  </div>
</template>

<script>
import RealtimeChart from '@/components/graph/RealtimeChart.vue';
import GraphTopic from '@/components/graph/GraphTopic.vue';

export default {
  components: {
    RealtimeChart,
    GraphTopic,
  },
};
</script>
