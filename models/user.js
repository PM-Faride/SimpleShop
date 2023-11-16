const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  accessLevels: [
    {
      type: String,
      required: true,
    },
  ],
  position: {
    type: String,
    required: true,
  }, //semat
  userImg: String,
  resetPasswordToken: String,
  resetPassExpiration: Date,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
