<template>
  <div class="relative">
    <Loading v-if="loadingState"></Loading>
    <div class="fixed w-full">
      <!-- <StatusCard :responseMessage="responseMessage" :errorState="errorState"></StatusCard> -->
      <div
        v-if="responseMessage !== ''"
        :class="[
          errorState ? 'bg-red-300' : 'bg-green-300',
          responseMessage !== '' ? 'transformLeft' : 'fadeInOut',
        ]"
        id="responseCard"
        class="
          responseCard
          py-3
          text-left
          rounded-tl-full rounded-bl-full
          px-4
          max-w-3xl
          absolute
          right-0
          opacity-90
          font-semibold
          z-10
          whitespace-pre-line
        "
        ref="resCard"
      >
        <!-- <div class="absolute top-0 left-0">x</div> -->
        {{ responseMessage }}
      </div>
    </div>
    <div class="px-14 py-6 flex justify-center max-w-screen-xl mx-auto">
      <div class="flex flex-col table-w">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div class="flex justify-end text-md mb-4 font-semibold w-100">
            <div
              class="
                cursor-pointer
                text-center
                tracking-wider
                uppercase
                text-sm
                shadow
                bg-yellow-btn
                text-white
                px-3
                py-1
                rounded-full
                w-fit
              "
              data-toggle="modal"
              data-target="#modal"
              @click="addRobotButton()"
            >
              + Add robot
            </div>
          </div>
          <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg mb-20">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    class="
                      px-6
                      py-3
                      text-left text-xs
                      font-medium
                      text-gray-500
                      uppercase
                      tracking-wider
                      w-1/2
                    "
                  >
                    Robot
                  </th>
                  <!-- <th
                    scope="col"
                    class="
                      px-6
                      py-3
                      text-left text-xs
                      font-medium
                      text-gray-500
                      uppercase
                      tracking-wider
                      w-1/4
                    "
                  >
                    Status
                  </th> -->
                  <th scope="col" class="relative w-1/4"></th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr class="text-left" v-for="(robot, index) in robotList" :key="index">
                  <td class="px-6 py-4">
                    <div class="flex flex-col">
                      <div class="font-medium text-gray-900">{{ robot.robotName }}</div>
                      <div class="text-xs text-gray-500">{{ robot.ip }}:{{ robot.port }}</div>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-right text-sm font-medium">
                    <div class="flex justify-between items-center">
                      <a
                        href=""
                        @click="clickedEditRobot(robot)"
                        data-toggle="modal"
                        data-target="#modal"
                        class="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        <i class="fas fa-edit"></i>
                      </a>
                      <!-- <button class="border mr-2" @click="clickedSimulation(robot)">
                        simulate
                      </button> -->
                      <button
                        v-if="robot.id !== robotConnected.id"
                        @click="handleRobotConnection(robot)"
                        class="p-2 w-24 text-white rounded font-bold bg-purple-btn"
                      >
                        Connect
                      </button>
                      <button
                        v-else
                        @click="handleRobotDisconnect()"
                        class="p-2 w-24 bg-red-500 text-white rounded font-bold hover:bg-red-700"
                      >
                        Disconnect
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade z-200" id="modal" role="dialog">
      <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title ml-6" id="exampleModalLongTitle">
              {{ editState ? 'Edit Robot' : 'Add Robot' }}
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <RobotFormModal :editState="editState" :robot="robotEditSelected"></RobotFormModal>
            <!-- <RobotFormModal v-else :editState="editState"></RobotFormModal> -->
          </div>
          <div class="modal-footer"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { connectToRobot, disconnectToRobot, runCommand } from '@/api/connection';
import ROSLIB from 'roslib';
import RobotFormModal from '@/components/robotConnection/RobotFormModal.vue';
import Loading from '@/components/main/Loading.vue';
// import StatusCard from '@/components/main/StatusCard.vue';
import $ from 'jquery';

