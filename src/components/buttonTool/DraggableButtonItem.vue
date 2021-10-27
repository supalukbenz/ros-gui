<template>
  <div class="flex flex-row">
    <div class="tooltip-box">
      <button
        :id="buttonId"
        :class="[
          moveState ? 'cursor-move-btn' : 'cursor-pointer',
          clickedState(selectedButton.selectedId) ? 'border-cliked-button' : '',
        ]"
        :style="{
          width: selectedButton.buttonStyle.width + 'px',
          height: selectedButton.buttonStyle.height + 'px',
        }"
        type="button"
        class="rounded"
        @click="clickedSelectedButton(selectedButton)"
      >
        <span class="font-bold">{{ selectedButton.buttonName }}</span>
      </button>
      <div v-if="!moveState" class="tooltip-text py-1 px-2 text-xs">
        <div>
          <div v-if="selectedButton.buttonMode === 'Topic'">
            {{
              selectedButton.buttonAction.nodeAction + '/' + selectedButton.buttonAction.nodeType
            }}
            <div>{{ selectedButton.buttonAction.topicName }}</div>
          </div>
          <div v-if="selectedButton.buttonMode === 'Param'">
            {{ selectedButton.buttonAction.paramAction }}
            <div>{{ selectedButton.buttonAction.paramName }}</div>
          </div>
          <div v-if="selectedButton.buttonMode === 'Command'">
            {{ selectedButton.buttonAction.command }}
          </div>
        </div>
      </div>

      <div
        v-if="!moveState && selectedButton.buttonMode === 'Topic'"
        class="tooltip-variable py-1 px-2 text-xs max-w-custom"
        :id="tooltipVariableId"
      >
        <div v-for="(key, index) in keyVariableObject" :key="index" class="text-left">
          <div class="" v-if="typeof editedVariable[key] === 'object'">
            <span class="text-muted text-sm">{{ key }}/ </span>
            <TreeVariable :depth="10" :keyObj="handleArray(editedVariable[key])"></TreeVariable>
          </div>
          <div v-else>
            <span class="font-bold text-sm">{{ key }}: </span>{{ editedVariable[key] }}
          </div>
        </div>
      </div>

      <div
        v-if="!moveState && selectedButton.buttonMode === 'Param'"
        class="tooltip-variable py-1 px-2 text-xs max-w-custom"
      >
        Value: {{ selectedButton.buttonAction.paramValue }}
      </div>
    </div>
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
        class="
          cursor-pointer
          text-sm
          tooltip-stop
          text-xl
          -mr-3
          -mt-2
          text-red-600
          hover:text-red-700
        "
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
import { runCommand, closeCommand } from '@/api/connection';
import $ from 'jquery';

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
      buttonList: 'getButtonList',
    }),
    tooltipId() {
      return `dropdown${this.index}`;
    },
    tooltipVariableId() {
      return `tooltip-variable-${this.index}`;
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
    robotCommandInfo() {
      return {
        username: this.robotConnected.username,
        password: this.robotConnected.password,
        ip: this.robotConnected.ip,
        port: this.robotConnected.port,
        command: this.selectedButton.buttonAction.command,
        screen_name: `${this.selectedButton.buttonName.replace(/\s/g, '')}-${
          this.selectedButton.selectedId
        }`,
      };
    },
  },
  mounted() {
    if (this.selectedButton.clickState) {
      if (!this.clickedState(this.selectedButton.selectedId)) {
        this.clikedButtonIdList.push(this.selectedButton.selectedId);
        if (this.selectedButton.buttonMode !== 'Command') {
          this.handleButtonAction(this.selectedButton);
        }
      }
    }
  },
  data() {
    return {
      clikedButtonIdList: [],
      rosTopic: null,
      rosParam: null,
      stopInterval: false,
      responseCommandList: [],
    };
  },
  props: {
    moveState: Boolean,
    selectedButton: Object,
    index: Number,
  },
  methods: {
    handleArray(obj) {
      let tempObj = obj;
      if (Array.isArray(obj)) {
        tempObj = { ...tempObj };
        // tempObj = { value: obj.toString() };
      }
      return tempObj;
    },
    clickedState(selectedId) {
      return this.clikedButtonIdList.includes(selectedId);
    },
    async handleButtonAction(button) {
      if (button.buttonMode === 'Topic') {
        this.rosTopic = new ROSLIB.Topic({
          ros: this.ros,
          name: button.buttonAction.topicName,
          messageType: button.buttonAction.msgType,
        });
        if (button.buttonAction.nodeType === 'subscriber') {
          $(`#${this.tooltipVariableId}`).addClass('element-visible');
          let currentButtonList = this.buttonList;
          let currentSelectedList = this.selectedButtonList;
          const indexButtonList = currentButtonList.findIndex(r => r.buttonId === button.buttonId);
          const indexSelectedList = currentSelectedList.findIndex(
            r => r.buttonId === button.buttonId
          );
          this.rosTopic.subscribe(message => {
            this.subscribeInput = message;
            currentButtonList[indexButtonList].buttonAction.variables = message;
            currentSelectedList[indexSelectedList].buttonAction.variables = message;
            this.$store.dispatch('updateButtonList', currentButtonList);
            this.$store.dispatch('updateSelectedButtonList', currentSelectedList);
          });
        } else {
          const message = new ROSLIB.Message(button.buttonAction.variables);
          this.stopInterval = false;
          if (button.rateHz && button.rateHz !== undefined) {
            const hzToMillisec = (1 / button.rateHz) * 1000;
            var intervalTimer = setInterval(() => {
              this.rosTopic.publish(message);
              console.log(hzToMillisec);
              if (this.stopInterval) {
                clearInterval(intervalTimer);
              }
            }, hzToMillisec);
          } else {
            this.rosTopic.publish(message);
          }
        }
      } else if (button.buttonMode === 'Param') {
        this.rosParam = new ROSLIB.Param({
          ros: this.ros,
          name: button.buttonAction.paramName,
        });
        if (button.buttonAction.paramAction === 'Set') {
          this.rosParam.set(Number(button.buttonAction.paramValue));
        }
      } else if (button.buttonMode === 'Command') {
        if (!this.clickedState(button.selectedId)) {
          const res = await runCommand(this.robotCommandInfo);
          this.responseCommandList.push(res);
        }
      }
    },
    clickedSelectedButton(button) {
      if (!this.moveState) {
        this.handleButtonAction(button);
        if (!this.clickedState(button.selectedId)) {
          this.clikedButtonIdList.push(button.selectedId);
          let currentSelectedButton = this.selectedButtonList;
          currentSelectedButton.map(b => {
            if (b.selectedId === button.selectedId) {
              b.clickState = true;
            }
            return b;
          });
          this.$store.dispatch('updateSelectedButtonList', currentSelectedButton);
        }
      }
    },
    async removeClickedButtonId(button) {
      this.stopInterval = true;
      let currentSelectedButton = this.selectedButtonList;
      currentSelectedButton.map(b => {
        if (b.selectedId === button.selectedId) {
          b.clickState = false;
        }
        return b;
      });
      this.$store.dispatch('updateSelectedButtonList', currentSelectedButton);
      if (button.buttonMode === 'Topic') {
        if (button.buttonAction.nodeType === 'subscriber') {
          $(`#${this.tooltipVariableId}`).removeClass('element-visible');
          this.rosTopic.unsubscribe();
        } else {
          const message = new ROSLIB.Message({});
          this.rosTopic.publish(message);
        }
      } else if (button.buttonMode === 'Param') {
        if (button.buttonAction.paramAction === 'Set') {
          this.rosParam.set(0);
        }
      } else if (button.buttonMode === 'Command') {
        await closeCommand(this.robotCommandInfo);
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
.tooltip-box,
.tooltip-stop {
  position: relative;
  display: inline-block;
}

.tooltip-text,
.tooltip-variable {
  visibility: hidden;
  opacity: 0;
  max-width: none;
  white-space: nowrap;
  color: #212529;
  text-align: center;
  cursor: default !important;
  border-radius: 6px;
  position: absolute;
  z-index: 1;
  transition: opacity 0.3s;
}

.tooltip-text {
  bottom: 125%;
  background-color: rgb(207, 207, 207, 0.2);
  border: 1px solid #555;
  /* max-width: 7rem;
  overflow-x: scroll;
  overflow-y: scroll; */
}

.tooltip-variable {
  top: 90%;
  background: rgba(249, 249, 249, 0.19);
  border: 1px solid rgb(207, 207, 207);
  max-height: 15rem;
  overflow: hidden;
  white-space: nowrap;
  overflow-x: scroll;
  overflow-y: scroll;
  z-index: 100;
}

.border-cliked-button {
  border: 3px solid #303030;
  border-radius: 0.25rem !important;
}

.tooltip-box .tooltip-text::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 10%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}

.tooltip-box:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}

.tooltip-box:hover .tooltip-variable {
  visibility: visible;
  opacity: 1;
}

.tooltip-stop:hover .tooltip-variable {
  visibility: visible !important;
  opacity: 1;
}

.element-visible {
  visibility: visible !important;
  opacity: 1 !important;
}
</style>
