<template>
  <div class="card">
    <div class="flex items-center">
      <h5 class="card-title">
        {{ topic.name }}
        <small class="text-muted">({{ topic.type }})</small>
      </h5>
    </div>
    <div v-if="topic.info">
      <form class="flex">
        <TypeNodeForm :info="topic.info"></TypeNodeForm>
      </form>
    </div>
  </div>
</template>

<script>
import TypeNodeForm from '@/components/buttonTool/TypeNodeForm.vue';
export default {
  components: {
    TypeNodeForm,
  },
  props: {
    topic: Object,
  },
};
</script>
