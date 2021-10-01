<template>
  <div class="h-full w-full mb-32">
    <div class="m-10">
      <CheckboxTopic graphState="LineChart"></CheckboxTopic>
      <RealtimeChart graphType="Line" class="mb-10"></RealtimeChart>
      <hr />
      <CheckboxTopic graphState="Graph3d" class="mt-10"></CheckboxTopic>
      <RealtimeChart graphType="ScatterPlot" class="mb-10"></RealtimeChart>
    </div>
  </div>
</template>

<script>
import RealtimeChart from '@/components/graph/RealtimeChart.vue';
import CheckboxTopic from '@/components/graph/CheckboxTopic.vue';

export default {
  components: {
    RealtimeChart,
    CheckboxTopic,
  },
};
</script>
