const express = require("express");
const { body: validator } = require("express-validator");

const authController = require("../controllers/auth");

const router = express.Router();

const passwordRequirements = {
  minLength: 8,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
};

//Login
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);

//Reset Password => send reset mail
router.get("/forgotPassword", authController.getForgetPassword);
router.post(
  "/forgotPassword",
  validator("email").trim().isEmail().withMessage("Enter a valid email"),
  authController.postForgetPassword
);

//Reset Password
router.get("/resetPass/:token", authController.getResetPass);
router.post(
  "/resetPass",
  [
    validator(
      "password",
      "Password should be at least 8 characters with at least one number, lowercase, uppercase, symbol"
    ).isStrongPassword(passwordRequirements),
    validator("confirmPass").custom((value, { req }) => {
      if (value !== req.body.password)
        throw new Error("The confirm password does not match");
      return true;
    }),
  ],
  authController.postResetPass
);

router.get("/mailSent", authController.getMailSent);

router.post("/logout", authController.postLogout);

module.exports = router;
