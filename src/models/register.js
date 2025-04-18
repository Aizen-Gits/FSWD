const mongoose = require('mongoose');

const registerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  roll: { type: String, required: true },
  reg: { type: String, required: true },
  email: { type: String, required: true },
  event: { type: String, required: true },
});

const Register = mongoose.model('Register', registerSchema);

module.exports = Register;
