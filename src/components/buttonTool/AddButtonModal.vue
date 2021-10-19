<template>
  <div>
    <div class="rounded-full border-2 flex flex-row mb-2 text-sm font-bold">
      <div
        class="
          w-1/2
          flex
          justify-center
          border-r
          py-1
          rounded-l-full
          border-green-500
          cursor-pointer
          hover:bg-green-600
        "
        :class="[buttonMode === 'Topic' ? 'bg-green-500 text-white' : 'bg-gray-400 text-gray-200']"
        @click="changeMode('Topic')"
      >
        Topic
      </div>
      <div
        class="w-1/2 flex justify-center py-1 rounded-r-full cursor-pointer hover:bg-green-600"
        :class="[buttonMode === 'Param' ? 'bg-green-500 text-white' : 'bg-gray-400 text-gray-200']"
        @click="changeMode('Param')"
      >
        Param
      </div>
    </div>
    <div
      :class="[windowWidth < 992 ? 'flex-col' : 'flex-row']"
      class="flex py-2 px-4 justify-center"
    >
      <div
        class="flex justify-start items-start flex-col mr-4 min-w-20"
        v-if="buttonMode === 'Topic'"
      >
        <div class="w-full h-full">
          <div class="grid grid-rows-2 grid-cols-2">
            <div class="text-left">
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="radio"
                  name="inlineRadioOptions"
                  id="typeTopic"
                  value="topic"
                  v-model="nodeAction"
                />
                <label class="form-check-label" for="typeTopic">Topic</label>
              </div>
            </div>
            <div class="text-left">
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="radio"
                  name="inlineRadioOptions"
                  id="typeService"
                  value="service"
                  v-model="nodeAction"
                />
                <label class="form-check-label" for="typeService">Service</label>
              </div>
            </div>
            <!-- <div class="w-100"></div> -->
            <div class="text-left">
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="radio"
                  name="inlineRadioOptions1"
                  id="typePublisher"
                  value="publisher"
                  v-model="nodeType"
                />
                <label class="form-check-label" for="typePublisher">Publisher</label>
              </div>
            </div>
            <div class="text-left">
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="radio"
                  name="inlineRadioOptions1"
                  id="typeSubscriber"
                  value="subscriber"
                  v-model="nodeType"
                />
                <label class="form-check-label" for="typeSubscriber">Subscriber</label>
              </div>
            </div>
          </div>
          <div class="w-full flex flex-col items-start mt-2 relative">
            <div class="font-bold">Topic</div>
            <input
              type="text"
              class="border rounded w-full px-2 py-1"
              data-display="static"
              data-toggle="dropdown"
              :id="dropdownTopicId"
              aria-haspopup="true"
              aria-expanded="false"
              placeholder="/topic"
              v-model="topicName"
            />
            <div class="dropdown-menu" :aria-labelledby="dropdownTopicId">
              <div class="w-72 max-h-15 overflow-y-scroll flex flex-col items-start break-all">
                <div v-for="(topic, index) in filterNode.topics" :key="index" class="w-full h-full">
                  <div
                    @click="selectedNodeMsg(topic)"
                    v-if="topic"
                    class="cursor-pointer hover:bg-gray-100 pl-2 pb-1"
                  >
                    {{ topic.name }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="w-full flex flex-col items-start mt-2 relative mb-2">
            <div class="font-bold">Types</div>
            <input
              type="text"
              class="border rounded w-full px-2 py-1"
              data-toggle="dropdown"
              :disabled="topicName === ''"
              :id="dropdownId"
              aria-haspopup="true"
              aria-expanded="false"
              placeholder="msgs type"
              v-model="msg"
            />
            <div class="dropdown-menu" :aria-labelledby="dropdownId">
              <div class="w-72 max-h-15 overflow-y-scroll flex flex-col items-start break-all">
                <div v-for="(option, index) in msgTypeList" :key="index" class="w-full h-full">
                  <div
                    @click="selectedMsgItem(option)"
                    class="cursor-pointer hover:bg-gray-100 pl-2 pb-1"
                  >
                    {{ option }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="w-full flex flex-col items-start mt-2">
            <div class="font-bold">Topic name</div>
            <input v-model="topicName" type="text" class="border rounded w-full px-2 py-1" />
          </div> -->
          <div class="border rounded md-1 py-1 px-2">
            <div class="font-bold text-sm">Variables</div>
            <div v-if="editState && editedVariable" class="variable-container">
              <div v-for="(key, index) in keyVariableObject" :key="index" class="text-left">
                <div class="" v-if="typeof editedVariable[key] === 'object'">
                  <span class="text-muted text-sm">{{ key }}/ </span>
                  <TreeVariable
                    :depth="10"
                    :keyObj="handleArray(editedVariable[key])"
                  ></TreeVariable>
                </div>
                <div v-else>
                  <span class="font-bold text-sm">{{ key }}: {{ editedVariable[key] }}</span>
                </div>
              </div>
            </div>
            <div class="text-sm" v-else>No variable.</div>
          </div>
          <a @click="setCurrentTopic()" class="text-sm font-bold cursor-pointer underline">{{
            editState ? 'Set new variable' : 'Set variables'
          }}</a>
          <VariableNodeForm
            v-if="showVariable"
            @variable="setVariable"
            :topic="topicSelected"
            :editedVariable="editedVariable"
          ></VariableNodeForm>
        </div>
      </div>
      <div class="flex justify-start items-start flex-col mr-4 min-w-20" v-else>
        <div class="grid grid-cols-2 w-full">
          <div class="text-left">
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                name="inlineRadioOptions"
                id="setAction"
                value="Set"
                v-model="paramAction"
              />
              <label class="form-check-label" for="setAction">Set</label>
            </div>
          </div>
          <div class="text-left">
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                name="inlineRadioOptions"
                id="getAction"
                value="Get"
                v-model="paramAction"
              />
              <label class="form-check-label" for="getAction">Get</label>
            </div>
          </div>
        </div>
        <div class="w-full flex flex-col items-start mt-2 relative">
          <div class="font-bold">Parameter name</div>
          <input
            type="text"
            class="border rounded w-full px-2 py-1"
            data-display="static"
            data-toggle="dropdown"
            :id="dropdownParamId"
            aria-haspopup="true"
            aria-expanded="false"
            placeholder="/parameter_name"
            v-model="paramName"
          />
          <div class="dropdown-menu" :aria-labelledby="dropdownParamId">
            <div class="w-72 max-h-15 overflow-y-scroll flex flex-col items-start break-all">
              <div v-for="(param, pIndex) in params" :key="pIndex" class="w-full h-full">
                <div
                  @click="selectedParam(param)"
                  v-if="param"
                  class="cursor-pointer hover:bg-gray-100 pl-2 pb-1"
                >
                  {{ param.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="font-bold mt-2">Value</div>
        <input
          type="text"
          :disabled="paramAction === 'get'"
          class="border rounded w-full px-2 py-1"
          v-model="paramValue"
        />
      </div>
      <div
        :class="[windowWidth < 992 ? 'mt-4' : 'w-72 pl-4']"
        class="flex flex-col justify-between items-start pb-1"
      >
        <div class="flex justify-center items-center w-full h-full bg-gray-100 min-h-10">
          <button
            type="button"
            class="font-bold rounded p-1 overflow-hidden"
            :style="{
              width: widthButton + 'px',
              height: heightButton + 'px',
              background: bgButton,
              color: textColorButton,
            }"
          >
            {{ buttonName === '' ? 'Button' : buttonName }}
          </button>
        </div>
        <div>
          <div class="flex flex-col items-start mt-3 mr-4">
            <div class="font-bold">Button name</div>
            <input v-model="buttonName" type="text" class="border rounded px-2 py-1 w-full" />
            <div class="flex flex-row items-center">
              <input v-model="sameName" type="checkbox" @change="handleSameName()" />
              <span class="ml-1 text-sm"
                >use the same name as {{ buttonMode === 'Topic' ? 'topic' : 'param' }}</span
              >
            </div>
          </div>
          <div class="w-72 flex flex-row items-start mt-2">
            <div class="mr-1">
              <div class="font-bold text-left">Width</div>
              <div class="flex flex-row">
                <input v-model="widthButton" type="number" class="border-b rounded w-1/2 px-2" />
                <span>px</span>
              </div>
            </div>
            <div>
              <div class="font-bold text-left">Height</div>
              <div class="flex flex-row">
                <input v-model="heightButton" type="number" class="border-b rounded w-1/2 px-2" />
                <span>px</span>
              </div>
            </div>
          </div>
          <div class="text-left mt-3 flex flex-row">
            <div class="mr-2 font-bold">BG:</div>
            <input type="color" id="head" name="head" v-model="bgButton" />
            <div class="ml-3 mr-2 font-bold">Text:</div>
            <input type="color" id="head" name="head" v-model="textColorButton" />
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-center mt-4">
      <button
        @click="handleButtonFormSubmit()"
        type="button"
        class="bg-green-500 hover:bg-green-600 text-white w-36 py-2 rounded-lg font-bold"
      >
        Submit
      </button>
    </div>
  </div>
</template>

<script>
import VariableNodeForm from '@/components/buttonTool/VariableNodeForm.vue';
import TreeVariable from '@/components/buttonTool/TreeVariable.vue';
import { mapGetters } from 'vuex';
import _ from 'lodash';

export default {
  components: {
    VariableNodeForm,
    TreeVariable,
  },
  computed: {
    ...mapGetters({
      buttonList: 'getButtonList',
      topicMsg: 'getTopicMsg',
      paramList: 'getParamList',
      nodeList: 'getNodeList',
      robotConnected: 'getRobotConnected',
      variableList: 'getVariableList',
      selectedButtonList: 'getSelectedButtonList',
      // nodeForm: 'getNodeForm',
    }),
    msgTypeList() {
      return this.filteredMsg.length > 0 ? this.filteredMsg : this.filteredMsgByTopic;
    },
    filteredMsgByTopic() {
      let msg = [];
      if (this.topicName !== '') {
        msg = this.topicMsg.map(t => {
          if (t.name === this.topicName) {
            return t.type;
          }
        });
        msg = msg.filter(Boolean);
        msg = msg.filter((m, index) => {
          return msg.indexOf(m) === index;
        });
        return msg;
      } else {
        return [];
      }
    },
    params() {
      return this.filteredInputParams.length > 0
        ? this.filteredInputParams
        : this.filterTopicParamList();
    },
    filterNode() {
      return this.filteredNodeTopic.topics.length > 0
        ? this.filteredNodeTopic
        : this.nodeTopicList();
    },
    dropdownId() {
      return `dropdown${this.index}`;
    },
    dropdownTopicId() {
      return `dropdown-topic${this.index}`;
    },
    dropdownParamId() {
      return `dropdown-param${this.index}`;
    },
  },
  props: {
    index: Number,
    buttonInfo: Object,
    editState: Boolean,
  },
  data() {
    return {
      windowWidth: window.innerWidth,
      sameName: false,
      nodeType: '',
      nodeAction: '',
      topicName: '',
      buttonName: '',
      widthButton: 120,
      bgButton: '#60A5FA',
      textColorButton: '#2C3E50',
      editedVariable: null,
      heightButton: 48,
      msg: '',
      filteredMsg: [],
      variables: [],
      filteredNodeTopic: { topics: [] },
      topicSelected: {},
      showVariable: false,
      keyVariableObject: [],
      buttonMode: 'Param',
      paramAction: 'Set',
      paramName: '',
      filteredInputParams: [],
      paramValue: '',
    };
  },
  created() {
    // this.nodeInfo = this.setNodeInfo();
  },
  mounted() {
    window.addEventListener('resize', () => {
      this.windowWidth = window.innerWidth;
    });
    this.setEditInfo(this.editState);
    this.nodeInfo = this.setNodeInfo();
  },
  methods: {
    changeMode(mode) {
      this.buttonMode = mode;
    },
    handleArray(obj) {
      let tempObj = obj;
      if (Array.isArray(obj)) {
        tempObj = { ...tempObj };
        // tempObj = { value: obj.toString() };
      }
      return tempObj;
    },
    setVariable(form) {
      console.log('add button', form.name, form.value);
    },
    filterTopicParamList() {
      let paramTemp = [];
      if (this.paramList.length > 0) {
        const filterTopicNode = this.paramList.filter(p => this.filterROSTopic(p?.node));
        const filterTopicName = filterTopicNode.filter(p => this.filterROSTopic(p?.name));
        paramTemp = filterTopicName;
      }
      return paramTemp;
    },
    nodeTopicList() {
      let nodeFormTemp = {
        publishing: [],
        subscribing: [],
        topics: [],
        param: [],
      };
      if (this.nodeList.length > 0 && this.paramList.length > 0 && this.topicMsg.length > 0) {
        const filtedNodes = this.nodeList.filter(n => this.filterROSTopic(n?.name));
        const filteredParams = this.paramList.filter(p => this.filterROSTopic(p?.name));

        filtedNodes.map(n => {
          n.services = n.services.filter(s => this.filterROSTopic(s));
          n.publishing = n.publishing.filter(p => this.filterROSTopic(p));
          n.subscribing = n.subscribing.filter(s => this.filterROSTopic(s));
          return n;
        });

        let nodes = filtedNodes.map(n => {
          n.topics = n.publishing.concat(n.subscribing).map(name => {
            return this.topicMsg.find(m => m?.name === name);
          });
          n.params = filteredParams.filter(param => param.node === n?.name);

          return n;
        });
        nodes.forEach(n => {
          n.publishing.forEach(pub => {
            if (!nodeFormTemp.publishing.find(temp => temp === pub)) {
              nodeFormTemp.publishing.push(pub);
            }
          });
          n.subscribing.forEach(sub => {
            if (!nodeFormTemp.subscribing.find(temp => temp === sub)) {
              nodeFormTemp.subscribing.push(sub);
            }
          });
          n.topics.forEach(topic => {
            if (
              !nodeFormTemp.topics.find(temp => {
                if (temp) {
                  return temp?.name === topic?.name && temp.type === topic.type;
                }
              })
            ) {
              nodeFormTemp.topics.push(topic);
            }
          });
        });
      }
      return nodeFormTemp;
    },
    filterROSTopic(topic) {
      const excludeList = [
        '/rosapi',
        '/rosout',
        '/rosbridge_websocket',
        '/rosversion',
        '/run_id',
        '/rosdistro',
      ];
      return !excludeList.includes(topic);
    },
    setCurrentTopic() {
      let topic = {};
      this.showVariable = false;
      if (this.topicName !== '' && this.msg !== '') {
        topic = this.topicMsg.find(t => {
          if (t.name === this.topicName && t.type === this.msg) {
            this.showVariable = true;
            return t;
          }
        });
      }
      this.topicSelected = topic;
    },
    handleButtonFormSubmit() {
      let currentButtonList = this.buttonList;
      let variables = {};
      if (this.variableList.length > 0) {
        let mapVariable = this.variableList[0];
        this.variableList.forEach(v => {
          mapVariable = _.merge(mapVariable, v);
        });
        variables = mapVariable;
      }
      if (!this.editState) {
        const robotId = this.robotConnected.id;
        let id = 1;
        if (currentButtonList.length > 0) {
          const sortedButton = currentButtonList.slice().sort((a, b) => a.buttonId - b.buttonId);
          id = sortedButton[currentButtonList.length - 1].buttonId + 1;
        }
        const checkInput =
          this.buttonMode === 'Topic' ? this.checkTopicInput() : this.checkParamInput();

        if (checkInput) {
          if (this.buttonName === '') {
            this.buttonName = this.topicName;
          }
          let btnForm = {
            buttonId: id,
            robotId: robotId,
            buttonStyle: {
              width: this.widthButton,
              height: this.heightButton,
              bg: this.bgButton,
              color: this.textColorButton,
            },
            buttonName: this.buttonName,
            buttonMode: this.buttonMode,
            buttonAction: {
              nodeType: this.nodeType,
              nodeAction: this.nodeAction,
              msgType: this.msg,
              topicName: this.topicName,
              variables: variables,
              paramName: this.paramName,
              paramValue: this.paramValue,
              paramAction: this.paramAction,
            },
          };
          currentButtonList.push(btnForm);
        }
        this.$store.dispatch('updateCloseAddButtonModal', true);
        this.setEmptyButtonForm();
      } else {
        // currentButtonList.map(b => {
        //   if (b.buttonId === this.buttonInfo.buttonId) {
        //     b.buttonAction.nodeType = this.nodeType;
        //     b.buttonAction.nodeAction = this.nodeAction;
        //     b.buttonAction.msgType = this.msg;
        //     b.buttonAction.topicName = this.topicName;
        //     b.buttonName = this.buttonName;
        //     b.buttonStyle.width = this.widthButton;
        //     b.buttonStyle.height = this.heightButton;
        //     b.buttonStyle.bg = this.bgButton;
        //     b.buttonStyle.color = this.textColorButton;
        //     b.buttonMode = this.buttonMode;
        //     if (this.variableList.length > 0) {
        //       b.buttonAction.variables = variables;
        //     }
        //   }
        //   return b;
        // });
        // let currentSelectedList = this.selectedButtonList;
        // currentSelectedList.map(b => {
        //   if (b.buttonId === this.buttonInfo.buttonId) {
        //     b.buttonAction.nodeType = this.nodeType;
        //     b.buttonAction.nodeAction = this.nodeAction;
        //     b.buttonAction.msgType = this.msg;
        //     b.buttonAction.topicName = this.topicName;
        //     b.buttonName = this.buttonName;
        //     b.buttonStyle.width = this.widthButton;
        //     b.buttonStyle.height = this.heightButton;
        //     b.buttonStyle.bg = this.bgButton;
        //     b.buttonStyle.color = this.textColorButton;
        //     b.buttonMode = this.buttonMode;
        //     if (this.variableList.length > 0) {
        //       b.buttonAction.variables = variables;
        //     }
        //   }
        //   return b;
        // });
        currentButtonList = this.setInputValue(currentButtonList, variables);
        let currentSelectedList = this.setInputValue(this.selectedButtonList, variables);
        this.$store.dispatch('updateCloseEditButtonModal', true);
        this.$store.dispatch('updateSelectedButtonList', currentSelectedList);
      }
      this.$store.dispatch('updateButtonList', currentButtonList);
      this.$store.dispatch('updateVariableList', []);
    },
    setEmptyButtonForm() {
      this.sameName = false;
      this.value = null;
      this.nodeType = '';
      this.nodeAction = '';
      this.topicName = '';
      this.buttonName = '';
      this.msg = '';
      this.widthButton = 120;
      this.bgButton = '#60A5FA';
      this.textColorButton = '#2C3E50';
      this.heightButton = 48;
      this.filteredMsg = [];
      this.paramAction = 'Set';
      this.paramValue = '';
      this.paramName = '';
      this.buttonMode = 'Topic';
      this.$store.dispatch('updateVariableList', []);
    },
    setInputValue(buttonList, variables) {
      let tempButtonList = buttonList;
      const mapButtonList = tempButtonList.map(b => {
        if (b.buttonId === this.buttonInfo.buttonId) {
          b.buttonAction.nodeType = this.nodeType;
          b.buttonAction.nodeAction = this.nodeAction;
          b.buttonAction.msgType = this.msg;
          b.buttonAction.topicName = this.topicName;
          b.buttonAction.paramName = this.paramName;
          b.buttonAction.paramValue = this.paramValue;
          b.buttonAction.paramAction = this.paramAction;
          b.buttonName = this.buttonName;
          b.buttonStyle.width = this.widthButton;
          b.buttonStyle.height = this.heightButton;
          b.buttonStyle.bg = this.bgButton;
          b.buttonStyle.color = this.textColorButton;
          b.buttonMode = this.buttonMode;
          if (this.variableList.length > 0) {
            b.buttonAction.variables = variables;
          }
        }
        return b;
      });
      return mapButtonList;
    },
    handleSameName() {
      if (this.buttonMode === 'Topic') {
        this.buttonName = this.topicName;
      } else {
        this.buttonName = this.paramName;
        this.widthButton = 160;
      }
    },
    checkTopicInput() {
      return (
        this.nodeType !== '' &&
        this.nodeAction !== '' &&
        this.topicName !== '' &&
        this.topicName !== '/'
      );
    },
    checkParamInput() {
      return this.paramAction === 'Set'
        ? this.paramValue !== '' && this.paramName !== ''
        : this.paramName !== '';
    },
    selectedMsgItem(item) {
      this.msg = item;
    },
    selectedNodeMsg(topic) {
      this.topicName = topic.name;
    },
    selectedParam(param) {
      this.paramName = param.name;
    },
    setEditInfo(state) {
      if (state) {
        this.nodeType = this.buttonInfo.buttonAction.nodeType;
        this.nodeAction = this.buttonInfo.buttonAction.nodeAction;
        this.msg = this.buttonInfo.buttonAction.msgType;
        this.topicName = this.buttonInfo.buttonAction.topicName;
        this.editedVariable = this.buttonInfo.buttonAction.variables;
        this.buttonName = this.buttonInfo.buttonName;
        this.widthButton = this.buttonInfo.buttonStyle.width;
        this.heightButton = this.buttonInfo.buttonStyle.height;
        this.bgButton = this.buttonInfo.buttonStyle.bg;
        this.textColorButton = this.buttonInfo.buttonStyle.color;
        this.buttonMode = this.buttonInfo.buttonMode;
        this.paramAction = this.buttonInfo.buttonAction.paramAction;
        this.paramValue = this.buttonInfo.buttonAction.paramValue;
        this.paramName = this.buttonInfo.buttonAction.paramName;
        this.keyVariableObject = Object.keys(this.buttonInfo.buttonAction.variables);
      } else {
        this.setEmptyButtonForm();
      }
    },
    async setNodeInfo() {},
  },
  watch: {
    msg(val) {
      this.showVariable = false;
      this.$store.dispatch('updateVariableList', []);
      if (val !== '') {
        this.filteredMsg = this.filteredMsgByTopic.filter(op => op.includes(val));
      } else {
        this.filteredMsg = this.filteredMsgByTopic;
      }
    },
    topicName(val) {
      this.showVariable = false;
      this.$store.dispatch('updateVariableList', []);
      if (val !== '') {
        // this.filteredNodeTopic = this.nodeTopicList.topics.filter(n => {
        //   if (n) {
        //     console.log('n', n.name);
        //     return n.name.includes(val);
        //   }
        // });
        this.filteredNodeTopic.topics = this.nodeTopicList().topics.filter(n => {
          if (n) {
            return n.name.includes(val);
          }
        });
      } else {
        this.msg = '';
        this.filteredNodeTopic.topics = this.nodeTopicList().topics;
      }
    },
    paramName(val) {
      if (val !== '') {
        this.filteredInputParams = this.filterTopicParamList().filter(p => {
          if (p) {
            return p.name.includes(val);
          }
        });
      } else {
        this.filteredInputParams = this.filterTopicParamList();
      }
    },
    editState(val) {
      this.setEditInfo(val);
      this.showVariable = false;
    },
  },
};
</script>

<style scoped>
.max-h-15 {
  max-height: 15rem;
}

.min-h-10 {
  min-height: 10rem;
}

.min-w-20 {
  min-width: 15rem;
}

.variable-container {
  max-height: 20rem;
  overflow: hidden;
  white-space: nowrap;
  overflow-x: scroll;
  overflow-y: scroll;
}
</style>
