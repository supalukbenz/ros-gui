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
    rosbridgeURL: JSON.parse(localStorage.getItem('rosbridgeURL')) || '',
    robotList: JSON.parse(localStorage.getItem('robotList')) || [],
    robotConnected: JSON.parse(localStorage.getItem('robotConnected')) || [],
    topicList: JSON.parse(localStorage.getItem('topicList')) || { topics: [], types: [] },
    msgList: JSON.parse(localStorage.getItem('msgList')) || {},
    data: { selection: [], source: [], expanded: [] },
    selectedTopic: [],
  },
  getters: {
    getRobotList: state => {
      return state.robotList;
    },
    getRobotConnected: state => {
      return state.robotConnected;
    },
    getSortedTopicData: state => {
      const sortedList = state.data.source.sort((a, b) =>
        a.label > b.label ? 1 : b.label > a.label ? -1 : 0
      );
      return sortedList;
    },
    getCloseModal: state => {
      return state.closeModal;
    },
    getRosbridgeURL: state => {
      return state.rosbridgeURL;
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
    getSelectedTopic: state => {
      return state.selectedTopic;
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
      localStorage.setItem('robotConnected', JSON.stringify(payload));
    },
    setCloseModal(state, payload) {
      state.closeModal = payload;
    },
    setTopicList(state, payload) {
      state.topicList = payload;
      localStorage.setItem('topicList', JSON.stringify(payload));
    },
    setMsgList(state, payload) {
      state.msgList = payload;
      localStorage.setItem('msgList', JSON.stringify(payload));
    },
    setDataTopic(state, payload) {
      state.data = payload;
    },
    setSelectedTopic(state, payload) {
      state.selectedTopic = payload;
    },
    setRosbridgeURL(state, payload) {
      state.rosbridgeURL = payload;
      localStorage.setItem('rosbridgeURL', JSON.stringify(payload));
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
    updateRosbridgeURL({ commit }, payload) {
      commit('setRosbridgeURL', payload);
    },
    updateSelectedTopic({ commit }, payload) {
      commit('setSelectedTopic', payload);
    },
  },
  modules: {},
});
