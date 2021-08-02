<template>
  <div class="m-4">
    <form class="mr-10">
      <div class="form-group">
        <div class="text-left font-semibold">Robot Name</div>
        <input
          type="text"
          v-model="robotName"
          class="form-control outline-none"
          placeholder="Name"
          :class="{ 'border-green': robot ? robot.robotName !== robotName : '' }"
        />
      </div>
      <div class="form-row">
        <div class="form-group col-md-8">
          <div class="text-left font-semibold">Robot IP</div>
          <input
            type="email"
            v-model="robotIP"
            class="form-control"
            placeholder="10.0.0.1"
            :class="{ 'border-green': robot ? robot.ip !== robotIP : '' }"
          />
        </div>
        <div class="form-group col-md-4">
          <div class="text-left font-semibold">Port</div>
          <div class="flex">
            <div class="mr-1 flex items-center font-bold">:</div>
            <input
              v-model="port"
              type="number"
              class="form-control"
              placeholder="9090"
              :class="{ 'border-green': robot ? robot.port !== port : '' }"
            />
          </div>
        </div>
      </div>
      <hr />
      <div class="text-left text-xl font-bold mb-2">SSH Login</div>
      <div class="form-row">
        <div class="form-group col-md-6">
          <div class="text-left font-semibold">Username</div>
          <input
            type="email"
            v-model="username"
            class="form-control"
            :class="{ 'border-green': robot ? robot.username !== username : '' }"
          />
        </div>
        <div class="form-group col-md-6">
          <div class="text-left font-semibold">Password</div>
          <input
            type="password"
            v-model="password"
            class="form-control"
            placeholder="***"
            :class="{ 'border-green': robot ? robot.password !== password : '' }"
          />
        </div>
      </div>
    </form>
    <div class="flex justify-end footer mr-10 mt-8">
      <button
        v-show="editState"
        type="button"
        @click="handleRemoveRobot()"
        class="bg-red-500 text-white w-36 py-2 rounded-lg font-bold mr-4"
      >
        <i class="fas fa-trash-alt"></i>
        Remove robot
      </button>
      <button
        type="button"
        @click="handleRobotFormSubmit()"
        class="bg-green-500 text-white w-36 py-2 rounded-lg font-bold"
      >
        Submit
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters({
      robotList: 'getRobotList',
    }),
  },
  props: {
    editState: Boolean,
    robot: Object,
  },
  data() {
    return {
      robotName: '',
      robotIP: '',
      username: '',
      password: '',
      port: '',
    };
  },
  methods: {
    handleRobotFormSubmit() {
      const currentRobotList = this.robotList;
      if (!this.editState) {
        const sortedRobotList = currentRobotList.sort((a, b) => a.id - b.id);
        const robotNextId = sortedRobotList[currentRobotList.length - 1].id + 1;
        const form = {
          id: robotNextId,
          robotName: this.robotName,
          ip: this.robotIP,
          username: this.username,
          password: this.password,
          port: this.port,
        };
        currentRobotList.push(form);
      } else {
        currentRobotList.map(r => {
          if (r.id === this.robot.id) {
            r.robotName = this.robotName;
            r.ip = this.robotIP;
            r.username = this.username;
            r.password = this.password;
            r.port = this.port;
          }
          return r;
        });
      }
      this.$store.dispatch('updateRobotList', currentRobotList);
      this.$store.dispatch('updateCloseModal', true);
    },
    handleRemoveRobot() {
      const currentRobotList = this.robotList;
      const index = currentRobotList.findIndex(r => r.id === this.robot.id);
      currentRobotList.splice(index, 1);
      this.$store.dispatch('updateRobotList', currentRobotList);
      this.$store.dispatch('updateCloseModal', true);
    },
  },
  watch: {
    editState(val) {
      if (val) {
        this.robotName = this.robot.robotName;
        this.robotIP = this.robot.ip;
        this.username = this.robot.username;
        this.password = this.robot.password;
        this.port = this.robot.port;
      } else {
        this.robotName = '';
        this.robotIP = '';
        this.username = '';
        this.password = '';
        this.port = '';
      }
    },
  },
};
</script>

<style scoped>
.form-control:focus {
  outline: none !important;
  box-shadow: none;
}
.border-green {
  --tw-border-opacity: 1;
  border-color: rgba(16, 185, 129, var(--tw-border-opacity)) !important;
}
</style>
