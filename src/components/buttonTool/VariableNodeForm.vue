<template>
  <div class="card p-2">
    <div class="flex items-center">
      <div>
        <strong class="mr-1">{{ topic.name }}</strong>
        <small class="text-muted">({{ topic.type }})</small>
      </div>
    </div>
    <div v-if="topic.info">
      <form class="flex">
        <TypeNodeForm :info="topic.info" :editedVariable="editedVariable"></TypeNodeForm>
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
    editedVariable: Object,
  },
  methods: {},
};
</script>
