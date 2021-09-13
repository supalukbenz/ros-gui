<template>
  <div class="h-full">
    <Loading v-if="!isConnected"></Loading>
    <div class="flex flex-row h-full w-full">
      <SideBar class="w-56"></SideBar>
      <div v-if="isConnected" class="flex-auto mr-5 mb-10">
        <Graph v-show="routeName === 'Graph'"></Graph>
        <StreamingVideo v-show="routeName === 'StreamingVideo'"></StreamingVideo>
        <CustomizeButton
          v-show="routeName === 'CustomizeButton' && loadDataState"
        ></CustomizeButton>
      </div>
    </div>
  </div>
</template>

<script>
import SideBar from '@/components/main/SideBar.vue';
import Graph from '@/views/Graph.vue';
import StreamingVideo from '@/views/StreamingVideo.vue';
import CustomizeButton from '@/views/CustomizeButton.vue';
import Loading from '@/components/main/Loading.vue';
import ROSLIB from 'roslib';
import { mapGetters } from 'vuex';
// import ConnectionPartVue from '../components/robotConnection/ConnectionPart.vue';
// import { Observable } from 'rxjs';
// import { forkJoin } from 'rxjs';
// import { map, filter } from 'rxjs/operators';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/mergeMap';
// import { forkJoin } from 'rxjs/observable/forkJoin';

export default {
  components: {
    SideBar,
    CustomizeButton,
    Graph,
    StreamingVideo,
    Loading,
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
    }),
    routeName() {
      return this.$route.name;
    },
  },
  created() {
    // setInterval(() => console.log('wow'), 1000);
    this.rosConnection();
    // setInterval(() => {
    //   this.rosConnection();
    // }, 1000);
  },
  methods: {
    async rosConnection() {
      this.loadDataState = false;
      if (this.isConnected) {
        return;
      }

      if (this.ros) {
        this.ros.close(); // Close old connection
        this.ros = false;
        return;
      }

      this.ros = await new ROSLIB.Ros({ url: this.rosbridgeURL });

      this.ros.on('connection', async () => {
        await this.loadData();
        // await this.setNodeData();
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
      const serviceDetail = new ROSLIB.Service({
        ros: this.ros,
        name: '/rosapi/service_request_details',
        serviceType: 'rosapi/ServiceRequestDetails',
      });
      const req = new ROSLIB.ServiceRequest({
        type: data,
      });
      serviceDetail.callService(req, result => {
        let currentServiceList = this.serviceList;
        result.typedefs.forEach(data => {
          currentServiceList[data] = data;
          const parseTypedef = this.parseTypedef(result.typedefs);
          currentServiceList[data].request_info = parseTypedef;
        });
      });
    },
    async loadData() {
      // this.setTopicList();
      // this.setParams();
      // this.setNodeList();
      await Promise.all([this.setTopicList(), this.setNodeList(), this.setParams()]);
      this.loadDataState = true;
    },
    async setNodeData() {
      const [topics, nodes, params] = await Promise.all([
        this.setTopicList(),
        this.setNodeList(),
        this.setParams(),
      ]);
      console.log(topics);
      console.log(nodes);
      console.log(params);
      console.log('node', Array.from(nodes));
      // const filteredNode = this.nodeList.filter(s => this.filterROSTopic(s));
      // const filteredParam = this.paramList.filter(p => this.filterROSTopic(p));

      // filteredNode.map(n => {
      //   n.services = n.services.filter(s => this.filterROSTopic(s));
      //   n.publishing = n.publishing.filter(p => this.filterROSTopic(p));
      //   n.subscribing = n.subscribing.filter(s => this.filterROSTopic(s));
      //   return n;
      // });

      // console.log('filteredNode', filteredNode);
      // console.log('filteredParam', filteredParam);
      // const nodes = filteredNode.map(n => {
      //   n.topics = n.publishing
      //     .concat(n.subscribing)
      //     .map(name => this.topicMsg.find(e => e.topicName === name));
      //   n.params = filteredParam.filter(param => param.node === n.name);
      //   return n;
      // });

      // console.log('nodes', nodes);
    },
  },
};
</script>

<style scoped>
.flex-content {
  flex: 1 0 auto;
}
</style>
