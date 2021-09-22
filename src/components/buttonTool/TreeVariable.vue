<template>
  <div>
    <div v-for="(key, index) in keyVariableObject" :key="index" class="text-left flex flex-col">
      <div class="" v-if="typeof keyObj[key] === 'object'">
        <div :style="{ marginLeft: depth + 'px' }" class="text-muted text-sm">{{ key }}/</div>
        <tree-variable :keyObj="keyObj[key]" :depth="depth + 10"></tree-variable>
      </div>
      <div :style="{ marginLeft: depth + 'px' }" v-else>
        <span class="font-bold text-left text-sm">{{ key }}: {{ keyObj[key] }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import TreeVariable from '@/components/buttonTool/TreeVariable.vue';

export default {
  name: 'tree-variable',
  components: {
    'tree-variable': TreeVariable,
  },
  props: {
    keyObj: Object,
    depth: Number,
  },
  computed: {
    keyVariableObject() {
      return Object.keys(this.keyObj);
    },
  },
};
</script>
