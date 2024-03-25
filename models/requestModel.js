const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
  
});

const Request = mongoose.model("request", RequestSchema);
module.exports = Request;
