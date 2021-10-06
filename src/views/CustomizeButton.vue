<template>
  <div class="h-full w-auto relative">
    <div
      class="z-40 bg-white border border-l w-52 rounded overflow-y-scroll mb-3 absolute"
      :class="[showButtonList ? 'h-80' : 'h-auto']"
    >
      <div class="px-3 py-2 flex flex-row items-center justify-between rounded-lg buttonListMenu">
        <div
          :class="[showButtonList ? '' : 'fade-in']"
          class="font-bold text-lg mt-1 menu cursor-pointer"
          @click="handleButtonListShowing()"
        >
          Button List
        </div>
        <button
          type="button"
          data-toggle="modal"
          data-target="#addButtonModal"
          class="rounded-full h-7 w-7 bg-green-400 text-white font-bold hover:bg-green-500"
        >
          +
        </button>
      </div>
      <div
        class="absolute w-full z-40 buttonListMenu"
        v-if="showButtonList"
        :class="[showButtonList ? 'fade-out' : 'fade-in']"
      >
        <hr class="mb-2 m-0" />
        <div
          v-for="(buttonInfo, index) in filterButtonList"
          :key="index"
          class="px-1 pt-1 w-full relative"
        >
          <ButtonItem
            class="buttonListMenu"
            :buttonInfo="buttonInfo"
            :index="index + 1"
          ></ButtonItem>
        </div>
      </div>
    </div>
    <div class="absolute right-0 top-0">
      <div class="flex flex-row items-end">
        <input id="fileUpload" ref="file" type="file" class="hidden" @change="updateFile" />
        <button
          type="button"
          @click="$refs.file.click()"
          class="mr-3 py-1 px-3 rounded-lg border-2 border-gray-500 font-bold hover:bg-gray-100"
        >
          Import <i class="fas fa-upload ml-1"></i>
        </button>
        <a
          id="exportBtn"
          class="
            mr-10
            py-1
            px-3
            rounded-lg
            bg-gray-500
            hover:bg-gray-600
            border-2 border-gray-500
            text-white
            font-bold
            cursor-pointer
          "
          @click="exportButtonList()"
        >
          <i class="fas fa-file-download"></i>
        </a>
        <button
          @click="handleChangePosition()"
          :class="[moveState ? 'bg-clicked-btn' : 'bg-button-move']"
          type="button"
          class="border-green shadow rounded-full w-10 h-10 z-40"
        >
          <span v-show="!moveState"><i class="fas fa-arrows-alt"></i></span>
          <span v-show="moveState"><i class="fas fa-save"></i></span>
        </button>
      </div>
    </div>
    <!-- <SideBar></SideBar> -->
    <div class="flex flex-row w-full h-full relative mt-20">
      <div
        class="shadow w-full h-custom rounded-lg bg-board overflow-auto flex relative inset-custom"
        ref="parent"
        id="grid-container"
      >
        <div
          class="bg-container wh-custom m-10 relative"
          :class="[moveState ? 'bg-canvas' : 'bg-white']"
        >
          <div id="parent" class="wh-custom border-2 canvas">
            <vue-draggable-resizable
              @dragstop="(x, y) => onDragstop(x, y, selectedButton)"
              v-for="(selectedButton, index) in filterSelectedButtonList"
              :key="index"
              :x="Math.abs(selectedButton.buttonPosition.xPos)"
              :y="Math.abs(selectedButton.buttonPosition.yPos)"
              :style="{
                background: selectedButton.buttonStyle.bg,
                color: selectedButton.buttonStyle.color,
                width: selectedButton.buttonStyle.width + 'px',
                height: selectedButton.buttonStyle.height + 'px',
              }"
              :parent="true"
              :resizable="false"
              :draggable="moveState"
              class="flex flex-row rounded font-bold cursor-pointer z-auto"
            >
              <DraggableButtonItem
                :moveState="moveState"
                :selectedButton="selectedButton"
                :index="index"
                class="absolute"
              ></DraggableButtonItem>
            </vue-draggable-resizable>
          </div>
        </div>
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
// import VueDraggableResizable from 'vue-draggable-resizable';
import DraggableButtonItem from '@/components/buttonTool/DraggableButtonItem.vue';
// import Canvas from '@/components/buttonTool/Canvas.vue';
import { mapGetters } from 'vuex';
import $ from 'jquery';

