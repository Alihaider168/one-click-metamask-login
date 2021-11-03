import axios from "axios";

const serverApi = process.env.REACT_APP_SERVER_API;
const apiContext = process.env.REACT_APP_API_CONTEXT;
const getNonceService = process.env.REACT_APP_GET_NONCE_SERVICE;
const loginService = process.env.REACT_APP_LOGIN_SERVICE;
const logoutService = process.env.REACT_APP_LOGOUT_SERVICE;

const getNonce = async (data) => {
  console.log(`data ==== ${data}`)
  return await axios.post(`http://localhost:3001/api/v1/getNonce`, data);
};

const login = async (data) => {
  return await axios.post(`http://localhost:3001/api/v1/login`, data);
};

const logout = async (data) => {
  return await axios.post(`http://localhost:3001/api/v1/logout`, data);
};

export { getNonce, login, logout };
