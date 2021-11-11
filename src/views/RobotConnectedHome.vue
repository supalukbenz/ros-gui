<template>
  <div class="h-screen max-w-screen-xl mx-auto">
    <Loading v-if="!isConnected"></Loading>
    <div class="modal fade z-200" role="dialog" id="errorConnectionModal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Connection Error</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="font-bold text-left text-red-500">Cannot connect to ROS bridge server</div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="redirectToRobotList()">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="flex flex-row w-full"> -->
    <div v-if="isConnected" class="flex flex-auto flex-col justify-between py-4 mx-10">
      <!-- <div class="mr-5 mb-10"> -->
      <Graph class="z-50" v-show="routeName === 'Graph'"></Graph>
      <StreamingVideo v-show="routeName === 'StreamingVideo'"></StreamingVideo>
      <CustomizeButton v-show="routeName === 'CustomizeButton'"></CustomizeButton>
      <!-- </div> -->
    </div>
    <!-- <div class="mr-5 mb-10">
      <Graph v-show="routeName === 'Graph'"></Graph>
      <StreamingVideo v-show="routeName === 'StreamingVideo'"></StreamingVideo>
      <CustomizeButton v-show="routeName === 'CustomizeButton'"></CustomizeButton>
      <LogMessage></LogMessage>
    </div> -->
    <!-- </div> -->
    <LogMessage></LogMessage>
  </div>
</template>

<script>
import LogMessage from '@/components/main/LogMessage.vue';
import Graph from '@/views/Graph.vue';
import StreamingVideo from '@/views/StreamingVideo.vue';
import CustomizeButton from '@/views/CustomizeButton.vue';
import Loading from '@/components/main/Loading.vue';
import ROSLIB from 'roslib';
import { mapGetters } from 'vuex';
// import $ from 'jquery';

