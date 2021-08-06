import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

// function checkTypeObject(item) {
//   if (typeof item === 'object') {
//     return [];
//   }
// }

export default new Vuex.Store({
  state: {
    ws_address: '',
    ros: JSON.parse(localStorage.getItem('ros')) || null,
    closeModal: false,
    robotList: JSON.parse(localStorage.getItem('robotList')) || [],
    robots: [
      {
        id: 1,
        robotName: 'turtlebot',
        ip: '10.204.226.149',
        username: 'pi',
        password: 'turtlebot',
        port: '9090',
      },
      {
        id: 2,
        robotName: 'AVIS',
        ip: '10.204.162.48',
        username: 'benz',
        password: '',
        port: '9090',
      },
      {
        id: 3,
        robotName: 'AVIS2',
        ip: '10.204.162.48',
        username: 'benz',
        password: '',
        port: '9090',
      },
      {
        id: 4,
        robotName: 'AVIS3',
        ip: '10.204.162.48',
        username: 'benz',
        password: '',
        port: '9090',
      },
    ],
    robotConnected: {},
    topicList: { topics: [], types: [] },
    msgList: {},
    data: { selection: [], source: [], expanded: [] },
  },
  getters: {
    getRobotList: state => {
      return state.robotList;
    },
    getRobotConnected: state => {
      return state.robotConnected;
    },
    getCloseModal: state => {
      return state.closeModal;
    },
    getROS: state => {
      return state.ros;
    },
    getTopicList: state => {
      return state.topicList;
    },
    getMsgList: state => {
      return state.msgList;
    },
    getDataTopic: state => {
      return state.data;
    },
  },
  mutations: {
    setWSAddress(state, payload) {
      state.ws_address = payload;
    },
    setROS(state, payload) {
      state.ros = payload;
      localStorage.setItem('ros', JSON.stringify(payload));
    },
    setRobotList(state, payload) {
      state.robotList = payload;
      localStorage.setItem('robotList', JSON.stringify(payload));
    },
    setRobotConnected(state, payload) {
      state.robotConnected = payload;
    },
    setCloseModal(state, payload) {
      state.closeModal = payload;
    },
    setTopicList(state, payload) {
      state.topicList = payload;
    },
    setMsgList(state, payload) {
      state.msgList = payload;
    },
    setDataTopic(state, payload) {
      state.data = payload;
    },
  },
  actions: {
    updateWSAddress({ commit }, payload) {
      commit('setWSAddress', payload);
    },
    updateROS({ commit }, payload) {
      commit('setROS', payload);
    },
    updateRobotList({ commit }, payload) {
      commit('setRobotList', payload);
    },
    updateRobotConnected({ commit }, payload) {
      commit('setRobotConnected', payload);
    },
    updateCloseModal({ commit }, payload) {
      commit('setCloseModal', payload);
    },
    updateTopicList({ commit }, payload) {
      commit('setTopicList', payload);
    },
    updateMsgList({ commit }, payload) {
      commit('setMsgList', payload);
    },
    updateDataTopic({ commit }, payload) {
      commit('setDataTopic', payload);
    },
  },
  modules: {},
});
