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
    this.renderChart(this.data, this.options);
  },
  methods: {},
};
</script>
