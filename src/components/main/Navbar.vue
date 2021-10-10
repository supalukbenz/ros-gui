<template>
  <div class="h-20 bg-blue-custom flex items-center px-10 flex-row justify-between z-50 relative">
    <router-link class="cursor-pointer" to="/">
      <div class="flex items-end relative">
        <img class="w-10 h-auto" src="@/assets/images/robot-icon.png" alt="robotIcon" />
        <!-- <div class="font-bold text-2xl text-blue">ROS</div>
        <div class="text-2xl text-white">GUI</div> -->
        <div class="absolute left-0 bg-cloud w-24 h-10"></div>
        <div class="ros-txt font-bold text-2xl text-white">ROS</div>
        <div class="ml-1 text-2xl text-white">GUI</div>
      </div>
    </router-link>
    <div class="flex items-end" v-show="objectNotEmpty(robotConnected)">
      <div
        class="menu mr-4 font-bold text-xl text-white cursor-pointer"
        :class="{ 'selected-menu': pageName === 'Graph' }"
        @click="changePage('Graph')"
      >
        Graph
      </div>
      <div
        class="menu mr-4 font-bold text-xl text-white cursor-pointer"
        :class="{ 'selected-menu': pageName === 'StreamingVideo' }"
        @click="changePage('StreamingVideo')"
      >
        Streaming Video
      </div>
      <div
        class="menu mr-4 font-bold text-xl text-white cursor-pointer"
        :class="{ 'selected-menu': pageName === 'CustomizeButton' }"
        @click="changePage('CustomizeButton')"
      >
        Customize Button
      </div>
      <!-- <div class="menu mr-4 font-bold text-xl text-white cursor-pointer">Robot List</div> -->
      <div>
        <button
          class="border-2 selected-menu overflow-hidden bg-white rounded-3xl px-3 py-1"
          type="button"
          data-toggle="dropdown"
          id="dropdownMenuLink"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <div class="font-bold text-xl">
            {{ robotConnected.robotName }}
          </div>
        </button>
        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuLink">
          <div class="w-52 flex flex-col items-start pl-2 break-all">
            <div class="text-xs">Robot URI:</div>
            <div>ws://{{ robotConnected.ip }}:{{ robotConnected.port }}</div>
          </div>
          <hr />
          <div class="flex items-center justify-center mb-2">
            <button
              @click="handleRobotDisconnection()"
              class="bg-red-600 text-white font-semibold w-40 rounded-2xl p-1"
              type="button"
            >
              Disconnect
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { disconnectToRobot } from '@/api/connection';

export default {
  computed: {
    ...mapGetters({
      robotConnected: 'getRobotConnected',
      ros: 'getROS',
    }),
    pageName() {
      return this.$route.name;
    },
    robotName() {
      return this.$route.params.robotName;
    },
  },
  methods: {
    objectNotEmpty(obj) {
      return Object.keys(obj).length !== 0;
    },
    changePage(page) {
      this.$router
        .push({
          name: page,
          params: { robotName: this.robotName },
        })
        .catch(() => {});
    },
    async handleRobotDisconnection() {
      const robotForm = this.robotConnected;
      try {
        this.ros.close();
        // await disconnectToRobot(robotForm);
        this.$store.dispatch('updateRobotConnected', {});
        this.$store.dispatch('updateRosbridgeURL', '');
        this.$store.dispatch('updateROS', null);
        this.$store.dispatch('updateMsgList', {});
        this.$store.dispatch('updateTopicList', { topics: [], types: [] });
        this.$store.dispatch('updateDataTopic', {
          selection: [],
          source: [],
          expanded: [],
          arrayIndexTopic: [],
        });
        await disconnectToRobot(robotForm);
        this.$router
          .push({
            name: 'Home',
          })
          .catch(() => {});
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style scoped>
.bg-blue-custom {
  background: #485a73;
  /* background: #6c605b; */
}

.bg-cloud {
  background: #dea01e;
  z-index: -1;
}

.text-blue {
  color: #c2c2c2;
}

.ros-txt {
  letter-spacing: 2px;
}
.menu {
  border-bottom: 2px solid transparent;
}
.menu:hover {
  border-color: #dea01e;
}

.selected-menu {
  border-color: #dea01e !important;
}
</style>
