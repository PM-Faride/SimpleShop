const express = require("express");
const { body } = require("express-validator");
const productsController = require("../controllers/products");

const router = express.Router();

router.get(
  "/add-product",
  [
    body("name")
      .trim()
      .isString()
      .withMessage("The name should be of type of string")
      .isLength({ min: 3 })
      .withMessage("The length should be at least 3"),
    body("noInStock")
      .trim()
      .notEmpty()
      .withMessage("The number in stock can not be empty")
      .isNumeric()
      .withMessage("The number in stock field has to be a valid number")
      .isLength({ min: 0 })
      .withMessage("The least amount should be zero"),

    body("mainImgUrl")
      .trim()
      .notEmpty()
      .withMessage("You should upload a photo"),
    // body(""),
  ],
  productsController.postAddProduct
);
