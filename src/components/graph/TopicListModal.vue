<template>
  <div>
    <div v-if="data.source.length > 0">
      <ul class="list-group text-left">
        <li v-for="(node, index) in data.source" :key="index" class="p-2">
          {{ index + 1 }}. {{ node.value }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ROSLIB from 'roslib';

export default {
  computed: {
    ...mapGetters({
      ros: 'getROS',
      msgList: 'getMsgList',
      topicList: 'getTopicList',
      data: 'getDataTopic',
      rosbridgeURL: 'getRosbridgeURL',
    }),
  },
  data() {
    return {
      // topicList: null,
      dataTopic: null,
    };
  },
  async mounted() {
    await this.ros.connect(this.rosbridgeURL);
    // await this.setTopicList();
    this.addTopic();
  },
  methods: {
    async setTopicList() {
      await this.ros.getTopics(topic => {
        console.log('topic', topic);
        topic.types.forEach(async msgName => {
          if (msgName in this.msgList === false) {
            await this.getMsgROSInfo(msgName);
          }
        });

        this.$store.dispatch('updateTopicList', topic);
      });
      this.addTopic();
    },
    async getMsgROSInfo(msgName) {
      const msgDetails = new ROSLIB.Service({
        ros: this.ros,
        name: '/rosapi/message_details',
        serviceType: 'rosapi/MessageDetails',
      });
      const req = new ROSLIB.ServiceRequest({
        type: msgName,
      });
      msgDetails.callService(req, result => {
        let currentMsgList = this.msgList;
        result.typedefs.forEach(data => {
          currentMsgList[data.type] = data;
        });
        const parsedObj = JSON.parse(JSON.stringify(currentMsgList));
        this.$store.dispatch('updateMsgList', parsedObj);
      });
      console.log('this.$store.dispatch msgDetails', Object.keys(this.msgList).length > 0);
      console.log('this.msg length', Object.keys(this.msgList).length);
    },
    addTopic() {
      console.log('add topic');
      const topics = this.topicList.topics;
      console.log('topicList', this.topicList);
      console.log('topics', topics);
      const types = this.topicList.types;
      for (let i in topics) {
        console.log('i', i);
        let topicExist = false;
        for (let j in this.data.source) {
          if (this.data.source[j].label === topics[i]) {
            topicExist = true;
          }
        }
        if (topicExist) {
          console.log('topicExist', topicExist);
          continue;
        } else {
          // add only new topics
          console.log('newly added topic: ' + topics[i]);
          const showCheckbox = true;
          const children = this.addExpandTopics(topics[i], types[i], topics[i], showCheckbox);
          console.log('children, ', children);
          if (children && children.length > 0) {
            const currentData = this.data;
            currentData.source.push({
              value: topics[i],
              label: topics[i],
              type: types[i],
              children: children,
              root: topics[i],
              leaf: false,
            });
            this.$store.dispatch('updateDataTopic', currentData);
            this.dataTopic = currentData;
          }
        }
      }
    },
    addExpandTopics(topic_name, topic_type, root_name, checkbox) {
      let showCheckbox = checkbox;
      const typeMsg = [
        'bool',
        'uint8',
        'uint16',
        'uint32',
        'uint64',
        'int16',
        'int32',
        'int64',
        'float32',
        'float64',
      ];
      const msg = this.msgList[String(topic_type)];
      console.log('topic_type', topic_type);
      console.log('this.msgList[topic_type]', msg);
      console.log('this.msgList', this.msgList);
      if (!msg) {
        return;
      }
      let children = [];
      console.log('msg.fieldtypes', msg.fieldtypes);
      for (let i in msg.fieldtypes) {
        let field_type = msg.fieldtypes[i];
        const field_name = topic_name + '/' + msg.fieldnames[i];
        if (msg.fieldnames[i] !== 'header') {
          if (typeMsg.includes(field_type)) {
            //single msg
            if (msg.fieldarraylen[i] !== -1) {
              //array msg
              //not add line now since size is unknown until receive first msg.
              field_type += 'MultiArray';
              showCheckbox = false;
            }
            children.push({
              value: field_name,
              label: msg.fieldnames[i],
              type: field_type,
              array: msg.fieldarraylen[i],
              showCheckbox: showCheckbox,
              root: root_name,
            });
          } else if (this.msgList[field_type]) {
            if (msg.fieldarraylen[i] !== -1) {
              showCheckbox = false;
            }
            const result = this.addExpandTopics(field_name, field_type, root_name, showCheckbox);
            if (result.length > 0) {
              children.push({
                value: field_name,
                label: msg.fieldnames[i],
                type: field_type,
                array: msg.fieldarraylen[i],
                children: result,
                showCheckbox: showCheckbox,
                root: root_name,
              });
            }
          } else {
            console.log('not in the msgList', field_type);
          }
        }
      }
      return children;
    },
  },
};
</script>
