<template>
  <div>
    <div class="mb-10" v-if="graphType === 'Line'">
      <!-- <apexchart width="500" type="bar" :options="chartOptions" :series="series"></apexchart> -->
      <h3>Realtime Line Chart</h3>
      <line-chart v-if="renderGraph" :framerate="framerate" :chartData="data"></line-chart>
      <line-chart v-else :framerate="framerate" :chartData="dataEmpty"></line-chart>
      <div
        class="
          flex flex-row
          items-center
          border border-l-3
          bg-gray-100
          rounded-lg
          w-fit
          pl-4
          pr-5
          mt-4
          relative
          transform-2
        "
        :class="[expandFramerate ? 'fade-out h-24' : 'fade-in h-14']"
      >
        <span class="text-left font-bold mr-2" :class="[expandFramerate ? '-mt-12' : '']"
          >Framerate: <span class="" v-if="!expandFramerate">{{ framerate }}</span></span
        >

        <VueSlideBar
          v-if="expandFramerate"
          class="w-72"
          v-model="framerate"
          :data="slider.data"
          :range="slider.range"
          :processStyle="slider.processStyle"
          :lineHeight="slider.lineHeight"
          :tooltipStyles="{ backgroundColor: '#8bc34a', borderColor: '#8bc34a' }"
        >
        </VueSlideBar>
        <div
          @click="handleFramerateExpand()"
          class="
            cursor-pointer
            bottom-0
            right-0
            absolute
            text-xl
            mr-2
            transform
            color-green
            hover:text-green-700
          "
          :class="[expandFramerate ? 'transform-255d' : 'transform-45d']"
        >
          <i class="fas fa-caret-right"></i>
        </div>
      </div>
    </div>
    <div v-if="graphType === 'ScatterPlot'">
      <Graph3d :scatterDataSetList="scatterDataSetList"></Graph3d>
    </div>
  </div>
</template>

<script>
import LineChart from '@/assets/chartjs/LineChart.vue';
import Graph3d from '@/components/graph/Graph3d.vue';
import VueSlideBar from 'vue-slide-bar';
import { mapGetters } from 'vuex';
import ROSLIB from 'roslib';
import $ from 'jquery';

