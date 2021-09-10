<template>
  <div class="h-full w-full my-3 ml-3 mr-3">
    <!-- <SideBar></SideBar> -->
    <div class="flex flex-row w-full h-full">
      <div class="h-full">
        <div class="border w-52 h-min-20 rounded-sm overflow-y-scroll">
          <div
            class="px-3 py-2 flex flex-row items-center justify-between h-14 bg-title rounded-t-sm"
          >
            <div class="font-bold text-lg text-white mt-1">Button List</div>
            <button
              type="button"
              data-toggle="modal"
              data-target="#addButtonModal"
              class="rounded-full h-7 w-7 bg-green-400 text-white font-bold hover:bg-green-500"
            >
              +
            </button>
          </div>
          <div v-for="(buttonInfo, index) in buttonList" :key="index" class="px-1 pt-1 w-full">
            <ButtonItem :buttonInfo="buttonInfo" :index="index + 1"></ButtonItem>
          </div>
        </div>
      </div>
      <div
        class="ml-3 shadow w-full h-custom bg-board"
        :class="[moveState ? 'bg-container' : '']"
        id="grid-container"
      >
        <div class="w-full h-full" :class="[moveState ? 'canvas' : '']">
          <vue-draggable-resizable
            @dragstop="(x, y) => onDragstop(x, y, selectedButton)"
            v-for="(selectedButton, index) in selectedButtonList"
            :key="index"
            :x="selectedButton.buttonPosition.xPos"
            :y="selectedButton.buttonPosition.yPos"
            :style="{
              background: selectedButton.bg,
              color: selectedButton.color,
              width: selectedButton.width + 'px',
              height: selectedButton.height + 'px',
            }"
            :parent="true"
            :resizable="false"
            :draggable="moveState"
            class="flex flex-row rounded font-bold relative cursor-pointer"
          >
            <!-- {{ selectedButton.buttonName }} -->
            <button
              :class="[moveState ? 'cursor-move-btn' : 'cursor-pointer']"
              :style="{
                width: selectedButton.width + 'px',
                height: selectedButton.height + 'px',
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
                class="cursor-pointer text-xs w-2 -mr-2 -mt-2 text-gray-600 hover:text-gray-700"
              >
                <i class="fas fa-times-circle"></i>
              </div>
            </div>
          </vue-draggable-resizable>
        </div>
      </div>
      <div class="ml-3">
        <button
          @click="handleChangePosition()"
          :class="[moveState ? 'bg-clicked-btn' : 'bg-button-move']"
          type="button"
          class="border-green shadow rounded-full w-10 h-10"
        >
          <span v-show="!moveState"><i class="fas fa-arrows-alt"></i></span>
          <span v-show="moveState"><i class="fas fa-save"></i></span>
        </button>
      </div>
    </div>
    <div class="modal fade" id="addButtonModal" role="dialog">
      <div class="modal-dialog modal-dialog-centered modal-lg w-fit modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">Add button</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <AddButtonModal :editState="false" :index="0"></AddButtonModal>
          </div>
          <div class="modal-footer"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import SideBar from '@/components/main/SideBar.vue';
import AddButtonModal from '@/components/buttonTool/AddButtonModal.vue';
import ButtonItem from '@/components/buttonTool/ButtonItem.vue';
import VueDraggableResizable from 'vue-draggable-resizable';

// import ConnectionPart from '@/components/robotConnection/ConnectionPart.vue';
// import VideoFrame from '@/components/streaming/VideoFrame.vue';
import { mapGetters } from 'vuex';
import $ from 'jquery';

