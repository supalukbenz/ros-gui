<template>
  <div class="flex flex-row h-full">
    <SideBar></SideBar>
    <div class="m-3">
      <div class="border w-52 h-min-20">
        <div class="px-3 py-2 flex flex-row items-center justify-between h-14 bg-title">
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
      <!-- <div class="flex mb-2">
        <button
          @click="handleShowVideo()"
          type="button"
          class="border py-1 px-2 rounded bg-gray-600 text-white"
        >
          Video
        </button>
      </div>
      <VideoFrame
        v-show="showVideo"
        srcVideo="http://10.204.226.190:8081/"
        :width="420"
        :height="260"
      ></VideoFrame>
      <ConnectionPart></ConnectionPart> -->
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
import SideBar from '@/components/main/SideBar.vue';
import AddButtonModal from '@/components/buttonTool/AddButtonModal.vue';
import ButtonItem from '@/components/buttonTool/ButtonItem.vue';
// import ConnectionPart from '@/components/robotConnection/ConnectionPart.vue';
// import VideoFrame from '@/components/streaming/VideoFrame.vue';
import { mapGetters } from 'vuex';
import $ from 'jquery';

export default {
  components: {
    SideBar,
    // ConnectionPart,
    // VideoFrame,
    AddButtonModal,
    ButtonItem,
  },
  computed: {
    ...mapGetters({
      closeAddButtonModal: 'getCloseAddButtonModal',
      buttonList: 'getButtonList',
    }),
    setROSInfo() {
      return this.msg && this.topics && this.connectionState;
    },
  },
  data() {
    return {
      showVideo: false,
      // buttonList: [
      //   {
      //     nodeType: 'topic',
      //     nodeAction: 'publisher',
      //     msgType: 'int8',
      //     topicName: '/topic',
      //     buttonName: 'button1',
      //     width: '120',
      //     height: '48',
      //     bg: '#60A5FA',
      //     color: '#2C3E50',
      //     listState: true,
      //   },
      // ],
    };
  },
  methods: {
    handleShowVideo() {
      this.showVideo = !this.showVideo;
    },
  },
  watch: {
    closeAddButtonModal(val) {
      if (val) {
        $('#addButtonModal').modal('hide');
        this.$store.dispatch('updateCloseAddButtonModal', false);
      }
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

.bg-title {
  background: #3a8eaa;
}
</style>
