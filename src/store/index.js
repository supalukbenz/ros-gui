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
    closeAddButtonModal: false,
    closeEditButtonModal: false,
    rosbridgeURL: JSON.parse(localStorage.getItem('rosbridgeURL')) || '',
    robotList: JSON.parse(localStorage.getItem('robotList')) || [],
    robotConnected: JSON.parse(localStorage.getItem('robotConnected')) || {},
    logMessage: [],
    topicList: { topics: [], types: [] },
    msgList: {},
    topicMsg: [],
    nodeList: [],
    paramList: [],
    nodeForm: [],
    variableList: [],
    buttonList: JSON.parse(localStorage.getItem('buttonList')) || [],
    selectedButtonList: JSON.parse(localStorage.getItem('selectedButtonList')) || [],
    data: {
      selection: [],
      source: [],
      expanded: [],
      arrayIndexTopic: [],
    },
    selectedTopic: [],
    selectedScatterTopic: [],
    scatterCloseModal: false,
    lineGraphCloseModal: false,
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
    getCloseAddButtonModal: state => {
      return state.closeAddButtonModal;
    },
    getCloseEditButtonModal: state => {
      return state.closeEditButtonModal;
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
    getTopicMsg: state => {
      return state.topicMsg;
    },
    getMsgList: state => {
      return state.msgList;
    },
    getNodeList: state => {
      return state.nodeList;
    },
    getNodeForm: state => {
      return state.nodeForm;
    },
    getVariableList: state => {
      return state.variableList;
    },
    getParamList: state => {
      return state.paramList;
    },
    getDataTopic: state => {
      return state.data;
    },
    getSelectedTopic: state => {
      return state.selectedTopic;
    },
    getButtonList: state => {
      return state.buttonList;
    },
    getSelectedButtonList: state => {
      return state.selectedButtonList;
    },
    getLogMessage: state => {
      return state.logMessage;
    },
    getSelectedScatterTopic: state => {
      return state.selectedScatterTopic;
    },
    getScatterCloseModal: state => {
      return state.scatterCloseModal;
    },
    getLineGraphCloseModal: state => {
      return state.lineGraphCloseModal;
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
    setCloseAddButtonModal(state, payload) {
      state.closeAddButtonModal = payload;
    },
    setCloseEditButtonModal(state, payload) {
      state.closeEditButtonModal = payload;
    },
    setTopicList(state, payload) {
      state.topicList = payload;
      // localStorage.setItem('topicList', JSON.stringify(payload));
    },
    setTopicMsg(state, payload) {
      state.topicMsg = payload;
      // localStorage.setItem('topicMsg', JSON.stringify(payload));
    },
    setMsgList(state, payload) {
      state.msgList = payload;
      // localStorage.setItem('msgList', JSON.stringify(payload));
    },
    setNodeList(state, payload) {
      state.nodeList = payload;
      // localStorage.setItem('nodeList', JSON.stringify(payload));
    },
    setNodeForm(state, payload) {
      state.nodeForm = payload;
    },
    setParamList(state, payload) {
      state.paramList = payload;
      localStorage.setItem('paramList', JSON.stringify(payload));
    },
    setButtonList(state, payload) {
      state.buttonList = payload;
      localStorage.setItem('buttonList', JSON.stringify(payload));
    },
    setSelectedButtonList(state, payload) {
      state.selectedButtonList = payload;
      localStorage.setItem('selectedButtonList', JSON.stringify(payload));
    },
    setDataTopic(state, payload) {
      state.data = payload;
      // localStorage.setItem('dataTopic', JSON.stringify(payload));
    },
    setSelectedTopic(state, payload) {
      state.selectedTopic = payload;
    },
    setRosbridgeURL(state, payload) {
      state.rosbridgeURL = payload;
      localStorage.setItem('rosbridgeURL', JSON.stringify(payload));
    },
    setVariableList(state, payload) {
      state.variableList = payload;
    },
    setLogMessage(state, payload) {
      state.logMessage = payload;
    },
    setSelectedScatterTopic(state, payload) {
      state.selectedScatterTopic = payload;
    },
    setScatterCloseModal(state, payload) {
      state.scatterCloseModal = payload;
    },
    setLineGraphCloseModal(state, payload) {
      state.lineGraphCloseModal = payload;
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
    updateCloseAddButtonModal({ commit }, payload) {
      commit('setCloseAddButtonModal', payload);
    },
    updateCloseEditButtonModal({ commit }, payload) {
      commit('setCloseEditButtonModal', payload);
    },
    updateTopicList({ commit }, payload) {
      commit('setTopicList', payload);
    },
    updateTopicMsg({ commit }, payload) {
      commit('setTopicMsg', payload);
    },
    updateMsgList({ commit }, payload) {
      commit('setMsgList', payload);
    },
    updateNodeList({ commit }, payload) {
      commit('setNodeList', payload);
    },
    updateNodeForm({ commit }, payload) {
      commit('setNodeForm', payload);
    },
    updateParamList({ commit }, payload) {
      commit('setParamList', payload);
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
    updateButtonList({ commit }, payload) {
      commit('setButtonList', payload);
    },
    updateSelectedButtonList({ commit }, payload) {
      commit('setSelectedButtonList', payload);
    },
    updateVariableList({ commit }, payload) {
      commit('setVariableList', payload);
    },
    updateLogMessage({ commit }, payload) {
      commit('setLogMessage', payload);
    },
    updateSelectedScatterTopic({ commit }, payload) {
      commit('setSelectedScatterTopic', payload);
    },
    updateScatterCloseModal({ commit }, payload) {
      commit('setScatterCloseModal', payload);
    },
    updateLineGraphCloseModal({ commit }, payload) {
      commit('setLineGraphCloseModal', payload);
    },
  },
  modules: {},
});
