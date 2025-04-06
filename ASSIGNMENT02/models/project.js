const mongoose = require("mongoose");
// This is the schema for the project model. It defines the structure of the data that will be stored in the database.
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
    type: Number,
    required: true,
  },
  description: {
    type: String,
    default: "To do",
  },
  imageUrl: {
    type: String,
  },
};

const mongooseSchema = mongoose.Schema(dataSchemaObject);

module.exports = mongoose.model("Project", mongooseSchema);
