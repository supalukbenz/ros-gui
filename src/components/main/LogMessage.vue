<template>
  <div>
    <div
      id="logContainer"
      v-show="showLog"
      class="
        bg-log-custom
        max-w
        border
        fixed-content
        h-32
        m-3
        p-2
        text-left
        font-mono
        text-sm
        z-50
        overflow-y-scroll overflow-x-scroll
      "
      :class="[showLog ? 'fade-in' : 'fade-out']"
    >
      <div v-for="(log, index) in logMsg" :key="index">
        <span>[{{ log.dateString }}]</span><span class="font-bold"> {{ log.name }}:</span>
        {{ log.msg }}
      </div>
    </div>
    <div @click="handleOpenLog()" class="z-150 fixed-button w-14 h-14 cursor-pointer opacity-50">
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
      showLog: 'getShowLogMessage',
    }),
    logMsgLength() {
      return this.logMsg.length;
    },
  },
  mounted() {
    this.scrollToDown();
  },
  methods: {
    scrollToDown() {
      var logBody = document.getElementById('logContainer');
      logBody.scrollTop = logBody.scrollHeight;
    },
    handleOpenLog() {
      this.$store.dispatch('updateShowLogMessage', !this.showLog);
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

.z-50 {
  z-index: 50;
}

.z-150 {
  z-index: 150;
}

.fade-in {
  -webkit-animation: fadeIn 1s;
  animation: fadeIn 1s;
}

.fade-out {
  -webkit-animation: fadeOut 1s;
  animation: fadeOut 1s;
}

@-webkit-keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@-webkit-keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.font-mono {
  font-family: 'Roboto Mono', monospace;
}

.border-blue-custom {
  border-color: #3f13a6 !important;
}

.text-blue-custom {
  color: #3f13a6;
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

.max-w {
  max-width: 80%;
  white-space: nowrap;
}
</style>
