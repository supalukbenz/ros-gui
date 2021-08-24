<template>
  <div class="h-20 bg-blue-custom flex items-center px-10 flex-row justify-between z-50 relative">
    <router-link class="cursor-pointer" to="/">
      <div class="flex items-end">
        <img class="w-10 h-auto" src="@/assets/images/robot-icon.png" alt="robotIcon" />
        <div class="font-bold text-2xl text-blue">ROS</div>
        <div class="text-2xl text-white">GUI</div>
      </div>
    </router-link>
    <div class="flex items-end">
      <div class="mr-4 font-bold text-xl text-white hover:underline cursor-pointer">Robot List</div>
      <div v-show="objectNotEmpty(robotConnected)">
        <button
          class="w-48 border-2 border-black bg-white rounded-3xl p-1"
          type="button"
          data-toggle="dropdown"
          id="dropdownMenuLink"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <div class="font-bold text-xl">{{ robotConnected.robotName }}</div>
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
  },
  methods: {
    objectNotEmpty(obj) {
      return Object.keys(obj).length !== 0;
    },
    async handleRobotDisconnection() {
      const robotForm = {
        username: this.robotConnected.username,
        password: this.robotConnected.password,
        ip: this.robotConnected.ip,
      };
      await disconnectToRobot(robotForm);
      this.$store.dispatch('updateRobotConnected', {});
      this.ros.close();
      this.$store.dispatch('updateROS', null);
      this.$router.push({
        name: 'Home',
      });
    },
  },
};
</script>

<style scoped>
.bg-blue-custom {
  background: #485a73;
}

.text-blue {
  color: #c2c2c2;
}
</style>
