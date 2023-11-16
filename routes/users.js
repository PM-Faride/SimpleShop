const express = require("express");
const { body: validator } = require("express-validator");

const canAccess = require("../middlewares/canAccess");
const userController = require("../controllers/users");

const router = express.Router();

const passwordRequirements = {
  minLength: 8,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
};

router.get("/add-user", canAccess.canAddUser, userController.getAddUser);
router.post(
  "/add-user",
  canAccess.canAddUser,
  [
    validator("firstName", "First name should only contain alphabets")
      .trim()
      .isString(),
    validator("lastName", "Last name should only have alphabets")
      .trim()
      .isString(),
    validator("email")
      .trim()
      .notEmpty()
      .withMessage("The email cannot be empty")
      .isEmail()
      .withMessage("Should be a valid email"),
    validator("username")
      .trim()
      .notEmpty()
      .withMessage("Username cannot be empty")
      .isAlphanumeric()
      .withMessage("Username should only use mnumbers and alphabets")
      .isLength({ min: 3, max: 25 })
      .withMessage("Username should be of 3 to 25 characters"),
    validator("password")
      .notEmpty()
      .withMessage("Password cannot be empty")
      .isStrongPassword(passwordRequirements)
      .withMessage(
        "Password should be at least 8 characters with at least one number, lowercase, uppercase, symbol"
      ),
    validator("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password)
        throw new Error("The confirm password does not match");
      return true;
    }),
    validator("position")
      .notEmpty()
      .withMessage("position cannot be empty")
      .isString()
      .withMessage("The position should only contains strings"),
  ],
  userController.postAddUser
);

router.get("/", canAccess.canViewUsers, userController.getUsers);

router.get("/edit-user/:id", canAccess.canEditUser, userController.getEditUser);
router.post(
  "/edit-user",
  canAccess.canAddUser,
  [
    validator("firstName", "First name should only contain alphabets")
      .trim()
      .isString(),
    validator("lastName", "Last name should only have alphabets")
      .trim()
      .isString(),
    validator("email")
      .trim()
      .notEmpty()
      .withMessage("The email cannot be empty")
      .isEmail()
      .withMessage("Should be a valid email"),
    validator("username")
      .trim()
      .notEmpty()
      .withMessage("Username cannot be empty")
      .isAlphanumeric()
      .withMessage("Username should only use mnumbers and alphabets")
      .isLength({ min: 3, max: 25 })
      .withMessage("Username should be of 3 to 25 characters"),
    validator("password")
      .notEmpty()
      .withMessage("Password cannot be empty")
      .isStrongPassword(passwordRequirements)
      .withMessage(
        "Password should be at least 8 characters with at least one number, lowercase, uppercase, symbol"
      ),
    validator("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password)
        throw new Error("The confirm password does not match");
      return true;
    }),
    validator("position")
      .notEmpty()
      .withMessage("position cannot be empty")
      .isString()
      .withMessage("The position should only contains strings"),
  ],
  userController.postEditUser
);

router.post(
  "/delete-user/:id",
  canAccess.canDeleteUser,
  userController.deleteUser
);

module.exports = router;
