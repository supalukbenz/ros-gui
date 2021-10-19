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
          :class="{
            'border-green': robot && editState ? robot.robotName !== robotName : '',
            'border-red': clickedState && robotName.trim() === '',
          }"
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
            :class="{
              'border-green': robot && editState ? robot.ip !== robotIP : '',
              'border-red': clickedState && robotIP.trim() === '',
            }"
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
              :class="{
                'border-green': robot && editState ? robot.port !== port : '',
                'border-red': clickedState && port.trim() === '',
              }"
            />
          </div>
        </div>
      </div>
      <div class="form-group">
        <div class="text-left font-semibold">Command</div>
        <div class="mb-4">
          <div v-if="commandList.length > 0">
            <div
              v-for="(c, index) in commandList"
              :key="index"
              class="text-left flex flex-row justify-between items-center border-b mb-1"
            >
              <div class="w-11/12 break-words text-sm">$ {{ c }}</div>
              <div @click="removeCommand(index)" class="text-red-500 text-sm cursor-pointer">
                <i class="fas fa-minus-circle"></i>
              </div>
            </div>
          </div>
          <div v-else class="text-left text-gray-400">[ No command. ]</div>
        </div>
        <div class="flex flex-row items-center">
          <input
            type="text"
            v-model="command"
            class="form-control outline-none"
            placeholder="roslaunch <package_name> <launch_file>"
          />
          <div
            class="text-green-500 hover:text-green-700 cursor-pointer w-10 text-xl flex justify-end"
            title="add command"
            @click="addCommand()"
          >
            <i class="fas fa-plus-circle"></i>
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
            :class="{
              'border-green': robot && editState ? robot.username !== username : '',
              'border-red': clickedState && username.trim() === '',
            }"
          />
        </div>
        <div class="form-group col-md-6">
          <div class="text-left font-semibold">Password</div>
          <input
            type="password"
            v-model="password"
            class="form-control"
            placeholder="***"
            :class="{ 'border-green': robot && editState ? robot.password !== password : '' }"
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
        class="bg-blue-custom text-white w-36 py-2 rounded-lg font-bold"
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
      closeModal: 'getCloseModal',
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
      command: '',
      commandList: [],
      clickedState: false,
    };
  },
  mounted() {
    this.clickedState = false;
    this.setEditInfo(this.editState);
  },
  methods: {
    handleRobotFormSubmit() {
      const currentRobotList = this.robotList;
      if (!this.checkInputEmpty()) {
        if (!this.editState) {
          let id = 1;
          if (currentRobotList.length > 0) {
            const sortedRobotList = currentRobotList.sort((a, b) => a.id - b.id);
            id = sortedRobotList[currentRobotList.length - 1].id + 1;
          }
          const form = {
            id: id,
            robotName: this.robotName,
            ip: this.robotIP,
            username: this.username,
            password: this.password,
            port: this.port,
            commands: this.commandList,
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
              r.commands = this.commandList;
            }
            return r;
          });
        }
        this.$store.dispatch('updateRobotList', currentRobotList);
        // this.setEmptyRobotForm();
        this.$store.dispatch('updateCloseModal', true);
      } else {
        this.clickedState = true;
      }
    },
    checkInputEmpty() {
      return (
        this.robotName.trim() === '' &&
        this.robotIP.trim() === '' &&
        this.username.trim() === '' &&
        this.port.trim() === ''
      );
    },
    handleRemoveRobot() {
      const currentRobotList = this.robotList;
      const index = currentRobotList.findIndex(r => r.id === this.robot.id);
      currentRobotList.splice(index, 1);
      this.$store.dispatch('updateRobotList', currentRobotList);
      this.$store.dispatch('updateCloseModal', true);
    },
    setEmptyRobotForm() {
      this.robotName = '';
      this.command = '';
      this.commandList = [];
      this.robotIP = '';
      this.username = '';
      this.password = '';
      this.port = '';
    },
    addCommand() {
      if (this.command.trim() !== '') {
        this.commandList.push(this.command);
        this.command = '';
      }
    },
    removeCommand(index) {
      this.commandList.splice(index, 1);
    },
    setEditInfo(state) {
      if (state) {
        this.robotName = this.robot.robotName;
        this.robotIP = this.robot.ip;
        this.username = this.robot.username;
        this.password = this.robot.password;
        this.port = this.robot.port;
        this.commandList = this.robot.commands;
      } else {
        this.setEmptyRobotForm();
      }
    },
  },
  watch: {
    editState(val) {
      this.setEditInfo(val);
    },
    robot(val) {
      if (val) {
        this.setEditInfo(true);
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

.bg-blue-custom {
  background: #3f13a6;
}

.bg-blue-custom:hover {
  background: #3f13a6;
}

.border-red {
  --tw-border-opacity: 1;
  border-color: rgba(248, 113, 113, var(--tw-border-opacity)) !important;
}
</style>
