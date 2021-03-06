<template>
  <div class="-mb-3">
    <div class="control_wrapper">
      <div class="flex justify-end">
        <button
          type="button"
          data-toggle="modal"
          :data-target="'#' + topicModalId"
          class="border py-1 px-4 bg-purple-custom text-white font-bold rounded"
          @click="handleSetTopic()"
          v-if="addTopicState"
        >
          Set topic
        </button>
      </div>
    </div>
    <div class="modal fade" :id="topicModalId" data-keyboard="false" data-backdrop="static">
      <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">Choose Topic</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <TopicListModal
              class="px-5"
              :graphState="graphState"
              v-if="addTopicState"
            ></TopicListModal>
            <div
              v-else
              class="spinner-border text-blue-300"
              style="width: 2rem; height: 2rem"
              role="status"
            ></div>
            <!-- <Loading v-if="loadingState"></Loading> -->
          </div>
          <div class="modal-footer"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import TopicListModal from '@/components/graph/TopicListModal.vue';
// import Loading from '@/components/main/Loading.vue';
import { mapGetters } from 'vuex';
import $ from 'jquery';

export default {
  props: {
    graphState: String,
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
      scatterCloseModal: 'getScatterCloseModal',
      lineGraphCloseModal: 'getLineGraphCloseModal',
    }),
    topicModalId() {
      return `topicModal-${this.graphState}`;
    },
  },
  data() {
    return {
      addTopicState: false,
      checkedNodes: ['2', '6'],
      loadingState: false,
    };
  },
  async mounted() {
    await this.addTopic();
    this.addTopicState = true;
    // this.loadingState = false;
  },
  methods: {
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    async handleSetTopic() {
      // this.loadingState = true;
      await this.addTopic();
      // await this.sleep(3000);
      // this.loadingState = false;
      // this.addTopicState = true;
    },
    async addTopic() {
      const topics = this.topicList.topics;
      const types = this.topicList.types;
      for (let i in topics) {
        let topicExist = false;
        for (let j in this.data.source) {
          if (this.data.source[j].label === topics[i]) {
            topicExist = true;
          }
        }
        if (topicExist) {
          continue;
        } else {
          // add only new topics
          const showCheckbox = true;
          const children = await this.addExpandTopics(topics[i], types[i], topics[i], showCheckbox);
          if (children && children.length > 0) {
            let currentData = this.data;
            if (!currentData.source.some(d => d.id === topics[i])) {
              currentData.source.push({
                value: topics[i],
                id: topics[i],
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
      }
      // this.addTopicState = true;
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
              id: field_name,
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
                id: field_name,
                label: msg.fieldnames[i],
                type: field_type,
                array: msg.fieldarraylen[i],
                children: result,
                showCheckbox: showCheckbox,
                root: root_name,
              });
            }
          }
        }
      }
      return children;
    },
  },
  watch: {
    scatterCloseModal(val) {
      if (val) {
        $('#topicModal-Graph3d').modal('hide');
        this.$store.dispatch('updateScatterCloseModal', false);
      }
    },
    lineGraphCloseModal(val) {
      if (val) {
        $('#topicModal-LineChart').modal('hide');
        this.$store.dispatch('updateLineGraphCloseModal', false);
      }
    },
  },
};
</script>

<style scoped>
.modal-body {
  max-height: 30rem;
}
</style>
