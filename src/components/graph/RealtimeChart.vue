<template>
  <div>
    <div>
      <!-- <apexchart width="500" type="bar" :options="chartOptions" :series="series"></apexchart> -->
    </div>
    <line-chart></line-chart>
  </div>
</template>

<script>
import LineChart from '@/assets/chartjs/LineChart.vue';

export default {
  components: {
    LineChart,
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>

<style>
.small {
  max-width: 600px;
  margin: 150px auto;
}
</style>
