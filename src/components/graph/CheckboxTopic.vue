<template>
  <div class="my-2">
    <div class="control_wrapper w-72">
      <!-- <ejs-treeview
        class="text-left"
        id="treeview"
        :fields="fields"
        :showCheckBox="true"
        :checkedNodes="checkedNodes"
        :nodeChecked="nodeChecked"
      ></ejs-treeview> -->
      <div class="flex justify-start">
        <button
          type="button"
          data-toggle="modal"
          data-target="#topicModal"
          class="border py-1 px-2 bg-blue-400 text-white font-bold"
          @click="handleSetTopic()"
        >
          Set topic
        </button>
      </div>
      <div class="modal fade" id="topicModal" role="dialog">
        <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">Choose Topic</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <TopicListModal v-if="addTopicState"></TopicListModal>
              <!-- <Loading v-if="loadingState"></Loading> -->
            </div>
            <div class="modal-footer"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import TopicListModal from '@/components/graph/TopicListModal.vue';
// import Loading from '@/components/main/Loading.vue';
import { TreeViewPlugin } from '@syncfusion/ej2-vue-navigations';
import { mapGetters } from 'vuex';

Vue.use(TreeViewPlugin);

export default {
  props: {
    // msgList: Object,
    // topicList: Object,
  },
  components: {
    TopicListModal,
    // Loading,
  },
  computed: {
    ...mapGetters({
      robotConnected: 'getRobotConnected',
      msgList: 'getMsgList',
      topicList: 'getTopicList',
      data: 'getDataTopic',
    }),
  },
  data() {
    var dataSource = [
      { id: 1, name: 'Australia', hasChild: true },
      { id: 2, pid: 1, name: 'New South Wales', isChecked: true },
      { id: 3, pid: 1, name: 'Victoria' },
      { id: 4, pid: 1, name: 'South Australia' },
      { id: 6, pid: 1, name: 'Western Australia', isChecked: true },
      { id: 7, name: 'Brazil', hasChild: true },
      { id: 8, pid: 7, name: 'Paraná' },
      { id: 9, pid: 7, name: 'Ceará' },
      { id: 10, pid: 7, name: 'Acre' },
      { id: 11, name: 'China', hasChild: true },
      { id: 12, pid: 11, name: 'Guangzhou' },
      { id: 13, pid: 11, name: 'Shanghai' },
      { id: 14, pid: 11, name: 'Beijing' },
      { id: 15, pid: 11, name: 'Shantou' },
      { id: 16, name: 'France', hasChild: true },
      { id: 17, pid: 16, name: 'Pays de la Loire' },
      { id: 18, pid: 16, name: 'Aquitaine' },
      { id: 19, pid: 16, name: 'Brittany' },
      { id: 20, pid: 16, name: 'Lorraine' },
      { id: 21, name: 'India', hasChild: true },
      { id: 22, pid: 21, name: 'Assam' },
      { id: 23, pid: 21, name: 'Bihar' },
      { id: 24, pid: 21, name: 'Tamil Nadu' },
      { id: 25, pid: 21, name: 'Punjab' },
    ];
    return {
      fields: {
        dataSource: dataSource,
        id: 'id',
        parentID: 'pid',
        text: 'name',
        hasChildren: 'hasChild',
      },
      addTopicState: false,
      checkedNodes: ['2', '6'],
      loadingState: false,
    };
  },
  async mounted() {
    // console.log('topicList.topics', this.topicList.topics.length);
    // this.addTopicState = true;
    await this.addTopic();
    // this.loadingState = false;
    this.addTopicState = true;
  },
  methods: {
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    nodeChecked() {
      var treeObj = document.getElementById('treeview').ej2_instances[0];
      console.log("The checked node's id: " + treeObj.checkedNodes); // To alert the checked node's id.
    },
    async handleSetTopic() {
      // this.loadingState = true;
      // await this.addTopic();
      // await this.sleep(3000);
      // this.loadingState = false;
      // this.addTopicState = true;
    },
    async addTopic() {
      const topics = this.topicList.topics;
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
          const children = await this.addExpandTopics(topics[i], types[i], topics[i], showCheckbox);
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
          }
        }
      }
    },
    async addExpandTopics(topic_name, topic_type, root_name, checkbox) {
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
      if (!msg) {
        return;
      }
      let children = [];
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
            const result = await this.addExpandTopics(
              field_name,
              field_type,
              root_name,
              showCheckbox
            );
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

<style>
@import '../../../node_modules/@syncfusion/ej2-base/styles/material.css';
@import '../../../node_modules/@syncfusion/ej2-vue-navigations/styles/material.css';
@import '../../../node_modules/@syncfusion/ej2-vue-buttons/styles/material.css';

.control_wrapper {
  /* display: block;
  max-width: 350px;
  max-height: 350px;
  margin: auto;
  overflow: auto;
  border: 1px solid #dddddd;
  border-radius: 3px; */
}
</style>
