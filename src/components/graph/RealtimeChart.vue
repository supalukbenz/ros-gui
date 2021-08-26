<template>
  <div>
    <div>
      <!-- <apexchart width="500" type="bar" :options="chartOptions" :series="series"></apexchart> -->
    </div>
    <line-chart v-if="renderGraph" :data="data"></line-chart>
  </div>
</template>

<script>
import LineChart from '@/assets/chartjs/LineChart.vue';
import { mapGetters } from 'vuex';
import ROSLIB from 'roslib';

export default {
  components: {
    LineChart,
  },
  computed: {
    ...mapGetters({
      robotConnected: 'getRobotConnected',
      msgList: 'getMsgList',
      topicList: 'getTopicList',
      dataTopic: 'getDataTopic',
      rosbridgeURL: 'getRosbridgeURL',
      rosbridge: 'getROS',
    }),
  },
  data() {
    return {
      topics: {},
      ros: null,
      data: {
        labels: [],
        datasets: [],
      },
      pause: false,
      useMsgTimeStamp: false,
      renderGraph: false,
    };
  },
  async mounted() {
    if (!this.rosbridge.isConnected) {
      await this.rosbridge.connect(this.rosbridgeURL);
      this.ros = await new ROSLIB.Ros({
        // url: `ws://${ws_address}:9090`,
        url: this.rosbridgeURL,
      });
    }
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
    async updateLineChart(data) {
      for (let i in data.selection) {
        const node = this.getNode(data.selection[i], data.source);
        const rootNode = this.getNode(node.root, data.source);
        if (!node['children']) {
          await this.addLine(node.value, rootNode.value, rootNode.type);
        }
        for (let topicName in this.topics) {
          this.topics[topicName].topic.subscribe(message => {
            if (this.pause) {
              return;
            }
            // let time = Date.now();
            // if (this.useMsgTimeStamp && message['header'] && message['header']['stamp']) {
            //   time = Math.round(
            //     message.header.stamp.secs * 1000 + message.header.stamp.nsecs / 1e6
            //   );
            // }
            let lines = this.topics[topicName].lines;
            for (let l in lines) {
              const fieldName = lines[l].substr(topicName.length + 1, lines[l].length);
              const field = fieldName.split('/');
              let dataMsg = message;
              for (let f in field) {
                dataMsg = dataMsg[field[f]];
              }

              if (Array.isArray(dataMsg)) {
                lines.splice(l, 1);
              }
              if (!this.isNumeric(dataMsg)) {
                return;
              }

              this.data.datasets.forEach(dataset => {
                if (dataset['label'] === lines[l]) {
                  dataset.data.push({
                    x: new Date().getTime(),
                    y: dataMsg,
                  });
                  return;
                }
              });
            }
          });
        }
      }
      this.renderGraph = true;
    },
    async reconnectROS() {
      this.ros = await new ROSLIB.Ros({
        url: this.rosbridgeURL,
      });
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
        borderDash: [8, 4],
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
  },
};
</script>

<style>
.small {
  max-width: 600px;
  margin: 150px auto;
}
</style>
