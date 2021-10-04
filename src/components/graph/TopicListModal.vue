<template>
  <div>
    <div class="h-30r">
      <div v-if="graphState === 'LineChart'">
        <treeselect
          :multiple="true"
          :options="options"
          :always-open="true"
          placeholder="Select topic(s)"
          v-model="value"
          :value-consists-of="'ALL'"
        />
      </div>
      <div v-if="graphState === 'Graph3d'">
        <div class="text-sm font-bold text-red-500" v-show="threeIndexWarning">
          * The scatter plot only needs three topics.
        </div>
        <!-- <treeselect
          :multiple="true"
          :options="options"
          :always-open="true"
          :flatten-search-results="true"
          placeholder="Select 3 topics"
          v-model="scatterValue"
          :value-consists-of="'ALL'"
        /> -->
      </div>
      <div class="float-right w-72 selected-item" v-show="graphState === 'Graph3d'">
        <div class="text-left">
          <span class="font-bold">x:</span> {{ scatterValue[0] ? scatterValue[0] : '-' }}
        </div>
        <div class="text-left">
          <span class="font-bold">y:</span> {{ scatterValue[1] ? scatterValue[1] : '-' }}
        </div>
        <div class="text-left">
          <span class="font-bold">z:</span> {{ scatterValue[2] ? scatterValue[2] : '-' }}
        </div>
        <button
          type="button"
          @click="submitScatterPlot()"
          class="
            cursor-pointer
            mt-2
            bg-green-400
            hover:bg-green-500
            text-white
            font-bold
            rounded
            px-5
            py-1
            mb-3
          "
        >
          Submit
        </button>
      </div>
    </div>
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
      data: 'getDataTopic',
      options: 'getSortedTopicData',
      rosbridgeURL: 'getRosbridgeURL',
    }),
    scatterValueLength() {
      return this.scatterValue.length;
    },
  },
  props: {
    graphState: String,
  },
  data() {
    return {
      // topicList: null,
      dataTopic: null,
      selectedNodes: null,
      selectedTopicValue: [],
      selectedChildren: [],
      value: [],
      scatterValue: [],
      threeIndexWarning: false,
    };
  },
  async mounted() {},
  methods: {
    expandCheckbox() {},
    submitScatterPlot() {
      console.log('clicked');
      this.$store.dispatch('updateSelectedScatterTopic', this.scatterValue.slice(0, 3));
      this.$store.dispatch('updateScatterCloseModal', true);
    },
    // clickedCheckboxTopic(node) {
    //   const children = node.children.forEach(c => {
    //     return c.value;
    //   });
    // },
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
    scatterValue: {
      handler(val) {
        if (val.length > 3) {
          this.threeIndexWarning = true;
        }
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

.selected-item {
  z-index: 100;
  position: absolute;
  bottom: 0px;
  right: 0px;
}

#topicModal-LineChart
  > div
  > div
  > div.modal-body
  > div
  > div
  > div
  > div
  > div.vue-treeselect__menu-container
  > div {
  max-height: 22rem !important;
}
</style>
