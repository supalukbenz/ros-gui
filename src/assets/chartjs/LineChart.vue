<script>
import { Line } from 'vue-chartjs';
// import ROSLIB from 'roslib';
import 'chartjs-plugin-streaming';
import 'chartjs-plugin-zoom';

export default {
  extends: Line,
  props: {
    data: Object,
  },
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
      // data: {
      //   labels: [],
      //   datasets: [
      //     {
      //       label: 'Dataset 1',

      //       fill: false,
      //       lineTension: 0.4,
      //       backgroundColor: '#f44336',
      //       borderColor: '#f44336',
      //       borderJoinStyle: 'miter',
      //       pointRadius: 0,
      //       showLine: true,
      //       data: [],
      //     },
      //     {
      //       label: 'Dataset 2',

      //       fill: false,
      //       lineTension: 0.4,
      //       backgroundColor: '#ffc107',
      //       borderColor: '#ffc107',
      //       borderJoinStyle: 'miter',
      //       pointRadius: 0,
      //       showLine: true,
      //       data: [],
      //     },
      //   ],
      // },
      option: {
        scales: {
          xAxes: [
            {
              type: 'realtime',
              // realtime: {
              //   parser: 'h:mm:ss',
              //   // displayFormats: {
              //   //   second: 'h:mm:ss a',
              //   //   // millisecond: 'h:mm:ss.SSS a',
              //   //   // minute: 'h:mm a'
              //   // }
              // },
              // realtime: {
              //   unit: 'second',
              //   displayFormats: {
              //     second: 'h:mm:ss a',
              //   },
              //   // min: new Date().getTime(),
              // },
              // ticks: {
              //   // callback: function (value) {
              //   //   // console.log(value)
              //   //   return value;
              //   // },
              //   // maxRotation: 0,
              //   // minRotation: 0,
              //   // sampleSize: 5,
              //   maxRotation: 0,
              //   minRotation: 0,
              //   sampleSize: 5,
              // },
            },
          ],
        },
        tooltips: {
          mode: 'nearest',
          intersect: false,
        },
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
            frameRate: 1,
          },
        },
        elements: {
          line: {
            tension: 0, // disables bezier curves
          },
        },
        pan: {
          enabled: true, // Enable panning
          mode: 'x', // Allow panning in the x direction
          rangeMin: {
            x: null, // Min value of the delay option
          },
          rangeMax: {
            x: null, // Max value of the delay option
          },
        },
        zoom: {
          enabled: true, // Enable zooming
          mode: 'x', // Allow zooming in the x direction
          rangeMin: {
            x: null, // Min value of the duration option
          },
          rangeMax: {
            x: null, // Max value of the duration option
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
      },
    };
  },
  computed: {
    options() {
      return {
        scales: {
          xAxes: [
            {
              type: 'realtime',
              realtime: {
                onRefresh: () => {
                  // this.data.datasets[0].data.push({
                  //   x: Date.now(),
                  //   y: Math.random() * 100,
                  // });
                },
                delay: 2000,
              },
            },
          ],
        },
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
    this.renderChart(this.data, this.options);
  },
  methods: {},
};
</script>
