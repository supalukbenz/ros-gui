<template>
  <div class="flex flex-row">
    <button
      :class="[
        moveState ? 'cursor-move-btn' : 'cursor-pointer',
        clickedState(selectedButton.selectedId) ? 'shadow' : '',
      ]"
      :style="{
        width: selectedButton.buttonStyle.width + 'px',
        height: selectedButton.buttonStyle.height + 'px',
      }"
      type="button"
      class="rounded font-bold"
      @click="clickedSelectedButton(selectedButton)"
    >
      {{ selectedButton.buttonName }}
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
import ROSLIB from 'roslib';
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters({
      ros: 'getROS',
      rosbridgeURL: 'getRosbridgeURL',
      robotConnected: 'getRobotConnected',
      selectedButtonList: 'getSelectedButtonList',
    }),
  },
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
        if (button.buttonAction.nodeType === 'Subscriber') {
          this.rosTopic.subscribe(message => {
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
      if (button.buttonAction.nodeType === 'Subscriber') {
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
