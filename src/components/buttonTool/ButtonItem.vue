<template>
  <div>
    <!-- <button
      :style="{
        width: buttonInfo.width + 'px',
        height: buttonInfo.height + 'px',
        background: buttonInfo.bg,
        color: buttonInfo.color,
      }"
      type="button"
      class="rounded font-bold"
    >
      {{ buttonInfo.buttonName }}
    </button> -->
    <div
      class="
        h-10
        font-bold
        flex
        justify-start
        items-center
        pl-2
        cursor-pointer
        button-item
        border-tran
        overflow-hidden
        rounded-sm
        relative
      "
      :id="buttonId"
      :style="{
        background: buttonInfo.buttonStyle.bg,
        color: buttonInfo.buttonStyle.color,
      }"
      @click="addSelectedButton()"
      @contextmenu.prevent="handlerRightClick"
    >
      {{ buttonInfo.buttonName }}
    </div>
    <div
      class="dropdown-menu dropdownRightButton"
      :id="menuId"
      aria-labelledby="dropdownMenuButton"
    >
      <!-- <a class="dropdown-item cursor-pointer">Info</a> -->
      <a class="dropdown-item cursor-pointer" @click="handleEditButton()">Edit</a>
      <a class="dropdown-item text-red cursor-pointer" @click="handleRemoveButton()">Remove</a>
    </div>
    <div class="modal fade" :id="modalId" role="dialog">
      <div
        :class="{ 'modal-lg': editState, '': removeState }"
        class="modal-dialog modal-dialog-centered w-fit modal-dialog-scrollable"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">
              {{ editState ? 'Edit button' : 'Remove button' }}
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div v-if="editState" class="modal-body">
            <div>
              <AddButtonModal
                :index="index"
                :buttonInfo="buttonInfo"
                :editState="editState"
              ></AddButtonModal>
            </div>
          </div>
          <div v-if="removeState" class="modal-body">
            <div class="text-xl mb-4">
              Are you sure to remove
              <span class="font-bold text-red-500">{{ buttonInfo.buttonName }}</span>
            </div>
            <div class="flex justify-end">
              <button type="button" @click="clickedRemoveButton()" class="btn btn-danger mr-3">
                Remove
              </button>
              <button
                type="button"
                @click="removeState = false"
                class="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
          <div class="modal-footer"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import AddButtonModal from '@/components/buttonTool/AddButtonModal.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    AddButtonModal,
  },
  data() {
    return {
      clickedButtonState: false,
      info: null,
      editState: false,
      removeState: false,
    };
  },
  created() {
    this.editState = false;
    this.removeState = false;
  },
  computed: {
    ...mapGetters({
      buttonList: 'getButtonList',
      closeEditButtonModal: 'getCloseEditButtonModal',
      selectedButtonList: 'getSelectedButtonList',
    }),
    modalId() {
      return `modal${this.index}`;
    },
    menuId() {
      return `menu${this.index}`;
    },
    buttonId() {
      return `button${this.index}`;
    },
  },
  props: {
    buttonInfo: Object,
    index: Number,
  },
  mounted() {
    this.buttonRightClick();
    $(document).mouseup(e => {
      var container = $(`#${this.buttonId}`);
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        $(`#${this.menuId}`).removeClass('show').hide();
        this.clickedButtonState = false;
      }
    });
  },
  methods: {
    addSelectedButton() {
      let currentSelectedButton = this.selectedButtonList;
      let selectedId = 1;
      if (currentSelectedButton.length > 0) {
        const sortedButton = currentSelectedButton.sort((a, b) => a.selectedId - b.selectedId);
        selectedId = sortedButton[currentSelectedButton.length - 1].selectedId + 1;
        console.log('selectedId', selectedId);
      }
      let currentButton = this.buttonInfo;
      currentButton.selectedId = selectedId;
      currentButton.buttonPosition = {
        xPos: 0,
        yPos: 0,
      };
      currentSelectedButton.push(currentButton);
      console.log(currentButton);
      this.$store.dispatch('updateSelectedButtonList', currentSelectedButton);
    },
    handlerRightClick() {
      // this.editState = true;
      // console.log('this', this.modalId);
      // $(`#${this.modalId}`).modal('show');
    },
    handleEditButton() {
      this.editState = true;
      this.removeState = false;
      $(`#${this.modalId}`).modal('show');
      this.$store.dispatch('updateCloseEditButtonModal', false);
    },
    handleRemoveButton() {
      this.removeState = true;
      this.editState = false;
      $(`#${this.modalId}`).modal('show');
    },
    clickedRemoveButton() {
      let currentButtonList = this.buttonList;
      let currentSelectedList = this.selectedButtonList;
      const indexButtonList = currentButtonList.findIndex(
        r => r.buttonId === this.buttonInfo.buttonId
      );
      currentButtonList.splice(indexButtonList, 1);

      const indexSelectedList = currentSelectedList.findIndex(
        r => r.buttonId === this.buttonInfo.buttonId
      );
      currentSelectedList.splice(indexSelectedList, 1);
      this.$store.dispatch('updateButtonList', currentButtonList);
      this.$store.dispatch('updateSelectedButtonList', currentSelectedList);
      $(`#${this.modalId}`).modal('hide');
      this.removeState = false;
    },
    buttonRightClick() {
      $(`#${this.buttonId}`)
        .on('contextmenu', () => {
          $(`#${this.menuId}`)
            .css({
              display: 'block',
            })
            .addClass('show');
          return false;
        })
        .on('click', () => {
          $(`#${this.menuId}`).removeClass('show').hide();
          this.clickedButtonState = false;
        });
    },
  },
  watch: {
    closeEditButtonModal(val) {
      if (val) {
        console.log('close modal');
        $(`#${this.modalId}`).modal('hide');
        this.editState = false;
        // this.$store.dispatch('updateCloseEditButtonModal', false);
      }
    },
  },
};
</script>

<style>
.border-tran {
  border: 2px solid transparent;
}

.border-tran:hover {
  border-color: #535353;
}

.text-red {
  color: rgb(228, 57, 57) !important;
}
.dropdownRightButton {
  /* position: static !important; */
}

.modal-backdrop {
  z-index: 0 !important;
}
</style>
