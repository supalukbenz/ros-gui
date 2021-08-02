<template>
  <div class="bg-gray-200 w-72 min-h-35 text-left p-4">
    <div class="font-bold">Tools</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters({
      robotConnected: 'getRobotConnected',
    }),
  },
};
</script>

<style scoped>
.min-h-35 {
  min-height: 30rem;
}
</style>
