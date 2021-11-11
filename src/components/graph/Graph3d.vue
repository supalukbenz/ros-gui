<template>
  <section class="charts">
    <h3>ScatterPlot Chart</h3>
    <div id="container"></div>
    <!-- <vue-highcharts :options="options" ref="chart"></vue-highcharts> -->
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
// import VueHighcharts from 'vue2-highcharts';
import Highcharts from 'highcharts';

// (function (H) {
//   H.wrap(H.Navigator.prototype, 'drawMasks', function (proceed, zoomedMin, zoomedMax) {
//     if (!H.isNumber(zoomedMin) || !H.isNumber(zoomedMax)) {
//       return;
//     }
//     proceed.apply(this, Array.prototype.slice.call(arguments, 1));
//   });
// })(Highcharts);
// Give the points a 3D feel by adding a radial gradient
// Highcharts.setOptions({
//   colors: Highcharts.getOptions().colors.map(function (color) {
//     return {
//       radialGradient: {
//         cx: 0.4,
//         cy: 0.3,
//         r: 0.5,
//       },
//       stops: [
//         [0, color],
//         [1, Highcharts.color(color).brighten(-0.2).get('rgb')],
//       ],
//     };
//   }),
// });
export default {
  components: {
    // VueHighcharts,
  },
  props: {
    scatterDataSetList: Array,
  },
  computed: {
    ...mapGetters({
      selectedScatterTopic: 'getSelectedScatterTopic',
    }),
    selectedScatterTopicLength() {
      return this.selectedScatterTopic.length;
    },
  },
  data() {
    return {
      chart: null,
      posX: null,
      posY: null,
      beta: null,
      sensitivity: null,
      handlers: null,
      data: [],
    };
  },
  mounted() {
    this.chart = new Highcharts.Chart({
      chart: {
        renderTo: 'container',
        margin: 100,
        type: 'scatter3d',
        animation: false,
        options3d: {
          enabled: true,
          alpha: 10,
          beta: 30,
          depth: 250,
          viewDistance: 5,
          fitToPlot: false,
          frame: {
            bottom: { size: 1, color: 'rgba(0,0,0,0.02)' },
            back: { size: 1, color: 'rgba(0,0,0,0.04)' },
            side: { size: 1, color: 'rgba(0,0,0,0.06)' },
          },
        },
      },
      title: {
        text: 'Draggable box',
      },
      subtitle: {
        text: '',
      },
      plotOptions: {
        scatter: {
          width: 10,
          height: 10,
          depth: 10,
        },
      },
      yAxis: {
        // min: 0,
        // max: 10,
        title: null,
      },
      xAxis: {
        // min: 0,
        // max: 10,
        gridLineWidth: 1,
      },
      zAxis: {
        // min: 0,
        // max: 10,
        showFirstLabel: false,
      },
      legend: {
        enabled: false,
      },
      series: [
        {
          name: 'Data',
          colorByPoint: true,
          accessibility: {
            exposeAsGroupOnly: true,
          },
          lineWidth: 2,
          data: [[0, 0, 0]],
        },
      ],
    });
  },
  methods: {
    renderScatterChart(data) {
      // this.chart.series[0].update(
      //   {
      //     data: data,
      //   },
      //   true
      // );

      // data.forEach(element => {
      //   this.chart.series[0].setData(element, false);
      // });
      console.log('data', data);
      this.chart.series[0].setData(data);
      // this.chart.redraw();
    },
  },
  watch: {
    // scatterDataSetList(val) {
    //   if (this.selectedScatterTopic.length > 0) {
    //     this.renderScatterChart(val);
    //   } else {
    //     this.renderScatterChart([[0, 0, 0]]);
    //   }
    // },
    selectedScatterTopic: {
      handler(data) {
        if (data.length > 0) {
          this.renderScatterChart(data);
        } else {
          this.renderScatterChart([[0, 0, 0]]);
        }
      },
      deep: true,
    },
  },
};
</script>
