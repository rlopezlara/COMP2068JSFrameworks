const mongoose = require("mongoose");

const dataSchemaObject = {
  country: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  visitDate: {
    type: Date,
  },
  stars: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "To do",
  },
};

const mongooseSchema = mongoose.Schema(dataSchemaObject);

module.exports = mongoose.model("Project", mongooseSchema);
