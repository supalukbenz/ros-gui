<template>
  <div class="wh-custom relative bg-green-100">
    <vue-draggable-resizable
      v-for="(selectedButton, index) in filterSelectedButtonList"
      :key="index"
      :x="selectedButton.buttonPosition.xPos"
      :y="selectedButton.buttonPosition.yPos"
      :style="{
        background: selectedButton.buttonStyle.bg,
        color: selectedButton.buttonStyle.color,
        width: selectedButton.buttonStyle.width + 'px',
        height: selectedButton.buttonStyle.height + 'px',
      }"
      :resizable="false"
      :parent="true"
      :draggable="moveState"
      @dragging="onDrag"
      @dragstop="(x, y) => onDragstop(x, y, selectedButton)"
      class="rounded font-bold cursor-pointer absolute"
    >
      <DraggableButtonItem
        :moveState="moveState"
        :selectedButton="selectedButton"
        :index="index"
      ></DraggableButtonItem>
    </vue-draggable-resizable>
  </div>
</template>

<script>
import VueDraggableResizable from 'vue-draggable-resizable';
import DraggableButtonItem from '@/components/buttonTool/DraggableButtonItem.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    VueDraggableResizable,
    DraggableButtonItem,
  },
  computed: {
    ...mapGetters({
      selectedButtonList: 'getSelectedButtonList',
      robotConnected: 'getRobotConnected',
    }),
    filterSelectedButtonList() {
      return this.selectedButtonList.filter(b => b.robotId === this.robotConnected.id);
    },
  },
  data() {
    return {
      moveState: true,
    };
  },
  props: {
    // moveState: Boolean,
  },
  methods: {
    onDragstop(x, y, button) {
      let currentSelectedBtnList = this.selectedButtonList.map(b => {
        if (Number(b.selectedId) === Number(button.selectedId)) {
          b.buttonPosition.xPos = x;
          b.buttonPosition.yPos = y;
        }
        return b;
      });
      this.$store.dispatch('updateSelectedButtonList', currentSelectedBtnList);
    },
  },
};
</script>

<style scoped>
.wh-custom {
  height: 720px;
  width: 100%;
}
</style>
