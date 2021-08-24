<template>
  <div>
    <CheckboxTopic></CheckboxTopic>
  </div>
</template>

<script>
import CheckboxTopic from '@/components/graph/CheckboxTopic.vue';
// import TopicListModal from '@/components/graph/TopicListModal.vue';
import { mapGetters } from 'vuex';
export default {
  components: {
    CheckboxTopic,
    // TopicListModal,
  },
  computed: {
    ...mapGetters({
      topicList: 'getTopicList',
      msgList: 'getMsgList',
      ros: 'getROS',
    }),
  },
  methods: {},
};
</script>

<style scoped>
@media screen and (max-width: 992px) {
  .modal-dialog {
    margin: 4rem;
    max-width: 100%;
  }
}
</style>
