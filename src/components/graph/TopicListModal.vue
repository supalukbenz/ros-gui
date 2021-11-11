<template>
  <div class="overflow-y-scroll">
    <div class="">
      <div v-if="graphState === 'LineChart'" class="h-full">
        <div v-if="arrayTopicList.length > 0" class="text-left border px-6 py-1 mb-2 rounded">
          <div class="font-bold text-red-600">* Array index:</div>
          <div
            v-for="(array, index) in arrayTopicList"
            :key="index"
            class="grid grid-cols-4 gap-2 mb-1"
          >
            <div class="col-span-2">{{ array.value }}</div>
            <input
              type="number"
              v-model="array.index"
              class="border border-black w-20 pl-2"
              placeholder="index"
            />
            <div class="flex flex-row">
              <div
                class="text-green-500 hover:text-green-700 cursor-pointer w-10 text-xl"
                title="add index"
                @click="addTopicIndex(array.value)"
              >
                <i class="fas fa-plus-circle"></i>
              </div>
              <!-- <div v-if="showRemoveTopicIndex(array.value)">
                <div
                  class="text-red-500 hover:text-red-700 cursor-pointer w-10 text-xl"
                  title="remove index"
                  @click="removeTopicIndex(array.index)"
                >
                  <i class="fas fa-minus-circle"></i>
                </div>
              </div> -->
            </div>
          </div>
        </div>
        <treeselect
          class="relative"
          :multiple="true"
          :options="options"
          :always-open="true"
          placeholder="Select topic(s)"
          :flat="true"
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
      <div v-if="graphState === 'Graph3d'" class="h-full">
        <div class="text-sm font-bold text-red-500" v-show="threeTopicWarning">
          * The scatter plot needs three topics.
        </div>
        <div
          v-if="arrayTopicScatterPlot.length > 0"
          class="text-left border px-6 py-1 mb-2 rounded"
        >
          <div class="font-bold text-red-600">* Array index:</div>
          <div
            v-for="(array, index) in arrayTopicScatterPlot"
            :key="index"
            class="grid grid-cols-4 gap-2 mb-1"
          >
            <div class="col-span-2">{{ array.value }}</div>
            <input
              type="number"
              v-model="array.index"
              class="border border-black w-20 pl-2"
              placeholder="index"
            />
            <div>
              <div
                class="text-green-500 hover:text-green-700 cursor-pointer w-10 text-xl"
                title="add index"
                @click="addTopicIndex(array.value)"
              >
                <i class="fas fa-plus-circle"></i>
              </div>
            </div>
          </div>
        </div>
        <treeselect
          class="relative"
          :multiple="true"
          :options="options"
          :always-open="true"
          :flatten-search-results="true"
          placeholder="Select 3 topics"
          v-model="scatterValue"
          :value-consists-of="'ALL'"
          :flat="true"
        />
        <div class="float-left w-72 my-2 selected-item">
          <div class="text-left">
            <span class="font-bold">x:</span> {{ scatterValue[0] ? scatterValue[0] : '-' }}
          </div>
          <div class="text-left">
            <span class="font-bold">y:</span> {{ scatterValue[1] ? scatterValue[1] : '-' }}
          </div>
          <div class="text-left">
            <span class="font-bold">z:</span> {{ scatterValue[2] ? scatterValue[2] : '-' }}
          </div>
        </div>

        <div class="flex justify-end items-end mb-4">
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
            "
          >
            Submit
          </button>
        </div>
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
      threeTopicWarning: false,
      arrayTopicList: [],
      arrayTopicScatterPlot: [],
    };
  },
  async mounted() {},
  methods: {
    submitScatterPlot() {
      this.$store.dispatch('updateSelectedScatterTopic', this.scatterValue.slice(0, 3));
      this.$store.dispatch('updateScatterCloseModal', true);
    },
    submitListGraph() {
      let currentData = this.data;
      let currentArrayTopicList = this.arrayTopicList;

      currentData.arrayIndexTopic = currentArrayTopicList;
      currentData.selection = this.value;
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
    addTopicIndex(value) {
      this.arrayTopicList.push({ index: '', value: value });
    },
    handleArrayTopicIndex(val, oldVal, topicList) {
      let tempTopicList = topicList.map(o => ({ ...o }));
      if (val.length > 0) {
        let diffVal = oldVal.filter(x => !val.includes(x));
        if (diffVal.length > 0) {
          for (let v of diffVal) {
            if (tempTopicList.some(a => a.value === v)) {
              const indexOldVal = tempTopicList.findIndex(a => a.value === v);
              tempTopicList.splice(indexOldVal, 1);
            }
          }
        }
        // }
        for (let v of val) {
          let node = this.getNode(v, this.data.source);
          if (node.array >= 0) {
            const arr = {
              value: v,
              index: '',
            };
            if (!tempTopicList.some(a => a.value === v)) {
              tempTopicList.push(arr);
            }
          }
        }
      } else {
        tempTopicList = [];
      }
      return tempTopicList;
    },
    showRemoveTopicIndex(value) {
      const topicFilter = this.arrayTopicList.filter(topic => topic.value === value);
      return topicFilter.length > 1;
    },
    removeTopicIndex(index) {
      this.arrayTopicList.slice(index, 1);
    },
  },
  watch: {
    value: {
      handler(val, oldVal) {
        // if (val.length > 0) {
        //   let diffVal = oldVal.filter(x => !val.includes(x));
        //   if (diffVal.length > 0) {
        //     for (let v of diffVal) {
        //       if (this.arrayTopicList.some(a => a.value === v)) {
        //         const indexOldVal = this.arrayTopicList.findIndex(a => a.value === v);
        //         this.arrayTopicList.splice(indexOldVal, 1);
        //       }
        //     }
        //   }
        //   // }
        //   for (let v of val) {
        //     let node = this.getNode(v, this.data.source);
        //     if (node.array >= 0) {
        //       const arr = {
        //         value: v,
        //         index: '',
        //       };
        //       if (!this.arrayTopicList.some(a => a.value === v)) {
        //         this.arrayTopicList.push(arr);
        //       }
        //     }
        //   }
        // } else {
        //   this.arrayTopicList = [];
        // }
        this.arrayTopicList = this.handleArrayTopicIndex(val, oldVal, this.arrayTopicList);
      },
      deep: true,
    },
    scatterValue: {
      handler(val, oldVal) {
        if (val.length > 3) {
          this.threeTopicWarning = true;
        } else {
          this.threeTopicWarning = false;
        }
        this.arrayTopicScatterPlot = this.handleArrayTopicIndex(
          val,
          oldVal,
          this.arrayTopicScatterPlot
        );
        console.log('val', val);
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

#topicModal-Graph3d
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

#topicModal-Graph3d
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
</style>