export default {
  components: {
    LineChart,
    Graph3d,
    VueSlideBar,
  },
  computed: {
    ...mapGetters({
      robotConnected: 'getRobotConnected',
      msgList: 'getMsgList',
      topicList: 'getTopicList',
      dataTopic: 'getDataTopic',
      rosbridgeURL: 'getRosbridgeURL',
      rosbridge: 'getROS',
      selectedScatterTopic: 'getSelectedScatterTopic',
      lineGraphCloseModal: 'getLineGraphCloseModal',
    }),
    selectedScatterTopicLength() {
      return this.selectedScatterTopic.length;
    },
    dataSelection() {
      return this.dataTopic.selection;
    },
  },
  props: {
    graphType: String,
  },
  data() {
    return {
      topics: {},
      ros: null,
      data: {
        labels: [],
        datasets: [],
      },
      dataEmpty: {
        labels: [],
        datasets: [],
      },
      dataArray: [],
      pause: false,
      useMsgTimeStamp: false,
      renderGraph: false,
      graph3dconnected: false,
      topicScatter: {},
      scatterDataSetList: [],
      framerate: 30,
      expandFramerate: false,
      slider: {
        lineHeight: 7,
        processStyle: {
          backgroundColor: '#8bc34a',
        },
        data: [1, 10, 20, 30, 40, 50, 60],
        range: [
          {
            label: '1',
          },
          {
            label: '10',
          },
          {
            label: '20',
            // isHide: true,
          },
          {
            label: '30',
          },
          {
            label: '40',
          },
          {
            label: '50',
          },
          {
            label: '60',
          },
        ],
      },
    };
  },
  async mounted() {
    // if (!this.rosbridge.isConnected) {
    //   await this.rosbridge.connect(this.rosbridgeURL);
    //   this.ros = await new ROSLIB.Ros({
    //     // url: `ws://${ws_address}:9090`,
    //     url: this.rosbridgeURL,
    //   });
    // }
  },
  methods: {
    isNumeric(val) {
      return Number(parseFloat(val)) === val;
    },
    getNode(value, source, children_key = 'children') {
      for (let i in source) {
        let res = null;
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
    handleFramerateExpand() {
      this.expandFramerate = !this.expandFramerate;
      if (this.expandFramerate) {
        $('.transform-2').toggleClass('transform-active');
      }
    },
    removeLineFromChart(line_name) {
      var datasets = this.data.datasets;
      for (var i = 0; i < datasets.length; i++) {
        if (datasets[i]['label'] === line_name) {
          datasets.splice(i, 1);
          break;
        }
      }
      var labels = this.data.labels;
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
    },
    async updateLineChart(data) {
      const labels = Array.from(this.data.labels);
      for (var i in labels) {
        if (!data.selection.includes(labels[i])) {
          this.removeLineFromChart(labels[i]);
        }
      }
      for (let i in data.selection) {
        const node = this.getNode(data.selection[i], data.source);
        const rootNode = this.getNode(node.root, data.source);
        if (!node['children']) {
          let nodeValue = node.value;
          if (data.arrayIndexTopic.length > 0) {
            const topic = data.arrayIndexTopic.find(a => a.value === nodeValue);
            if (topic !== undefined) {
              nodeValue = `${topic.value}/${topic.index}`;
            }
          }
          await this.addLine(nodeValue, rootNode.value, rootNode.type);
        }
        for (let topicName in this.topics) {
          this.topics[topicName].topic.subscribe(message => {
            if (this.pause) {
              return;
            }
            let time = Date.now();
            if (message['header'] && message['header']['stamp']) {
              time = Math.round(
                message.header.stamp.secs * 1000 + message.header.stamp.nsecs / 1e6
              );
            }
            let lines = this.topics[topicName].lines;
            for (let l in lines) {
              const fieldName = lines[l].substr(topicName.length + 1, lines[l].length);
              const field = fieldName.split('/');
              let dataMsg = message;
              console.log('dataMsg', dataMsg);
              for (let f in field) {
                dataMsg = dataMsg[field[f]];
              }
              const value = data.selection[i];
              if (data.arrayIndexTopic.length > 0) {
                const topic = data.arrayIndexTopic.find(a => a.value === value);
                if (topic !== undefined) {
                  if (Array.isArray(dataMsg)) {
                    if (dataMsg.length < topic.index) {
                      dataMsg = dataMsg[topic.index];
                    }
                  }
                }
              }
              if (Array.isArray(dataMsg)) {
                lines.splice(l, 1);
                console.log('array');
              }
              if (!this.isNumeric(dataMsg)) {
                console.log('isNumeric');
                return;
              } else {
                // dataMsg = Number(dataMsg.toLocaleString('fullwide', { useGrouping: false }));
              }

              this.data.datasets.forEach(dataset => {
                if (dataset['label'] === lines[l]) {
                  dataset.data.push({
                    x: time,
                    y: dataMsg,
                  });
                  return;
                }
              });
            }
          });
        }
      }
      if (data.selection.length > 0) {
        this.renderGraph = true;
      }
    },
    async updateScatterPlot(data) {
      let plot = [];
      for (let i in data.selection) {
        const node = this.getNode(data.selection[i], data.source);
        const rootNode = this.getNode(node.root, data.source);
        console.log('node', node);
        console.log('rootNode', rootNode);
        let topic = await this.addPlot(node.value, rootNode.value, rootNode.type);
        console.log('topic', topic);
        const fieldName = data.selection[i].substr(
          rootNode.value.length + 1,
          data.selection[i].length
        );
        await topic.subscribe(async message => {
          let fieldValue = await message[fieldName];
          plot.push(fieldValue);
          topic.unsubscribe();
        });
      }
      return plot;
    },
    async reconnectROS() {
      this.ros = await new ROSLIB.Ros({
        url: this.rosbridgeURL,
      });
    },
    async addPlot(plot, topicName, topicType) {
      await this.reconnectROS();
      let topic = new ROSLIB.Topic({
        ros: this.ros,
        name: topicName,
        messageType: topicType,
      });
      return topic;
    },
    async addLine(line, topicName, topicType) {
      await this.reconnectROS();
      if (!(topicName in this.topics)) {
        this.topics[topicName] = {
          topic: new ROSLIB.Topic({
            ros: this.ros,
            name: topicName,
            messageType: topicType,
          }),
          lines: [line],
        };
      } else {
        // console.log(line_name, this.topics[topic_name].lines, this.topics[topic_name].lines.includes(topic_name))
        if (!this.topics[topicName].lines.includes(line)) {
          this.topics[topicName].lines.push(line);
        } else {
          return;
        }
      }
      this.addLineGraph(line);
    },
    addLineGraph(lineName) {
      const bgColor = this.generateColor();
      this.data.datasets.push({
        label: lineName,
        borderColor: bgColor,
        backgroundColor: bgColor,
        fill: false,
        lineTension: 0,
        // spanGaps: true,
        // borderDash: [8, 4],
        data: [],
      });
      this.data.labels.push(lineName);
    },
    generateColor() {
      const randomColor = Math.floor(Math.random() * 16777215).toString(16);
      return `#${randomColor}`;
    },
  },
  watch: {
    dataTopic: {
      handler(data) {
        this.renderGraph = false;
        this.updateLineChart(data);
      },
      deep: true,
    },
    lineGraphCloseModal(val) {
      if (val) {
        this.renderGraph = false;
        this.updateLineChart(this.dataTopic);
      }
    },
    // dataSelectionLength() {
    //   this.renderGraph = false;
    //   this.updateLineChart(this.dataTopic);
    // },
    selectedScatterTopic: {
      async handler(data) {
        const dataScatter = {
          source: this.dataTopic.source,
          selection: data,
        };
        // if (val <= 0) {
        // this.topicScatter = {};
        // }
        let interval;
        if (data.length <= 0) {
          console.log('clear');
          clearInterval(interval);
        }
        interval = setInterval(async () => {
          const scatterDataSet = await this.updateScatterPlot(dataScatter);
          this.scatterDataSetList.push(scatterDataSet);
          // this.scatterDataSet = [];
        }, 4000);
      },
      deep: true,
    },
    selectedScatterTopicLength() {
      // console.log('this.selectedScatterTopic', this.selectedScatterTopic);
    },
  },
};
</script>

<style>
.small {
  max-width: 600px;
  margin: 150px auto;
}

.border-l-3 {
  border-left: 3px solid #8bc34a !important;
}

.color-green {
  color: #8bc34a;
}

.fade-in {
  -webkit-animation: fadeInRight 1s;
  animation: fadeInRight 1s;
}

.fade-out {
  -webkit-animation: fadeInLeft 1s;
  animation: fadeInLeft 1s;
}

.transform-255d {
  transform: rotate(225deg);
}

.transform-45d {
  transform: rotate(45deg);
}

@keyframes fadeInLeft {
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  0% {
    opacity: 0;
    transform: translateX(20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0px);
  }
}

.w-fit {
  width: fit-content;
}
</style>
