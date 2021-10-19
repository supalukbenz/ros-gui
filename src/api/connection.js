import axios from 'axios';

async function connectToRobot(form) {
  const response = await axios.post('connect', form);
  const resInfo = {
    status: response.status,
    data: response.data,
  };
  return resInfo;
}

async function disconnectToRobot(form) {
  const response = await axios.post('disconnect', form);
  const resInfo = {
    status: response.status,
    data: response.data,
  };
  return resInfo;
}

async function runCommand(form) {
  const response = await axios.post('command', form);
  const resInfo = {
    status: response.status,
    data: response.data,
  };
  return resInfo;
}

export { connectToRobot, disconnectToRobot, runCommand };