export default {
  components: {
    CustomizeButton,
    Graph,
    StreamingVideo,
    Loading,
    LogMessage,
  },
  data() {
    return {
      isConnected: false,
      countConnected: false,
      ros: null,
      msg: null,
      nodes: [],
      // nodeList: [],
      // paramList: [],
      serviceList: [],
      // topicMsg: [],
      loadDataState: false,
      errorCount: 0,
      alertError: false,
    };
  },
  computed: {
    ...mapGetters({
      robotList: 'getRobotList',
      rosbridgeURL: 'getRosbridgeURL',
      robotConnected: 'getRobotConnected',
      msgList: 'getMsgList',
      topicList: 'getTopicList',
      topicMsg: 'getTopicMsg',
      paramList: 'getParamList',
      nodeList: 'getNodeList',
      logMsg: 'getLogMessage',
    }),
    routeName() {
      return this.$route.name;
    },
  },
  mounted() {
    this.alertError = false;
    this.rosConnection();
    setInterval(() => {
      this.rosConnection();
      if (this.ros === null || !this.ros.isConnected) {
        this.errorCount = this.errorCount + 1;
      }
      // if (this.errorCount === 100) {
      //   this.alertError = true;
      //   this.isConnected = true;
      //   // setInterval(() => {
      //   //   $('#errorConnectionModal').modal('show');
      //   // }, 5000);
      //   // $('#errorConnectionModal').modal('hide');
      //   clearInterval(interval);
      //   this.$router.push({
      //     name: 'Home',
      //   });
      // }
    }, 1000);
    if (this.isConnected) {
      this.loadData();
      this.setLogMessage();
    }
  },
  methods: {
    async rosConnection() {
      if (this.isConnected) {
        return;
      }

      if (this.ros) {
        this.ros.close(); // Close old connection
        this.ros = null;
        return;
      }

      this.ros = await new ROSLIB.Ros({ url: this.rosbridgeURL });

      this.ros.on('connection', async () => {
        await this.loadData();
        await this.setLogMessage();

        this.isConnected = true;
        this.$store.dispatch('updateROS', this.ros);
      });

      this.ros.on('error', () => {
        this.isConnected = false;
      });

      this.ros.on('close', () => {
        this.isConnected = false;
      });
    },
    redirectToRobotList() {
      this.$router.push({
        name: 'Home',
      });
    },
    async setTopicList() {
      await this.ros.getTopics(topic => {
        topic.types.forEach(async (msgName, i) => {
          if (msgName in this.msgList === false) {
            await this.getMsgROSInfo(msgName, 'msgROS', topic.topics[i]);
          }
          if (!this.topicMsg.some(t => t.type.includes(msgName))) {
            await this.getMsgROSInfo(msgName, 'topicMsgROS', topic.topics[i]);
          }
        });
        this.$store.dispatch('updateTopicList', topic);
        // this.topics = topic;
      });

      // const msgValue = Object.values(this.msgList);
      // let topicMsg = msgValue.map(m => {
      //   let index = this.topicList.types.findIndex(t => t === m.type);
      //   m.topicName = this.topicList.topics[index];
      //   return m;
      // });
      // return topicMsg;
    },
    parseTypedef(typedef) {
      let info = typedef.map(inf => ({
        type: inf.type,
        members: inf.examples.map((e, i) => ({
          example: inf.examples[i],
          name: inf.fieldnames[i],
          length: inf.fieldarraylen[i],
          type: inf.fieldtypes[i],
        })),
      }));
      let member = this.findMembers(info, info[0]);
      return member;
    },
    findMembers(allInfo, info) {
      let obj = info;
      if (obj) {
        for (let e of obj.members) {
          if (allInfo.find(i => e.type === i.type)) {
            e.members = allInfo.find(i => e.type === i.type).members;
          }
          if (e.members) {
            this.findMembers(allInfo, e);
          }
        }
      }
      return obj;
    },
    async getMsgROSInfo(msgName, state, topicName) {
      const msgDetails = new ROSLIB.Service({
        ros: this.ros,
        name: '/rosapi/message_details',
        serviceType: 'rosapi/MessageDetails',
      });
      const req = new ROSLIB.ServiceRequest({
        type: msgName,
      });
      if (state === 'msgROS') {
        msgDetails.callService(req, result => {
          let currentMsgList = this.msgList;
          result.typedefs.forEach(data => {
            currentMsgList[data.type] = data;
            const parseTypedef = this.parseTypedef(result.typedefs);
            currentMsgList[data.type].info = parseTypedef;
          });
          const parsedObj = JSON.parse(JSON.stringify(currentMsgList));
          this.$store.dispatch('updateMsgList', parsedObj);
          this.msg = parsedObj;
        });
      } else {
        this.ros.getMessageDetails(msgName, typedef => {
          let currentTopicMsg = this.topicMsg;
          const topicMsgForm = {
            name: topicName,
            type: msgName,
            info: this.parseTypedef(typedef),
          };
          currentTopicMsg.push(topicMsgForm);
          this.$store.dispatch('updateTopicMsg', currentTopicMsg);
        });
      }
    },
    async setNodeList() {
      await this.ros.getNodes(node => {
        node.forEach(async nodeName => {
          if (!this.nodeList.some(n => n.name.includes(nodeName))) {
            await this.getNodesROSInfo(nodeName);
          }
        });
      });
    },
    getNodesROSInfo(name) {
      const nodeDetails = new ROSLIB.Service({
        ros: this.ros,
        name: '/rosapi/node_details',
        serviceType: 'rosapi/NodeDetails',
      });
      const req = new ROSLIB.ServiceRequest({
        node: name,
      });
      nodeDetails.callService(req, result => {
        let currentNodeList = this.nodeList;
        const nodeForm = {
          name,
          publishing: result.publishing,
          subscribing: result.subscribing,
          services: result.services,
        };
        // const parsedObj = JSON.parse(JSON.stringify(currentNodeList));
        currentNodeList.push(nodeForm);
        this.$store.dispatch('updateNodeList', currentNodeList);
      });
    },
    async setParams() {
      await this.ros.getParams(params => {
        params.forEach(async param => {
          if (!this.paramList.some(p => p.name.includes(param))) {
            await this.getParamsROSInfo(param);
          }
        });
      });
    },
    getParamsROSInfo(name) {
      const param = new ROSLIB.Param({
        ros: this.ros,
        name: name,
      });
      const nameArray = name.split('/');
      let currentParamList = this.paramList;
      param.get(value => {
        let paramForm = null;
        if (nameArray.length > 2) {
          paramForm = {
            node: `/${nameArray[1]}`,
            name: name,
            value: value,
          };
        } else {
          paramForm = {
            name: name,
            value: value,
          };
        }
        currentParamList.push(paramForm);
        this.$store.dispatch('updateParamList', currentParamList);
      });
    },
    setServices() {
      this.ros.getServices(service => {
        service.forEach(async data => {
          if (data in this.serviceList === false) {
            await this.getServicesROSInfo(data);
          }
        });
      });
    },
    async getServicesROSInfo(data) {
      let serviceDetail = new ROSLIB.Service({
        ros: this.ros,
        name: '/rosapi/service_request_details',
        serviceType: 'rosapi/ServiceRequestDetails',
      });
      const req = new ROSLIB.ServiceRequest({
        type: data,
      });
      serviceDetail.callService(req, result => {
        console.log('serviceDetail req', req);
        let currentServiceList = this.serviceList;
        result.typedefs.forEach(data => {
          currentServiceList[data] = data;
          const parseTypedef = this.parseTypedef(result.typedefs);
          currentServiceList[data].request_info = parseTypedef;
        });
        const parsedObj = JSON.parse(JSON.stringify(currentServiceList));
        console.log('parsedObj', parsedObj);
      });
    },
    async loadData() {
      await Promise.all([
        this.setTopicList(),
        this.setNodeList(),
        this.setParams(),
        this.setServices(),
      ]);
      this.loadDataState = true;
    },
    filterROSTopic(topic) {
      const excludeList = [
        '/rosapi',
        '/rosout',
        '/rosversion',
        '/run_id',
        '/rosdistro',
        '/rosbridge_websocket',
      ];
      return !excludeList.includes(topic);
    },
    addZeroToTime(i) {
      return i < 10 ? `0${i}` : `${i}`;
    },
    diffTopicList(newTopic) {
      const diffTopic = newTopic.filter(n => {
        return this.topicList.topics.indexOf(n) == -1;
      });

      return diffTopic;
    },
    setLogMessage() {
      const logTopic = new ROSLIB.Topic({
        ros: this.ros,
        name: '/rosout',
        messageType: 'rosgraph_msgs/Log',
      });

      logTopic.subscribe(message => {
        let currentLogMsg = this.logMsg;
        if (!this.filterROSTopic(message.name)) {
          return;
        }
        if (this.diffTopicList(message.topics).length > 0) {
          this.loadData();
        }
        const nameArray = message.name.split('/');
        const date = new Date(message.header.stamp.secs * 1e3 + message.header.stamp.nsecs * 1e-6);

        message.name = nameArray.length > 1 ? nameArray[1] : message.name;
        message.dateString = `${this.addZeroToTime(date.getHours())}:${this.addZeroToTime(
          date.getMinutes()
        )}:${this.addZeroToTime(date.getSeconds())}.${this.addZeroToTime(date.getMilliseconds())}`;
        currentLogMsg.push(message);
        this.$store.dispatch('updateLogMessage', currentLogMsg);
      });
    },
  },
};
</script>

<style scoped>
.flex-content {
  flex: 1 0 auto;
}
.p-absolute {
  position: absolute !important;
}
</style>
