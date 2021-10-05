<script>
import { Line, mixins } from 'vue-chartjs';
const { reactiveProp } = mixins;
// import ROSLIB from 'roslib';
import 'chartjs-plugin-streaming';
// import 'chartjs-plugin-zoom';

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: ['chartData', 'framerate'],
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
      options: {
        scales: {
          xAxes: [
            {
              // type: 'realtime',
              // realtime: {
              //   // parser: 'hh:mm:ss.ffff',
              //   unit: 'millisecond',
              //   // displayFormats: {
              //   //   millisecond: 'HH:mm:ss',
              //   // },
              //   onRefresh: () => {
              //     // this.data.datasets[0].data.push({
              //     //   x: Date.now(),
              //     //   y: Math.random() * 100,
              //     // });
              //   },
              //   delay: 2000,
              //   autoSkip: false,
              // },
              type: 'realtime',
              time: {
                unit: 'millisecond',
                displayFormats: {
                  millisecond: 'hh:mm:ss.SS',
                },
              },
              realtime: {
                unit: 'millisecond',
                onRefresh: () => {
                  //     // this.data.datasets[0].data.push({
                  //     //   x: Date.now(),
                  //     //   y: Math.random() * 100,
                  //     // });
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
                autoSkip: false,
              },
            },
          ],
        },
        responsive: true,
        maintainAspectRatio: false,
        zoomEnabled: true,
        animationEnabled: true,
        events: [],
        tooltips: {
          mode: 'nearest',
          intersect: false,
        },
        // pan: {
        //   enabled: true,
        //   drag: false,
        //   mode: 'xy',
        //   speed: 10,
        //   threshold: 10,
        // },
        // zoom: {
        //   enabled: true,
        //   drag: false,
        //   mode: 'xy',
        //   limits: {
        //     max: 10,
        //     min: 0.5,
        //   },
        //   rangeMin: {
        //     // x: 20,
        //     // y: 1000
        //   },
        //   rangeMax: {
        //     // x: 10,
        //     // y: 150
        //   },
        // },
        animation: {
          duration: 0, // general animation time
        },
        hover: {
          mode: 'nearest',
          intersect: false,
          animationDuration: 0, // duration of animations when hovering an item
        },
        responsiveAnimationDuration: 0, // animation duration after a resize
        plugins: {
          streaming: {
            frameRate: this.framerate,
          },
        },
        elements: {
          line: {
            tension: 0, // disables bezier curves
          },
        },
        legend: {
          display: true,
        },
      },
    };
  },
  computed: {
    // options() {
    //   return {
    //     scales: {
    //       xAxes: [
    //         {
    //           // type: 'realtime',
    //           // realtime: {
    //           //   // parser: 'hh:mm:ss.ffff',
    //           //   unit: 'millisecond',
    //           //   // displayFormats: {
    //           //   //   millisecond: 'HH:mm:ss',
    //           //   // },
    //           //   onRefresh: () => {
    //           //     // this.data.datasets[0].data.push({
    //           //     //   x: Date.now(),
    //           //     //   y: Math.random() * 100,
    //           //     // });
    //           //   },
    //           //   delay: 2000,
    //           //   autoSkip: false,
    //           // },
    //           type: 'realtime',
    //           time: {
    //             unit: 'millisecond',
    //             displayFormats: {
    //               millisecond: 'hh:mm:ss.SS',
    //             },
    //           },
    //           realtime: {
    //             unit: 'millisecond',
    //             onRefresh: () => {
    //               //     // this.data.datasets[0].data.push({
    //               //     //   x: Date.now(),
    //               //     //   y: Math.random() * 100,
    //               //     // });
    //             },
    //             delay: 2000,
    //           },
    //           ticks: {
    //             callback: function (value) {
    //               // console.log(value)
    //               return value;
    //             },
    //             maxRotation: 90,
    //             minRotation: 50,
    //             autoSkip: false,
    //           },
    //         },
    //       ],
    //     },
    //     responsive: true,
    //     maintainAspectRatio: false,
    //     zoomEnabled: true,
    //     animationEnabled: true,
    //     events: [],
    //     tooltips: {
    //       mode: 'nearest',
    //       intersect: false,
    //     },
    //     // pan: {
    //     //   enabled: true,
    //     //   drag: false,
    //     //   mode: 'xy',
    //     //   speed: 10,
    //     //   threshold: 10,
    //     // },
    //     // zoom: {
    //     //   enabled: true,
    //     //   drag: false,
    //     //   mode: 'xy',
    //     //   limits: {
    //     //     max: 10,
    //     //     min: 0.5,
    //     //   },
    //     //   rangeMin: {
    //     //     // x: 20,
    //     //     // y: 1000
    //     //   },
    //     //   rangeMax: {
    //     //     // x: 10,
    //     //     // y: 150
    //     //   },
    //     // },
    //     animation: {
    //       duration: 0, // general animation time
    //     },
    //     hover: {
    //       mode: 'nearest',
    //       intersect: false,
    //       animationDuration: 0, // duration of animations when hovering an item
    //     },
    //     responsiveAnimationDuration: 0, // animation duration after a resize
    //     plugins: {
    //       streaming: {
    //         frameRate: this.framerate,
    //       },
    //     },
    //     elements: {
    //       line: {
    //         tension: 0, // disables bezier curves
    //       },
    //     },
    //     legend: {
    //       display: true,
    //     },
    //   };
    // },
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
    framerate(val) {
      this.options.plugins.streaming.frameRate = val;
      this.renderLineChart();
    },
  },
};
</script>
