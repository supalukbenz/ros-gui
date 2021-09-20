<template>
  <div class="flex flex-row">
    <button
      :id="buttonId"
      :class="[
        moveState ? 'cursor-move-btn' : 'cursor-pointer',
        clickedState(selectedButton.selectedId) ? 'shadow' : '',
      ]"
      :style="{
        width: selectedButton.buttonStyle.width + 'px',
        height: selectedButton.buttonStyle.height + 'px',
      }"
      type="button"
      class="rounded font-bold tooltip-box"
      @click="clickedSelectedButton(selectedButton)"
    >
      {{ selectedButton.buttonName }}
      <div class="tooltip-text py-1 px-2">
        <div v-for="(key, index) in keyVariableObject" :key="index" class="text-left">
          <div class="" v-if="typeof editedVariable[key] === 'object'">
            <span class="text-muted text-sm">{{ key }}/ </span>
            <TreeVariable :depth="10" :keyObj="editedVariable[key]"></TreeVariable>
          </div>
          <div v-else>
            <span class="font-bold text-sm">{{ key }}: </span>{{ editedVariable[key] }}
          </div>
        </div>
      </div>
    </button>
    <div class="flex justify-end remove-h">
      <div
        v-show="moveState"
        @click="removeSelectedButton(index)"
        class="cursor-pointer text-xs w-3 h-3 -mr-3 -mt-2"
      >
        <div
          class="
            w-3
            h-3
            flex
            justify-center
            items-center
            font-bold
            rounded-full
            text-white
            bg-gray-600
            hover:bg-gray-700
          "
        >
          &times;
        </div>
      </div>
    </div>
    <div class="flex justify-end remove-h">
      <div
        v-show="!moveState && clickedState(selectedButton.selectedId)"
        @click="removeClickedButtonId(selectedButton)"
        class="cursor-pointer text-sm w-3 -mr-3 -mt-2 text-red-600 hover:text-red-700"
      >
        <i class="fas fa-stop-circle"></i>
      </div>
    </div>
  </div>
</template>

<script>
import TreeVariable from '@/components/buttonTool/TreeVariable.vue';
import ROSLIB from 'roslib';
import { mapGetters } from 'vuex';

export default {
  components: {
    TreeVariable,
  },
  computed: {
    ...mapGetters({
      ros: 'getROS',
      rosbridgeURL: 'getRosbridgeURL',
      robotConnected: 'getRobotConnected',
      selectedButtonList: 'getSelectedButtonList',
    }),
    tooltipId() {
      return `dropdown${this.index}`;
    },
    buttonId() {
      return `button${this.index}`;
    },
    keyVariableObject() {
      return Object.keys(this.selectedButton.buttonAction.variables);
    },
    editedVariable() {
      return this.selectedButton.buttonAction.variables;
    },
  },
  mounted() {},
  data() {
    return {
      clikedButtonIdList: [],
      rosTopic: null,
    };
  },
  props: {
    moveState: Boolean,
    selectedButton: Object,
    index: Number,
  },
  methods: {
    clickedState(selectedId) {
      return this.clikedButtonIdList.includes(selectedId);
    },
    clickedSelectedButton(button) {
      if (!this.moveState) {
        if (!this.clickedState(button.selectedId)) {
          this.clikedButtonIdList.push(button.selectedId);
        }
        this.rosTopic = new ROSLIB.Topic({
          ros: this.ros,
          name: button.buttonAction.topicName,
          messageType: button.buttonAction.msgType,
        });
        if (button.buttonAction.nodeType === 'subscriber') {
          this.rosTopic.subscribe(message => {
            console.log('message subscribe', message);
            this.subscribeInput = message;
          });
        } else {
          const message = new ROSLIB.Message(button.buttonAction.variables);
          console.log('message', message);
          this.rosTopic.publish(message);
        }
      }
    },
    removeClickedButtonId(button) {
      if (button.buttonAction.nodeType === 'subscriber') {
        this.rosTopic.unsubscribe();
      } else {
        const message = new ROSLIB.Message({});
        console.log('delete message', message);
        this.rosTopic.publish(message);
      }
      const index = this.clikedButtonIdList.findIndex(id => id === button.selectedId);
      if (index >= 0) {
        this.clikedButtonIdList.splice(index, 1);
      }
    },
    removeSelectedButton(index) {
      const currentSelectedBtnList = this.selectedButtonList;
      currentSelectedBtnList.splice(index, 1);
      this.$store.dispatch('updateSelectedButtonList', currentSelectedBtnList);
    },
  },
};
</script>

<style scoped>
.tooltip-box {
  position: relative;
  display: inline-block;
}

.tooltip-box .tooltip-text {
  visibility: hidden;
  max-width: 120px;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -60px;
  opacity: 0;
  transition: opacity 0.3s;
}

.tooltip-box .tooltip-text::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}

.tooltip-box:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}
</style>