export default {
  components: {
    // SideBar,
    // ConnectionPart,
    // VideoFrame,
    AddButtonModal,
    ButtonItem,
    VueDraggableResizable,
  },
  computed: {
    ...mapGetters({
      closeAddButtonModal: 'getCloseAddButtonModal',
      buttonList: 'getButtonList',
      selectedButtonList: 'getSelectedButtonList',
      topicMsg: 'getTopicMsg',
      paramList: 'getParamList',
      nodeList: 'getNodeList',
    }),
    dragButtonId(id) {
      return `drag${id}`;
    },
    nodeInfo() {
      const filtedNodes = this.nodeList.filter(n => this.filterROSTopic(n));
      const filteredParams = this.paramList.filter(p => this.filterROSTopic(p));

      filtedNodes.map(n => {
        n.services = n.services.filter(s => this.filterROSTopic(s));
        n.publishing = n.publishing.filter(p => this.filterROSTopic(p));
        n.subscribing = n.subscribing.filter(s => this.filterROSTopic(s));
        return n;
      });

      const nodes = filtedNodes.map(n => {
        n.topics = n.publishing
          .concat(n.subscribing)
          .map(name => this.topicMsg.find(m => m.name === name));
        n.params = filteredParams.filter(param => param.node === n.name);

        return n;
      });

      return nodes;
    },
  },
  mounted() {},
  data() {
    return {
      showVideo: false,
      moveState: false,
    };
  },
  methods: {
    onDragstop(x, y, button) {
      console.log(x, y);
      console.log(button);
      let currentSelectedBtnList = this.selectedButtonList.map(b => {
        if (Number(b.selectedId) === Number(button.selectedId)) {
          console.log('if');
          b.buttonPosition.xPos = x;
          b.buttonPosition.yPos = y;
        }
        return b;
      });
      this.$store.dispatch('updateSelectedButtonList', currentSelectedBtnList);
    },
    onResize() {},
    clickedSelectedButton(button) {
      console.log(button.buttonName);
    },
    handleShowVideo() {
      this.showVideo = !this.showVideo;
    },
    handleChangePosition() {
      this.moveState = !this.moveState;
    },
    handleSavePosition() {
      this.moveState = !this.moveState;
    },
    removeSelectedButton(index) {
      const currentSelectedBtnList = this.selectedButtonList;
      currentSelectedBtnList.splice(index, 1);
      this.$store.dispatch('updateSelectedButtonList', currentSelectedBtnList);
    },
    filterROSTopic(topic) {
      if (topic.name) {
        topic = topic.name;
      }
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
  },
  watch: {
    closeAddButtonModal(val) {
      if (val) {
        $('#addButtonModal').modal('hide');
        this.$store.dispatch('updateCloseAddButtonModal', false);
      }
    },
    selectedButtonList: {
      handler() {
        this.moveState = true;
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.w-fit {
  width: fit-content;
}

.h-min-20 {
  min-height: 35rem;
}

.remove-h {
  height: 10px;
}

.bg-title {
  background: #3a8eaa;
}

.bg-board {
  background: #ffffff;
}
.z-10 {
  z-index: 10;
}

.z-20 {
  z-index: 20;
}

.h-custom {
  height: 720px;
}

.bg-button-move {
  background: #cdf0ff;
}

.bg-button-move:hover {
  background: #344a53;
  color: #ffffff;
}

.bg-clicked-btn {
  background: #344a53;
  color: #ffffff;
}

.bg-canvas {
  background: #434343;
}

.border-green {
  border: 2px solid #344a53;
}

.cursor-move-btn {
  cursor: move !important;
}

.bg-container {
  background-color: #ffffff;
  background-size: 75px 75px;
  background-image: linear-gradient(
      0deg,
      transparent 24%,
      rgba(0, 0, 0, 0.05) 25%,
      rgba(0, 0, 0, 0.05) 26%,
      transparent 27%,
      transparent 74%,
      rgba(0, 0, 0, 0.05) 75%,
      rgba(0, 0, 0, 0.05) 76%,
      transparent 77%,
      transparent
    ),
    linear-gradient(
      90deg,
      transparent 24%,
      rgba(0, 0, 0, 0.05) 25%,
      rgba(0, 0, 0, 0.05) 26%,
      transparent 27%,
      transparent 74%,
      rgba(0, 0, 0, 0.05) 75%,
      rgba(0, 0, 0, 0.05) 76%,
      transparent 77%,
      transparent
    );
}

.canvas {
  width: 100%;
  height: 100%;
  /* position: absolute; */

  background-color: transparent;
  background-size: 15px 15px;
  background-image: linear-gradient(
      0deg,
      transparent 24%,
      rgba(0, 0, 0, 0.05) 25%,
      rgba(0, 0, 0, 0.05) 26%,
      transparent 27%,
      transparent 74%,
      rgba(0, 0, 0, 0.05) 75%,
      rgba(0, 0, 0, 0.05) 76%,
      transparent 77%,
      transparent
    ),
    linear-gradient(
      90deg,
      transparent 24%,
      rgba(0, 0, 0, 0.05) 25%,
      rgba(0, 0, 0, 0.05) 26%,
      transparent 27%,
      transparent 74%,
      rgba(0, 0, 0, 0.05) 75%,
      rgba(0, 0, 0, 0.05) 76%,
      transparent 77%,
      transparent
    );
}
</style>
