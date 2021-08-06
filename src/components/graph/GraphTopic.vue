<template>
  <div>
    <CheckboxTopic
      v-if="!isEmptyTopicList() && !isEmptyMsgList()"
      :topicList="topicList"
      :msgList="msgList"
    ></CheckboxTopic>
  </div>
</template>

<script>
import CheckboxTopic from '@/components/graph/CheckboxTopic.vue';
import { mapGetters } from 'vuex';
export default {
  components: {
    CheckboxTopic,
  },
  computed: {
    ...mapGetters({
      topicList: 'getTopicList',
      msgList: 'getMsgList',
      ros: 'getROS',
    }),
  },
  methods: {
    isEmptyTopicList() {
      return this.topicList.topics.length <= 0;
    },
    isEmptyMsgList() {
      console.log('Object.keys(this.msgList).length > 0', Object.keys(this.msgList).length > 0);
      return Object.keys(this.msgList).length <= 0;
    },
  },
};
</script>
