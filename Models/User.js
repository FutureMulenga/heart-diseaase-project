const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  emailAddress:{
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("User", UserSchema);