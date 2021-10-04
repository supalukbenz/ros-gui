<script>
import { Line, mixins } from 'vue-chartjs';
const { reactiveProp } = mixins;
// import ROSLIB from 'roslib';
import 'chartjs-plugin-streaming';
import 'chartjs-plugin-zoom';

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: ['chartData'],
  data() {
    return {
      topics: {},
      chartReference: null,
      chartColors: [
        'rgb(255, 99, 132)', //red
        'rgb(255, 159, 64)', //orange
        'rgb(255, 205, 86)', //yellow
        'rgb(75, 192, 192)', //green
        'rgb(54, 162, 235)', //blue
        'rgb(153, 102, 255)', //purple
        'rgb(201, 203, 207)', //grey
      ],
      colorIndex: 0,
    };
  },
  computed: {
    options() {
      return {
        scales: {
          xAxes: [
            {
              type: 'realtime',
              time: {
                parser: 'HH:mm:ss.SSS',
                unit: 'second',
                displayFormats: {
                  millisecond: 'HH:mm:ss',
                },
              },
              realtime: {
                parser: 'hh:mm:ss.ffff',

                onRefresh: () => {
                  // this.data.datasets[0].data.push({
                  //   x: Date.now(),
                  //   y: Math.random() * 100,
                  // });
                },
                delay: 2000,
              },
              ticks: {
                callback: function (value) {
                  // console.log(value)
                  return value;
                },
                maxRotation: 90,
                minRotation: 50,
                sampleSize: 5,
              },
            },
          ],
        },
        events: [],
        tooltips: {
          mode: 'nearest',
          intersect: false,
        },
        pan: {
          enabled: true,
          drag: false,
          mode: 'xy',
          speed: 10,
          threshold: 10,
        },
        zoom: {
          enabled: true,
          drag: false,
          mode: 'xy',
          limits: {
            max: 10,
            min: 0.5,
          },
          rangeMin: {
            // x: 20,
            // y: 1000
          },
          rangeMax: {
            // x: 10,
            // y: 150
          },
        },
        animation: {
          duration: 0, // general animation time
        },
        zoomEnabled: true,
        animationEnabled: true,
        hover: {
          mode: 'nearest',
          intersect: false,
          animationDuration: 0, // duration of animations when hovering an item
        },
        responsiveAnimationDuration: 0, // animation duration after a resize
        plugins: {
          streaming: {
            frameRate: 30,
          },
        },
        elements: {
          line: {
            tension: 0, // disables bezier curves
          },
        },

        // layout: {
        //     padding: {
        //         left: 50,
        //         right: 50,
        //         top: 50,
        //         bottom: 50
        //     }
        // }
        maintainAspectRatio: false,
        // legend: {
        //   display: true,
        // },
        responsive: true,
      };
    },
  },
  async mounted() {
    // await this.updateSelectedLines();
    this.renderLineChart();
  },
  methods: {
    renderLineChart() {
      this.renderChart(this.chartData, this.options);
    },
  },
  watch: {
    chartData() {
      this.$nextTick(() => {
        // this.$data._chart.destroy();
        this.renderLineChart();
        // this.$data._chart.update();
      });
    },
  },
};
</script>