export default {
  computed: {
    ...mapGetters({
      robotList: 'getRobotList',
      rosState: 'getROS',
      rosbridgeURL: 'getRosbridgeURL',
      robotConnected: 'getRobotConnected',
      closeModal: 'getCloseModal',
      msgList: 'getMsgList',
      topicList: 'getTopicList',
      selectedButtonList: 'getSelectedButtonList',
    }),
  },
  components: {
    RobotFormModal,
    Loading,
    // StatusCard,
  },
  mounted() {
    this.responseMessage = '';
    this.editState = false;
    if (this.rosState) {
      // const currentRobot = this.robotConnected;
      this.connect(this.rosbridgeURL);
    }
    if (this.ros && !this.ros.isConnected) {
      this.disconnect();
    }
  },
  data() {
    return {
      ros: null,
      connected: false,
      loadingState: false,
      message: null,
      status: null,
      topics: null,
      msg: null,
      connectionState: false,
      responseMessage: '',
      connectionMessage: '',
      errorState: false,
      robotEditSelected: null,
      editState: false,
    };
  },
  methods: {
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    addRobotButton() {
      this.editState = false;
      this.robotEditSelected = null;
    },
    clickedEditRobot(robot) {
      this.editState = true;
      this.robotEditSelected = robot;
    },
    async getMsgROSInfo(msgName) {
      const msgDetails = new ROSLIB.Service({
        ros: this.ros,
        name: '/rosapi/message_details',
        serviceType: 'rosapi/MessageDetails',
      });
      const req = new ROSLIB.ServiceRequest({
        type: msgName,
      });
      msgDetails.callService(req, result => {
        let currentMsgList = this.msgList;
        result.typedefs.forEach(data => {
          currentMsgList[data.type] = data;
        });
        const parsedObj = JSON.parse(JSON.stringify(currentMsgList));
        this.$store.dispatch('updateMsgList', parsedObj);
        this.msg = parsedObj;
      });
    },
    setTopicList() {
      this.ros.getTopics(topic => {
        topic.types.forEach(async msgName => {
          if (msgName in this.msgList === false) {
            await this.getMsgROSInfo(msgName);
          }
        });
        this.$store.dispatch('updateTopicList', topic);
        this.topics = topic;
      });
    },
    async connect(ws_address) {
      if (this.ros) {
        this.ros.close(); // Close old connection
        this.ros = null;
        return;
      }
      if (ws_address !== '') {
        this.ros = await new ROSLIB.Ros({
          // url: `ws://${ws_address}:9090`,
          url: ws_address,
        });

        this.ros.on('connection', () => {
          this.connected = true;
          this.errorState = false;
          this.$store.dispatch('updateWSAddress', ws_address);
          this.$store.dispatch('updateROS', this.ros);
          // this.setTopicList();
        });

        this.ros.on('error', () => {
          this.responseMessage = 'Error connecting to websocket server';
          this.errorState = true;
          this.disconnect();
        });

        this.ros.on('close', () => {
          this.connected = false;
          this.disconnect();
        });
      } else {
        this.disconnect();
      }
    },
    async clickedSimulation(robot) {
      this.loadingState = true;
      this.connectionState = true;
      this.$store.dispatch('updateRobotConnected', robot);
      const address = `ws://${robot.ip}:${robot.port}`;
      this.$store.dispatch('updateRosbridgeURL', address);
      // await this.connect(address);
      this.sleep(2000);
      // this.loadingState = false;
      // if (this.msg && this.topics) {
      this.$router.push({
        name: 'Graph',
        params: { robotName: robot.robotName },
      });
      // }
    },
    resetROSInfo() {
      let currentSelectedButton = this.selectedButtonList;
      currentSelectedButton.map(b => {
        b.clickState = false;
        return b;
      });
      this.$store.dispatch('updateSelectedButtonList', currentSelectedButton);
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
    },
    async disconnect() {
      const robotForm = this.robotConnected;
      this.resetROSInfo();
      await disconnectToRobot(robotForm);
    },

    async handleRobotDisconnect() {
      if (this.ros) {
        this.ros.close();
      }
      // this.responseMessage = '';
      this.disconnect();
    },
    async handleConnectionMessage() {
      await this.sleep(20000);
      this.responseMessage = '';
    },
    async handleRobotConnection(robot) {
      this.loadingState = true;
      this.connectionState = true;
      let response = {};
      try {
        let robotSelectedInfo = {
          username: robot.username,
          password: robot.password,
          ip: robot.ip,
          port: robot.port,
        };
        response = await connectToRobot(robotSelectedInfo);
        let responseCommandList = [];
        if (response.status === 200) {
          if (robot.commands.length > 0) {
            let index = 0;
            for (let command of robot.commands) {
              let screenName = `command${index}`;
              robotSelectedInfo.command = command;
              robotSelectedInfo.screen_name = screenName;
              const res = await runCommand(robotSelectedInfo);
              responseCommandList.push(res);
              index++;
            }
          }
          this.$store.dispatch('updateRobotConnected', robot);
          let ws_address = `ws://${robot.ip}:${robot.port}`;
          if (process.env.NODE_ENV === 'production') {
            console.log('production');
            ws_address = `wss://${robot.ip}:${robot.port}`;
          }
          this.$store.dispatch('updateRosbridgeURL', ws_address);
          await this.connect(ws_address);
          this.responseMessage = 'Connected to the robot.';
          this.$router.push({
            name: 'Graph',
            params: { robotName: robot.robotName },
          });
        }
      } catch (err) {
        this.errorState = true;
        if (err.response) {
          this.responseMessage = err.response.data;
        } else {
          this.responseMessage = 'Cannot connect to robot.';
        }
        // this.disconnect();
      }
      this.loadingState = false;
      this.handleConnectionMessage();
    },
  },
  watch: {
    closeModal(val) {
      if (val) {
        $('#modal').modal('hide');
        this.$store.dispatch('updateCloseModal', false);
      }
    },
  },
};
</script>

<style scoped>
/* .responseCard {
  transition: opacity 500ms ease 1000ms;
} */

.fadeInOut {
  -webkit-animation: fadeinout 4s linear forwards;
  animation: fadeinout 4s linear forwards;
}

@-webkit-keyframes fadeinout {
  0%,
  100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

@keyframes fadeinout {
  0%,
  100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

.transformLeft {
  animation: slide-in 0.5s forwards;
  -webkit-animation: slide-in 0.5s forwards;
}

@keyframes slide-in {
  0% {
    -webkit-transform: translateX(100%);
  }
  100% {
    -webkit-transform: translateX(0%);
  }
}
@-webkit-keyframes slide-in {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0%);
  }
}

.transformRight {
  animation: slide-out 0.5s forwards;
  -webkit-animation: slide-out 0.5s forwards;
}

@keyframes slide-out {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(20px);
  }
}
@-webkit-keyframes slide-out {
  0% {
    -webkit-transform: translateX(0%);
  }
  100% {
    -webkit-transform: translateX(20px);
  }
}

.table-w {
  width: 50rem !important;
}

@media screen and (max-width: 992px) {
  .modal-dialog {
    margin: 4rem;
    max-width: 100%;
  }
}
</style>
