<template>
  <div>
    <div class="h-30r">
      <treeselect
        :multiple="true"
        :options="options"
        :always-open="true"
        placeholder="Select topic"
        v-model="value"
        :value-consists-of="'ALL'"
      />
    </div>
    <!-- <div v-if="data.source.length > 0">
      <ul class="list-group text-left">
        <li v-for="(node, index) in sortedDataTopic" :key="index" class="pb-1">
          <div>
            <a class="mr-3 text-gray-500 cursor-pointer" @click="expandCheckbox()"
              ><i class="fas fa-chevron-right"></i
            ></a>
            <input
              :value="node.value"
              v-model="selectedTopicValue"
              @click="clickedCheckboxTopic(node)"
              type="checkbox"
              class="cursor-pointer"
            />
            {{ node.value }}
            <li v-for="(children, indexChild) in node.children" :key="indexChild">
              <div class="ml-10">
                <input
                  v-if="children.showCheckbox"
                  v-model="selectedChildren"
                  :value="children.value"
                  type="checkbox"
                  class="cursor-pointer"
                />
                <span class="ml-2">/{{ children.label }}</span>
              </div>
            </li>
          </div>
        </li>
      </ul>
    </div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
// import ROSLIB from 'roslib';

export default {
  components: { Treeselect },
  computed: {
    ...mapGetters({
      ros: 'getROS',
      msgList: 'getMsgList',
      topicList: 'getTopicList',
      data: 'getDataTopic',
      sortedDataTopic: 'getSortedTopicData',
      options: 'getSortedTopicData',
      rosbridgeURL: 'getRosbridgeURL',
    }),
  },
  data() {
    return {
      // topicList: null,
      dataTopic: null,
      selectedNodes: null,
      selectedTopicValue: [],
      selectedChildren: [],
      value: null,
    };
  },
  async mounted() {},
  methods: {
    expandCheckbox() {},
    clickedCheckboxTopic(node) {
      const children = node.children.forEach(c => {
        return c.value;
      });
      console.log(children);
    },
  },
  watch: {
    value: {
      handler(val) {
        const currentData = this.data;
        currentData.selection = val;
        this.$store.dispatch('updateDataTopic', currentData);
      },
      deep: true,
    },
  },
};
</script>

<style>
.h-30r {
  height: 30rem;
}

#topicModal
  > div
  > div
  > div.modal-body
  > div
  > div
  > div
  > div.vue-treeselect__menu-container
  > div {
  max-height: 27rem !important;
}
</style>
