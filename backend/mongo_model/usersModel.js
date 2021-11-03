const moongose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const usersSchema = require("../mongo_schema/userSchema");

const userModel = moongose.model("User", usersSchema);

const insertNewUser = async (address) => {
  const nonce = generateNonce();
  const user = await userModel.create({ address, nonce });
  if (user) {
    return nonce;
  } else {
    return user;
  }
};

const userExists = async (address) => {
  let nonce = "";
  const user = await userModel.findOne({ address });
  console.log("User found: ", user);
  if (user) {
    nonce = await updateNonce(user.address);
  } else {
    nonce = await insertNewUser(address);
  }
  return nonce;
};

const updateNonce = async (address) => {
  const filter = { address };
  const nonce = generateNonce();
  const update = { nonce, dataUpdate: Date.now() };
  await userModel.findOneAndUpdate(filter, update);
  console.log("nonce updated:", nonce);
  return nonce;
};

const getAddressFromNonce = async (nonce) => {
  const filter = { nonce };
  const { address } = await userModel.findOne(filter);
  console.log("Address from nonce %s is %s", nonce, address);
  return address;
};

const updateStatus = async (address, type) => {
  const filter = { address };
  const update = { userConnected: type, dataUpdate: Date.now() };
  await userModel.findOneAndUpdate(filter, update);
};

const generateNonce = () => uuidv4();

module.exports = { userExists, getAddressFromNonce, updateStatus };
