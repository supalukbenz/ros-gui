<template>
  <div>
    <div
      :class="[windowWidth < 992 ? 'flex-col' : 'flex-row']"
      class="flex py-2 px-4 justify-center"
    >
      <div class="flex justify-center flex-col mr-4">
        <div>
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
            <div class="font-bold">Types</div>
            <input
              type="text"
              class="border rounded w-full px-2 py-1"
              data-toggle="dropdown"
              :id="dropdownId"
              aria-haspopup="true"
              aria-expanded="false"
              placeholder="msgs type"
              v-model="msg"
            />
            <!-- <div
              type="text"
              class="border rounded w-72 px-2 py-1 overflow-y-scroll h-24 mt-14 absolute bg-white"
            >
              <div v-for="(option, index) in options" :key="index">{{ option }}</div>
            </div> -->
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
          <div class="w-full flex flex-col items-start mt-2">
            <div class="font-bold">Topic name</div>
            <input v-model="topicName" type="text" class="border rounded w-full px-2 py-1" />
          </div>
          <div class="w-full flex flex-col items-start mt-3">
            <div class="font-bold">Button name</div>
            <input v-model="buttonName" type="text" class="border rounded w-full px-2 py-1" />
            <div class="flex flex-row items-center">
              <input v-model="sameName" type="checkbox" @change="handleSameName()" />
              <span class="ml-1 text-sm">use the same name as topic</span>
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
      <div
        :class="[windowWidth < 992 ? 'mt-4' : 'w-72']"
        class="flex justify-center items-center bg-gray-100 p-4"
      >
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
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters({
      buttonList: 'getButtonList',
    }),
    msgTypeList() {
      return this.filteredMsg.length > 0 ? this.filteredMsg : this.options;
    },
    dropdownId() {
      return `dropdown${this.index}`;
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
      topicName: '/',
      buttonName: '',
      widthButton: 120,
      bgButton: '#60A5FA',
      textColorButton: '#2C3E50',
      heightButton: 48,
      options: [
        'bool',
        'byte',
        'char',
        'float32',
        'float64',
        'int8',
        'uint8',
        'int16',
        'uint16',
        'int32',
        'uint32',
        'int64',
        'uint64',
        'string',
        'wstring',
      ],
      msg: null,
      filteredMsg: [],
    };
  },
  mounted() {
    window.addEventListener('resize', () => {
      this.windowWidth = window.innerWidth;
    });
    this.setEditInfo(this.editState);
  },
  methods: {
    handleButtonFormSubmit() {
      const currentButtonList = this.buttonList;
      if (!this.editState) {
        let id = 1;
        if (currentButtonList.length > 0) {
          const sortedButton = currentButtonList.sort((a, b) => a.id - b.id);
          id = sortedButton[currentButtonList.length - 1].id + 1;
        }
        if (
          this.nodeType !== '' &&
          this.nodeAction !== '' &&
          this.topicName !== '' &&
          this.topicName !== '/'
        ) {
          if (this.buttonName === '') {
            this.buttonName = this.topicName;
          }
          const btnForm = {
            buttonId: id,
            nodeType: this.nodeType,
            nodeAction: this.nodeAction,
            msgType: this.msg,
            topicName: this.topicName,
            buttonName: this.buttonName,
            width: this.widthButton,
            height: this.heightButton,
            bg: this.bgButton,
            color: this.textColorButton,
            listState: true,
          };
          currentButtonList.push(btnForm);
        }
        this.$store.dispatch('updateCloseAddButtonModal', true);
        this.setEmptyButtonForm();
      } else {
        currentButtonList.map(b => {
          if (b.buttonId === this.buttonInfo.buttonId) {
            b.nodeType = this.nodeType;
            b.nodeAction = this.nodeAction;
            b.msgType = this.msg;
            b.topicName = this.topicName;
            b.buttonName = this.buttonName;
            b.width = this.widthButton;
            b.height = this.heightButton;
            b.bg = this.bgButton;
            b.color = this.textColorButton;
          }
          return b;
        });
        this.$store.dispatch('updateCloseEditButtonModal', true);
      }
      this.$store.dispatch('updateButtonList', currentButtonList);
    },
    setEmptyButtonForm() {
      this.sameName = false;
      this.value = null;
      this.nodeType = '';
      this.nodeAction = '';
      this.topicName = '/';
      this.buttonName = '';
      this.widthButton = 120;
      this.bgButton = '#60A5FA';
      this.textColorButton = '#2C3E50';
      this.heightButton = 48;
      this.filteredMsg = [];
    },
    handleSameName() {
      this.buttonName = this.topicName;
    },
    selectedMsgItem(item) {
      this.msg = item;
    },
    setEditInfo(state) {
      if (state) {
        this.nodeType = this.buttonInfo.nodeType;
        this.nodeAction = this.buttonInfo.nodeAction;
        this.msg = this.buttonInfo.msgType;
        this.topicName = this.buttonInfo.topicName;
        this.buttonName = this.buttonInfo.buttonName;
        this.widthButton = this.buttonInfo.width;
        this.heightButton = this.buttonInfo.height;
        this.bgButton = this.buttonInfo.bg;
        this.textColorButton = this.buttonInfo.color;
      } else {
        this.setEmptyButtonForm();
      }
    },
  },
  watch: {
    msg(val) {
      if (val !== '') {
        this.filteredMsg = this.options.filter(op => op.includes(val));
      } else {
        this.filteredMsg = this.options;
      }
    },
    editState(val) {
      this.setEditInfo(val);
    },
  },
};
</script>

<style scoped>
.max-h-15 {
  max-height: 15rem;
}
</style>
