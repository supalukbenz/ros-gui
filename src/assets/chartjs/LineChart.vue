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
    };
  },
  computed: {
    options() {
      return {
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
                callback: value => {
                  return value;
                },
                maxRotation: 90,
                minRotation: 50,
                autoSkip: false,
              },
            },
          ],
          yAxes: [
            {
              // type: 'logarithmic',
              // position: 'left',
              // grace: '5%',
              display: true,
              ticks: {
                beginAtZero: true,
                // autoSkip: true,
                // callback: value => {
                //   const num = value.toLocaleString('fullwide', { useGrouping: false }); //pass tick values as a string into Number function
                //   return num;
                // },
                callback: value => {
                  let num = this.addUnitToNum(value);
                  return num;
                },
              },
            },
          ],
        },
        responsive: true,
        maintainAspectRatio: false,
        // zoomEnabled: true,
        animationEnabled: true,
        events: ['click', 'mouseout'],
        tooltips: {
          mode: 'nearest',
          // events: ['click', 'mouseout'],
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
    addUnitToNum(expoNum) {
      var data = String(expoNum).split(/[eE]/);
      if (data.length === 1) {
        return data[0];
      } else {
        const unit = Number(data[1]);
        let num = Number(data[0]);
        if (unit >= 15 || unit <= -15) {
          var shortNum = Number(data[0]).toFixed(2);
          if (unit < 0) {
            var unitNegative = String(unit).split(/[-]/);
            return `${shortNum} * 10^${unitNegative[1]}`;
          }
          return `${shortNum} * 10^${unit}`;
        } else if (unit >= 12 || unit <= -12) {
          return num / 12 + 'T';
        } else if (unit >= 9 || unit <= -9) {
          return num / 9 + 'B';
        } else if (unit >= 6 || unit <= -6) {
          return num / 6 + 'M';
        } else if (unit >= 3 || unit <= -3) {
          return num / 3 + 'K';
        }
        return num;
      }
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
