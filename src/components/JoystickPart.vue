<template>
  <div class="w-full">
    <button
      type="button"
      class="
        border-2
        py-2
        w-40
        bg-gray-500
        border-gray-500
        hover:bg-white
        text-white
        hover:text-gray-500
        font-bold
      "
      @click="createJoystick()"
    >
      Joystick
    </button>
    <div class="mt-32 flex justify-center">
      <div id="joystick"></div>
    </div>
  </div>
</template>

<script>
import nipplejs from 'nipplejs';
import ROSLIB from 'roslib';

// import KEYBOARDTELEOP from 'keyboardteleopjs';
var KEYBOARDTELEOP = require('keyboardteleopjs');

export default {
  data() {
    return {
      manager: null,
      publish: true,
      linearX: 0,
      angularZ: 0,
      cmdVel: null,
      twist: null,
      teleop: null,
    };
  },
  props: {
    ros: Object,
  },
  methods: {
    moveAction(linear, angular) {
      console.log(linear);
      console.log(angular);
      if (this.twist) {
        if (linear !== undefined && angular !== undefined) {
          this.twist.linear.x = linear;
          this.twist.angular.z = angular;
        } else {
          this.twist.linear.x = 0;
          this.twist.angular.z = 0;
        }
        this.cmdVel.publish(this.twist);
      }
    },
    createJoystick() {
      if (this.ros !== null) {
        console.log('Joy');

        this.twist = new ROSLIB.Message({
          linear: {
            x: 0,
            y: 0,
            z: 0,
          },
          angular: {
            x: 0,
            y: 0,
            z: 0,
          },
        });
        this.cmdVel = new ROSLIB.Topic({
          ros: this.ros,
          name: '/cmd_vel',
          messageType: 'geometry_msgs/Twist',
        });
        //register publisher
        this.cmdVel.advertise();

        if (this.teleop == null) {
          // Initialize the teleop.
          this.teleop = new KEYBOARDTELEOP.Teleop({
            ros: this.ros,
            topic: '/cmd_vel',
          });
        }

        var options = {
          zone: document.getElementById('joystick'),
          mode: 'static',
          size: 200,
          color: '#0066ff',
          dynamicPage: true,
        };
        this.manager = nipplejs.create(options);
        this.manager.on('move', (evt, nipple) => {
          console.log('move');
          var direction = nipple.angle.degree - 90;
          if (direction > 180) {
            direction = -(450 - nipple.angle.degree);
          }

          var lin = Math.cos(direction / 57.29) * nipple.distance * 0.005;
          var ang = Math.sin(direction / 57.29) * nipple.distance * 0.05;

          if (this.publish) {
            this.publish = false;
            this.moveAction(lin, ang);
            setTimeout(function () {
              this.publish = true;
            }, 50);
          }
        });
        // event litener for joystick release, always send stop message
        // this.manager.on('end', () => {
        //   this.moveAction(0, 0);
        // });
      }
    },
  },
  mounted() {},
};
</script>
