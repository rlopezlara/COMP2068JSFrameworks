// regular mongoose model, enhanced with a plugin
const mongoose = require("mongoose");
//enhance this model with a plugin to enable: password encryption, strategy creation, deserializeUser, etc..
const plm = require("passport-local-mongoose");
const dataSchemaObject = {
  username: { type: String },
  password: { type: String },
  oauthId: { type: String },
  oauthProvider: { type: String },
  created: { type: Date, default: Date.now },
};

const mongooseSchema = mongoose.Schema(dataSchemaObject);
// Todo enhance the model with a plugin
// load the plugin into the mongoose schema before creating the model
mongooseSchema.plugin(plm);
// create and export the mongoose model
module.exports = mongoose.model("User", mongooseSchema);
