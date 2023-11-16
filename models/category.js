const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Category = new Schema({
  catName: { type: String, required: true, unique: true },
  parentCat: String,
});
