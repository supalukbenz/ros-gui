import axios from 'axios';

async function connectToRobot(form) {
  const response = await axios.post('connect', form);
  console.log('response', response);
  const resInfo = {
    status: response.status,
    data: response.data,
  };
  return resInfo;
}

async function disconnectToRobot(form) {
  console.log('form', form);
  const response = await axios.post('disconnect', form);
  console.log('response', response);
  const resInfo = {
    status: response.status,
    data: response.data,
  };
  return resInfo;
}

export { connectToRobot, disconnectToRobot };
