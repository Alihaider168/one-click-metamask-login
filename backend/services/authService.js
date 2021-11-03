const {
  userExists,
  getAddressFromNonce,
  updateStatus,
} = require("../mongo_model/usersModel");
const web3 = require("web3");
const ethUtil = require("eth-sig-util");
const messages = require("../messages");

const getNonce = async (address) => {
  let res = {};
  const isEthAddress = web3.utils.isAddress(address);
  if (isEthAddress) {
    const nonce = await userExists(address.toLowerCase());
    res.status = 200;
    res.nonce = nonce;
    res.welcomeMsg = messages.WELCOME_MSG;
  } else {
    res.status = 400;
    res.message = messages.ERROR_ADDRESS;
  }
  return res;
};

const verifySign = async (sig, nonce, msg) => {
  let res = {};
  const msgParams = {
    data: web3.utils.utf8ToHex(msg),
    sig,
  };
  const addressSigner = ethUtil.recoverPersonalSignature(msgParams);
  const address = await getAddressFromNonce(nonce);
  if (address.toLowerCase() === addressSigner.toLowerCase()) {
    await updateStatus(address,true);
    res.status = 200;
    res.message = messages.LOGIN_SUCCESS;
  } else {
    res.status = 400;
    res.message = messages.LOGIN_ERROR;
  }
  return res;
};


const logout = async address =>{
  let res = {}
  await updateStatus(address,false);
  console.log("logout ok")
  res.status=200;
  return res;
}

module.exports = { getNonce, verifySign,logout };
