const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    required: true,
    type: String,
    minLength: 3,
  },
  media: {
    mainImgUrl: { type: String, required: true },
    imgAlbum: [String],
    video: String,
  },
  createdDate: Date.now(),
  rate: [{ rateOption: String, cumulativeRate: Number }],
  noInStock: {
    type: Number,
    required: true,
    min: 0,
  },
  category: String, //mishe badan godt required has, id bedam?
  type: String, //jaye kar dare sare entekhab op nemayesh features \
  features: [
    {
      groupTitle: String, //age nage mishe سایر
      properties: [
        {
          name: { type: String, required: true },
          value: { type: String, required: true },
        },
      ],
    },
  ],
  price: {
    currency: {
      type: String,
      default: "$",
    },
    cost: {
      required: true,
      type: Number,
    },
    discount: {
      amount: Number,
      startDate: Date,
      endDate: Date,
    },
  },
  relatedProducts: [
    {
      _id: Schema.Types.ObjectId, // karbar miyad name mide ma serach miokonim id miyabim mizarim
      ref: "Product",
    },
  ],
  similarProducts: [
    {
      _id: Schema.Types.ObjectId, // karbar miyad name mide ma serach miokonim id miyabim mizarim
      ref: "Product",
    },
  ],
  comments: [
    {
      //az unjayi k tu neveshtane comment meqdare ina zaruriye nemidunam comment ye sheye joda bashe ya na + ya user lk login ha dg ina por beshe + vali in mishe khode site yani man bayad hardo ro bezanam chejuri mishe?????
      _id: Schema.Types.ObjectId,
      username: String,
      message: String,
    },
  ],
  questionAndAnswer: [
    {
      question: {
        _id: Schema.Types.ObjectId,
        username: String,
        message: String,
      },
      answer: {
        _id: Schema.Types.ObjectId,
        username: String,
        message: String,
      },
    },
  ],
  active: { default: active, type: Boolean },
  advantages: [String],
  disadvantages: [String],
  introduction: String, //url page etelaat k editor ina dare => yani neshun k mide editor ina ha k man e admin vared konam save k mishe un file k man maqadir dadam zakhire shode dar server url un umade vbe surate html ham zakhire shode
  tags: [String],
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
