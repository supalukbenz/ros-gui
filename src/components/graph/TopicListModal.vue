<template>
  <div class="overflow-y-scroll">
    <div class="">
      <div v-if="graphState === 'LineChart'" class="h-full">
        <div v-if="arrayTopicList.length > 0" class="text-left border px-6 py-1 mb-2 rounded">
          <div class="font-bold text-red-600">* Array index:</div>
          <div
            v-for="(array, index) in arrayTopicList"
            :key="index"
            class="grid grid-cols-3 gap-2 mb-1"
          >
            <span>{{ array.value }}</span>
            <input
              type="number"
              v-model="array.index"
              class="border border-black w-20 pl-2"
              placeholder="index"
            />
            <div></div>
          </div>
        </div>
        <treeselect
          class="relative"
          :multiple="true"
          :options="options"
          :always-open="true"
          placeholder="Select topic(s)"
          v-model="value"
          :value-consists-of="'ALL'"
        />
        <div class="bottom-0">
          <button
            type="button"
            class="mt-2 text-white font-bold rounded px-5 py-1 mb-3"
            :class="[
              indexNotNull
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-400 hover:bg-green-500 cursor-pointer',
            ]"
            :disabled="indexNotNull"
            @click="submitListGraph()"
          >
            Submit
          </button>
        </div>
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
    indexNotNull() {
      if (this.arrayTopicList.length > 0) {
        const filterNullIndex = this.arrayTopicList.filter(a => a.index === '' || a.index < 0);
        console.log('filterNullIndex', filterNullIndex.length <= 0);
        return filterNullIndex.length > 0;
      }
      return false;
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
      arrayTopicList: [],
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
    submitListGraph() {
      let currentData = this.data;
      let currentArrayTopicList = this.arrayTopicList;
      // let currentValue = this.value;
      // if (this.arrayTopicList.length > 0) {
      //   this.addArrayIndexTopic(this.value);
      // }
      //   for (let a of this.arrayTopicList) {
      //     const topic = `${a.value}/${a.index}`;
      //     currentValue.push(topic);
      //   }
      // }
      // console.log('currentValue', currentValue);
      currentData.arrayIndexTopic = currentArrayTopicList;
      currentData.selection = this.value;
      console.log('currentData.selection');
      this.$store.dispatch('updateDataTopic', currentData);
      this.$store.dispatch('updateLineGraphCloseModal', true);
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
  },
  watch: {
    value: {
      handler(val) {
        this.arrayTopicList = [];
        if (val.length > 0) {
          for (let v of val) {
            console.log('v', v);
            let node = this.getNode(v, this.data.source);
            if (node.array >= 0) {
              const arr = {
                value: v,
                index: '',
              };

              this.arrayTopicList.push(arr);
            }
          }
        }
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
  min-height: 30rem;
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
  max-height: 20rem !important;
  position: relative !important;
}

#topicModal-LineChart
  > div
  > div
  > div.modal-body
  > div
  > div
  > div.h-full
  > div.relative.vue-treeselect.vue-treeselect--multi.vue-treeselect--searchable.vue-treeselect--open.vue-treeselect--open-below
  > div.vue-treeselect__menu-container {
  position: relative !important;
}
</style>
