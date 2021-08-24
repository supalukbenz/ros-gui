<script>
import { Line } from 'vue-chartjs';
import ROSLIB from 'roslib';
import 'chartjs-plugin-streaming';
import 'chartjs-plugin-zoom';

export default {
  extends: Line,
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
      data: {
        labels: [],
        datasets: [
          {
            label: 'Dataset 1',

            fill: false,
            lineTension: 0.4,
            backgroundColor: '#f44336',
            borderColor: '#f44336',
            borderJoinStyle: 'miter',
            pointRadius: 0,
            showLine: true,
            data: [],
          },
        ],
      },

      // datacollection: {
      //   labels: [
      //     'January',
      //     'February',
      //     'March',
      //     'April',
      //     'May',
      //     'June',
      //     'July',
      //     'August',
      //     'September',
      //     'October',
      //     'November',
      //     'December',
      //   ],
      //   datasets: [
      //     {
      //       label: 'Data One',
      //       pointBackgroundColor: 'white',
      //       borderWidth: 1,
      //       pointBorderColor: '#249EBF',
      //       data: [60, 40, 20, 50, 90, 10, 20, 40, 50, 70, 90, 100],
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
                  this.data.datasets[0].data.push({
                    x: Date.now(),
                    y: Math.random() * 100,
                  });
                },
                delay: 2000,
              },
            },
          ],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                fontFamily: 'Arial',
                labelString: 'Moment',
                fontSize: 20,
                fontColor: '#6c757d',
              },
              ticks: {
                max: 100,
                min: 0,
              },
            },
          ],
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
      };
    },
  },
  async mounted() {
    // await this.updateSelectedLines();
    this.renderChart(this.data, this.options);
  },
  methods: {
    isNumeric(val) {
      return Number(parseFloat(val)) === val;
    },
    getNode(value, source, children_key = 'children') {
      for (var i in source) {
        var res = null;
        if (source[i].value === value) {
          res = source[i];
        } else if (source[i][children_key]) {
          res = this.getNode(value, source[i][children_key]);
        }
        if (res) {
          return res;
        }
      }
    },
    updateSelectedLines(data) {
      console.log(this.msgList, this.topicList);
      // remove not selected lines
      const labels = Array.from(this.chartReference.chartInstance.data.labels);
      console.log('update: remove', labels, data.selection);

      for (var i in labels) {
        console.log('inside for ', labels[i], !data.selection.includes(labels[i]));

        if (!data.selection.includes(labels[i])) {
          this.removeLineFromChart(labels[i]);
        }
      }

      // add selected lines
      for (i in data.selection) {
        const node = this.getNode(data.selection[i], data.source);
        const root_node = this.getNode(node.root, data.source);

        if (!node['children']) {
          //if node don't have children, it is leaf node.
          this.addLine(node.value, root_node.value, root_node.type);
        }
      }

      // register callback
      for (let topic_name in this.topics) {
        this.topics[topic_name].topic.subscribe(message => {
          // console.log('Received message on : ', message, topic_name);
          if (this.paused) {
            return;
          }

          var time = Date.now();

          if (this.useMsgTimeStamp && message['header'] && message['header']['stamp']) {
            time = Math.round(message.header.stamp.secs * 1000 + message.header.stamp.nsecs / 1e6);
          }

          // console.log('msg time', time, Date.now())
          var lines = this.topics[topic_name].lines;

          for (let i in lines) {
            //parse data
            const fieldname = lines[i].substr(topic_name.length + 1, lines[i].length); //remove topic_name

            const fieldnames = fieldname.split('/');
            let data = message;

            for (var j in fieldnames) {
              data = data[fieldnames[j]];
            }

            // todo add error handling
            // remove from line if data is array
            if (Array.isArray(data)) {
              lines.splice(i, 1);
            }

            // not remove since error in just one msg
            if (!this.isNumeric(data)) {
              return;
            }

            this.chartReference.chartInstance.data.datasets.forEach(function (dataset) {
              if (dataset['label'] === lines[i]) {
                dataset.data.push({
                  t: time,
                  //Date.now(), //message.header.stamp.secs// + message.header.stamp.nsecs*10e9,//
                  y: data,
                });
                return;
              }
            }, this);
          }

          this.chartReference.chartInstance.update({
            preservation: true,
          });
        });
      }

      this.data = data;
      this.editLinesOpen = false;
    },
    addLine(line_name, topic_name, topic_type) {
      // console.log(this.topics, topic_name, topic_name in this.topics)
      if (!(topic_name in this.topics)) {
        this.topics[topic_name] = {
          topic: new ROSLIB.Topic({
            ros: this.ros,
            name: topic_name,
            messageType: topic_type,
          }),
          lines: [line_name],
        };
      } else {
        // console.log(line_name, this.topics[topic_name].lines, this.topics[topic_name].lines.includes(topic_name))
        if (!this.topics[topic_name].lines.includes(line_name)) {
          this.topics[topic_name].lines.push(line_name);
        } else {
          return;
        }
      }

      this.addLine2Chart(line_name);
    },
    addLine2Chart(line_name) {
      // console.log('addLine', line_name)
      this.chartReference.chartInstance.data.datasets.push({
        label: line_name,
        borderColor: this.chartColors[this.chartColors.length % this.color_index],
        backgroundColor: this.chartColors[this.chartColors.length % this.color_index],
        fill: false,
        lineTension: 0,
        borderDash: [8, 4],
        data: [],
      });
      this.chartReference.chartInstance.data.labels.push(line_name);
      this.chartReference.chartInstance.update();
      this.color_index++;
    },
    removeLineFromChart(line_name) {
      //remove from chart data
      console.log(
        'removeLine',
        line_name,
        this.data.selection,
        this.chartReference.chartInstance.data.datasets
      );
      var datasets = this.chartReference.chartInstance.data.datasets;

      for (var i = 0; i < datasets.length; i++) {
        if (datasets[i]['label'] === line_name) {
          datasets.splice(i, 1);
          break;
        }
      }

      var labels = this.chartReference.chartInstance.data.labels;

      for (i in labels) {
        if (labels[i] === line_name) {
          labels.splice(i, 1);
        }
      }

      //remove from lines in topic
      for (var topic_name in this.topics) {
        for (i = 0; i < this.topics[topic_name].lines.length; i++) {
          if (this.topics[topic_name].lines[i] === line_name) {
            this.topics[topic_name].lines.splice(i, 1);
            break;
          }
        }
      }

      this.chartReference.chartInstance.update();
    },
    getRosInstance(ros, msgList, topicList) {
      console.log('getRosInstance', ros, msgList, topicList);
      this.ros = ros;
      this.msgList = msgList;
      this.topicList = topicList;
    },
    changeFrameRate(e) {
      this.chartReference.chartInstance.options.plugins.streaming.frameRate = e.target.value;
      this.frameRate = e.target.value;
      this.chartReference.chartInstance.update();
    },
    changeUseMsgTimeStamp(e) {
      // console.log(e.target.value)
      this.useMsgTimeStamp = e.target.value;
    },
    pause() {
      this.chartReference.chartInstance.options.plugins.streaming.pause = !this.paused;
      this.paused = !this.paused;
      this.chartReference.chartInstance.update();
    },
  },
};
</script>
