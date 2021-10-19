<template>
  <div>
    <div class="flex">
      <div class="mr-2">
        <div class="flex justify-start flex-col text-left">
          <div class="font-bold">ROSbridge websocket address</div>
          <div>{{ rosbridgeURL }}</div>
        </div>
        <!-- <div class="mt-10 flex justify-start">
          <button
            @click="connect"
            v-if="!connected"
            type="button"
            class="
              border-2
              py-2
              w-40
              bg-blue-500
              border-blue-500
              hover:bg-white
              text-white
              hover:text-blue-500
              font-bold
              mr-4
            "
          >
            Connect
          </button>
          <button
            v-else
            @click="disconnect"
            class="
              border-2
              py-2
              w-28
              bg-red-500
              border-red-500
              hover:bg-white
              text-white
              hover:text-red-500
              font-bold
            "
            type="button"
          >
            Disconnect
          </button>
        </div> -->
      </div>
      <!-- <div class="border w-1/2 bg-gray-100 p-4 text-left ml-4">
        <div>
          <span class="text-xl">Status: </span>
          <span v-if="connected" class="font-bold text-xl">Connected</span>
          <span v-else class="font-bold text-xl">Not connected</span>
        </div>
      </div> -->
    </div>
    <div v-if="connected" class="m-20 h-64 grid grid-rows-3 grid-cols-3 gap-4">
      <div></div>
      <div class="flex justify-center items-center">
        <button
          class="
            border-2
            py-2
            w-28
            bg-gray-500
            border-gray-500
            hover:bg-white
            text-white
            hover:text-gray-500
            font-bold
          "
          type="button"
          @click="forward()"
        >
          Forward
        </button>
      </div>
      <div></div>
      <div class="flex justify-center items-center">
        <button
          class="
            border-2
            py-2
            w-28
            bg-gray-500
            border-gray-500
            hover:bg-white
            text-white
            hover:text-gray-500
            font-bold
          "
          type="button"
          @click="turnLeft()"
        >
          Left
        </button>
      </div>
      <div class="flex justify-center items-center">
        <button
          class="
            border-2
            py-2
            w-28
            bg-red-500
            border-red-500
            hover:bg-white
            text-white
            hover:text-red-500
            font-bold
          "
          type="button"
          @click="stop()"
        >
          Stop
        </button>
      </div>
      <div class="flex justify-center items-center">
        <button
          class="
            border-2
            py-2
            w-28
            bg-gray-500
            border-gray-500
            hover:bg-white
            text-white
            hover:text-gray-500
            font-bold
          "
          type="button"
          @click="turnRight()"
        >
          Right
        </button>
      </div>
      <div></div>
      <div class="flex justify-center items-center">
        <button
          class="
            border-2
            py-2
            w-28
            bg-gray-500
            border-gray-500
            hover:bg-white
            text-white
            hover:text-gray-500
            font-bold
          "
          type="button"
          @click="backward()"
        >
          Backward
        </button>
      </div>
    </div>
    <!-- <div class="mt-20" v-show="ros">
      <JoystickPart :ros="ros"></JoystickPart>
    </div> -->
    <!-- <div>
      <button
        type="button"
        @click="handleTopic"
        class="
          border-2
          py-2
          w-28
          bg-green-300
          border-green-300
          hover:bg-white
          text-white
          hover:text-green-300
          font-bold
        "
      >
        Topic
      </button>
    </div> -->
  </div>
</template>

<script>
import ROSLIB from 'roslib';
import { mapGetters } from 'vuex';
// import JoystickPart from '@/components/JoystickPart.vue';

export default {
  components: {
    // JoystickPart,
  },
  data() {
    return {
      ws_address: '',
      connected: false,
      topic: null,
      message: null,
    };
  },
  computed: {
    ...mapGetters({
      ros: 'getROS',
      rosbridgeURL: 'getRosbridgeURL',
    }),
  },
  async mounted() {
    await this.updateRosConnection();
    this.connected = true;
  },
  methods: {
    async connect() {
      if (this.rosbridgeURL !== '') {
        await this.updateRosConnection();
        //   this.ros = new ROSLIB.Ros({
        //     // url: `ws://${this.ws_address}:9090`,
        //     url: this.ws_address,
        //   });
        //   this.ros.on('connection', () => {
        //     this.connected = true;
        //     this.$store.dispatch('updateWSAddress', this.ws_address);
        //     this.$store.dispatch('updateROS', this.ros);
        //     this.handleTopic();
        //   });

        //   this.ros.on('error', error => {
        //     console.log('Error connecting to websocket server: ', error);
        //   });
        //   this.ros.on('close', () => {
        //     this.connected = false;
        //     console.log('Connection to websocket server closed.');
        //   });
      }
    },
    disconnect() {
      this.ros.close();
    },
    async setTopic() {
      await this.updateRosConnection();
      this.topic = new ROSLIB.Topic({
        ros: this.ros,
        name: '/cmd_vel',
        messageType: 'geometry_msgs/Twist',
      });
    },
    forward() {
      this.message = new ROSLIB.Message({
        linear: { x: 1, y: 0, z: 0 },
        angular: { x: 0, y: 0, z: 0 },
      });
      this.setTopic();
      this.topic.publish(this.message);
    },
    stop() {
      this.message = new ROSLIB.Message({
        linear: { x: 0, y: 0, z: 0 },
        angular: { x: 0, y: 0, z: 0 },
      });
      this.setTopic();
      this.topic.publish(this.message);
    },
    backward() {
      this.message = new ROSLIB.Message({
        linear: { x: -1, y: 0, z: 0 },
        angular: { x: 0, y: 0, z: 0 },
      });
      this.setTopic();
      this.topic.publish(this.message);
    },
    turnLeft() {
      this.message = new ROSLIB.Message({
        linear: { x: 0.5, y: 0, z: 0 },
        angular: { x: 0, y: 0, z: 0.5 },
      });
      this.setTopic();
      this.topic.publish(this.message);
    },
    turnRight() {
      this.message = new ROSLIB.Message({
        linear: { x: 0.5, y: 0, z: 0 },
        angular: { x: 0, y: 0, z: -0.5 },
      });
      this.setTopic();
      this.topic.publish(this.message);
    },
    updateRosConnection() {
      // if (!this.ros.isConnected) {
      this.ros.connect(this.rosbridgeURL);
    },
    async handleTopic() {
      await this.updateRosConnection();
      let cmdVel = new ROSLIB.Topic({
        ros: this.ros,
        name: '/cmd_vel',
        messageType: 'geometry_msgs/Twist',
      });
      let twist = new ROSLIB.Message({
        linear: {
          x: 0.5,
          y: 0.0,
          z: 0.0,
        },
        angular: {
          x: 0.0,
          y: 0.0,
          z: 0.0,
        },
      });
      cmdVel.publish(twist);
    },
  },
};
</script>
