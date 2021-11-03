const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  address: { type: String, required: true, unique: true },
  nonce: { type: String },
  name: { type: String },
  dataInsert: { type: Date, default: Date.now() },
  dataUpdate: { type: Date },
  userConnected: { type: Boolean, default: false ,required:true},
});

module.exports = userSchema;
