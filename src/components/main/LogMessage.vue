<template>
  <div>
    <div
      id="logContainer"
      class="
        bg-log-custom
        border
        fixed-content
        h-32
        m-3
        p-2
        text-left
        font-mono
        text-sm
        overflow-y-scroll overflow-x-scroll
      "
    >
      <div v-for="(log, index) in logMsg" :key="index">
        <span>[{{ log.dateString }}]</span><span class="font-bold"> {{ log.name }}:</span>
        {{ log.msg }}
      </div>
    </div>
    <div class="fixed-button w-14 h-14">
      <!-- <img src="@/assets/images/command-icon.png" /> -->
      <div class="absolute text-5xl text-blue-custom"><i class="fas fa-comment-alt"></i></div>
      <div class="absolute text-white pl-2 pt-2"><i class="fas fa-terminal"></i></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters({
      logMsg: 'getLogMessage',
    }),
    logMsgLength() {
      return this.logMsg.length;
    },
  },
  data() {
    return {
      // logMsg: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    };
  },
  mounted() {
    this.scrollToDown();
  },
  methods: {
    scrollToDown() {
      var logBody = document.getElementById('logContainer');
      logBody.scrollTop = logBody.scrollHeight;
    },
  },
  watch: {
    logMsgLength() {
      this.scrollToDown();
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap');

.bg-log-custom {
  background: rgba(183, 194, 210, 0.69);
}

.font-mono {
  font-family: 'Roboto Mono', monospace;
}

.border-blue-custom {
  border-color: #485a73 !important;
}

.text-blue-custom {
  color: #485a73;
}

.fixed-content {
  position: fixed;
  bottom: 0px;
  right: 0px;
}

.fixed-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
}
</style>