export default {
  components: {
    // SideBar,
    // ConnectionPart,
    // VideoFrame,
    AddButtonModal,
    ButtonItem,
    // Canvas,
    // VueDraggableResizable,
    DraggableButtonItem,
  },
  computed: {
    ...mapGetters({
      closeAddButtonModal: 'getCloseAddButtonModal',
      buttonList: 'getButtonList',
      ros: 'getROS',
      rosbridgeURL: 'getRosbridgeURL',
      robotConnected: 'getRobotConnected',
      selectedButtonList: 'getSelectedButtonList',
    }),
    filterSelectedButtonList() {
      return this.selectedButtonList.filter(b => b.robotId === this.robotConnected.id);
    },
    filterButtonList() {
      return this.buttonList.filter(b => b.robotId === this.robotConnected.id);
    },
    dragButtonId(id) {
      return `drag${id}`;
    },
    lengthSelectedButtonList() {
      return this.selectedButtonList.length;
    },
  },
  mounted() {
    $(document).mouseup(e => {
      var container = $('.buttonListMenu');
      if (container.has(e.target).length === 0) {
        this.showButtonList = false;
      }
    });
  },
  data() {
    return {
      showVideo: false,
      moveState: false,
      nodeInfo1: [],
      rosTopic: null,
      subscribeInput: null,
      clikedButtonIdList: [],
      showButtonList: false,
      parentWidth: null,
      canvasWidth: 640,
      fileUpload: null,
    };
  },
  methods: {
    updatePositionButton(left, top, button) {
      // let x = (left / this.$refs.parent.offsetWidth) * 100;
      // let y = (top / this.$refs.parent.offsetHeight) * 100;
      console.log(this.$refs.parent.offsetHeight);
      let x = left;
      let y = top;
      console.log(x, y);
      let currentSelectedBtnList = this.selectedButtonList.map(b => {
        if (Number(b.selectedId) === Number(button.selectedId)) {
          console.log('if');
          b.buttonPosition.xPos = Math.abs(x);
          b.buttonPosition.yPos = Math.abs(y);
        }
        return b;
      });
      this.$store.dispatch('updateSelectedButtonList', currentSelectedBtnList);
    },
    onDragstop(x, y, button) {
      console.log(x, y);
      this.updatePositionButton(x, y, button);
    },
    onDrag(x, y) {
      console.log('drag', x, y);
    },
    onResizing(left, top, width, height, selectedButton) {
      let w = (width / this.$refs.parent.offsetWidth) * 100;
      let h = (height / this.$refs.parent.offsetHeight) * 100;

      console.log(selectedButton.selectedId, w, h);
    },
    handleButtonListShowing() {
      this.showButtonList = !this.showButtonList;
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
    exportButtonList() {
      const el = document.getElementById('exportBtn');
      const buttonListObj = {
        buttonList: this.filterButtonList,
        selectedButtonList: this.filterSelectedButtonList,
      };
      let dataDownload =
        'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(buttonListObj));
      el.setAttribute('href', 'data:' + dataDownload);
      const fileName = `button_${this.robotConnected.robotName}.json`;
      el.setAttribute('download', fileName);
    },
    updateFile(event) {
      const files = event.target.files;
      const reader = new FileReader();
      reader.onload = e => {
        this.fileUpload = JSON.parse(e.target.result);
        // console.log('JSON.parse(this.fileUpload)', JSON.parse(this.fileUpload));
      };
      reader.readAsText(files[0]);
      // const fileJson = JSON.parse(this.fileUpload);
      // console.log('fileJson', fileJson);
    },
  },
  watch: {
    closeAddButtonModal(val) {
      if (val) {
        $('#addButtonModal').modal('hide');
        this.$store.dispatch('updateCloseAddButtonModal', false);
      }
    },
    lengthSelectedButtonList() {
      this.moveState = true;
    },
    fileUpload(val) {
      if (val) {
        let currentButtonList = this.buttonList;
        const robotId = this.robotConnected.id;
        let currentSelectedBtnList = this.selectedButtonList;
        console.log('this.fileUpload', val);
        for (let btn of val.buttonList) {
          btn.robotId = robotId;
          console.log('btn.robotId', btn.robotId);
          currentButtonList.push(btn);
        }
        this.$store.dispatch('updateButtonList', currentButtonList);
        for (let btn of val.selectedButtonList) {
          btn.robotId = robotId;
          currentSelectedBtnList.push(btn);
        }
        this.$store.dispatch('updateSelectedButtonList', currentSelectedBtnList);
      }
    },
    // loadData: {
    //   handler() {
    //     console.log('wow');
    //   },
    //   deep: true,
    // },
    // nodeInfo: {
    //   handler(val) {
    //     if (val) {
    //       // check if userid is available
    //       this.setNodeInfo(val);
    //     }
    //   },
    //   // immediate: true, // make this watch function is called when component created
    // },
  },
};
</script>

<style scoped>
.w-fit {
  width: fit-content;
}

.menu {
  border-bottom: 2px solid transparent;
}
.menu:hover {
  border-color: #dea01e;
}

.border-l {
  border-left: 3px solid #dea01e !important;
}

.remove-h {
  height: 10px;
}

.bg-title {
  background: #3a8eaa;
}

.border .bg-board {
  background: #f0f0f0;
}
.z-40 {
  z-index: 40;
}

.z-20 {
  z-index: 20;
}

.h-custom {
  height: 900px;
}

.wh-custom {
  height: 720px;
  width: 800px;
  /* background: #f8f3ea; */
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
  background: #eeecec;
}

.border-green {
  border: 2px solid #344a53;
}

.cursor-move-btn {
  cursor: move !important;
}

/* .inset-custom {
  inset: 94px 240px 38px 234px;
} */

.bg-container {
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
  /* width: 100%;
  height: 100%; */
  /* position: absolute; */

  background-color: transparent;
  /* background: #b4b4b4; */
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

.bg-board::-webkit-scrollbar {
  -webkit-appearance: none;
}

.bg-board::-webkit-scrollbar:vertical {
  width: 11px;
}

.bg-board::-webkit-scrollbar:horizontal {
  height: 11px;
}

.bg-board::-webkit-scrollbar-thumb {
  border-radius: 8px;
  border: 2px solid white; /* should match background, can't be transparent */
  background-color: rgba(0, 0, 0, 0.5);
}

.fade-in {
  -webkit-animation: fadeOut 1s;
  animation: fadeOut 1s;
}

.fade-out {
  -webkit-animation: fadeIn 1s;
  animation: fadeIn 1s;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOut {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}
</style>
