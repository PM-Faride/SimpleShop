const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { validationResult } = require("express-validator");

const Crypto = require("crypto");

const User = require("../models/user");

const mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sfaridedehghan@gmail.com",
    pass: "jwlykmmauokizdoa",
  },
});

exports.getLogin = (req, res, next) => {
  //db-related  errors
  const loginErrs = req.flash("login err");
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    loginErr: loginErrs[0],
  });
};

exports.postLogin = (req, res, next) => {
  User.findOne({
    $or: [{ username: req.body.username }, { email: req.body.username }],
  })
    .then((user) => {
      if (user) {
        if (user.accessLevels.includes("viewUsers"))
          req.session.viewUsers = true;
        return bcrypt
          .compare(req.body.password, user.password)
          .then((doesMatch) => {
            if (doesMatch) {
              req.session.user = user;
              return res.redirect("/home");
            } else {
              req.flash("login err", "Invalid username/email or password");
              return res.redirect("/login");
            }
          })
          .catch((err) => {
            return next(err);
          });
      }
      req.flash("login err", "Invalid username/email or password");
      return res.redirect("/login");
    })
    .catch((err) => {
      return next(err);
    });
};

exports.getForgetPassword = (req, res, next) => {
  const err = req.flash("error");
  res.render("auth/forgotPassword", {
    pageTitle: "Forgot Password",
    path: "/forgotPassword",
    validationErrs: [],
    email: null,
    error: err[0],
  });
};

exports.postForgetPassword = (req, res, next) => {
  const validationErrs = validationResult(req);
  if (!validationErrs.isEmpty()) {
    return res.status(422).render("auth/forgotPassword", {
      pageTitle: "Forgot Password",
      path: "/forgotPassword",
      validationErrs: validationErrs.array(),
      email: req.body.email,
      error: null,
    });
  }
  const email = req.body.email;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "There is no user for the given email");
        return res.redirect("/forgotPassword");
      }
      Crypto.randomBytes(32, (err, buffer) => {
        if (err) {
          return res.redirect("/forgotPassword");
        }
        const token = buffer.toString("hex");
        user.resetPasswordToken = token;
        user.resetPassExpiration = Date.now() + 3600000;
        return user
          .save()
          .then((user) => {
            res.redirect("/mailSent");
            return mailTransporter.sendMail({
              from: "sfaridedehghan@gmail.com",
              to: email,
              subject: "Reset Password",
              html: `
          <h3>Reset Password</h3>
          <p>We send you na link that you can reset your 369 shopify password with that. If that is sth you didnt request for simply ignore the email</p>
          <a href="http://localhost:3000/resetPass/${token}">Reset Password</a>`,
            });
          })
          .catch((err) => {
            return next(err);
          });
      });
    })
    .catch((err) => {
      return next(err);
    });
};

exports.getResetPass = (req, res, next) => {
  const token = req.params.token;
  User.findOne({
    resetPasswordToken: token,
    resetPassExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user) {
        req.flash("error", "The Reset Password Email is expired");
        return res.redirect("/forgotPassword");
      }
      res.render("auth/resetPass", {
        pageTitle: "Reset Password",
        path: "/resetPass",
        userId: user._id.toString(),
        token: token,
        validationErrs: [],
        password: null,
        confirmPass: null,
        passErr: null,
        confirmPassErr: null,
      });
    })
    .catch((err) => {
      return next(err);
    });
};

exports.postResetPass = (req, res, next) => {
  const token = req.body.token;
  const userId = req.body.userId;
  const password = req.body.password;
  const confirmPass = req.body.confirmPass;
  let resetUser;

  const validationErrs = validationResult(req);
  let passwordValidationErr;
  let confirmPassValdiationErr;
  if (!validationErrs.isEmpty()) {
    passwordValidationErr = validationErrs
      .array()
      .find((err) => err.param === "password");
    confirmPassValdiationErr = validationErrs
      .array()
      .find((err) => err.param === "confirmPass");
  }

  if (!validationErrs.isEmpty()) {
    return res.render("auth/resetPass", {
      pageTitle: "Reset Password",
      path: "/resetPass",
      userId: userId,
      token: token,
      passErr: passwordValidationErr,
      confirmPassErr: confirmPassValdiationErr,
      password: password,
      confirmPass: confirmPass,
    });
  }

  User.findOne({
    resetPasswordToken: token,
    resetPassExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      if (!user) {
        req.flash("error", "Reset Passsword Email expired");
        return res.redirect("/forgotPassword");
      }
      user.resetPassExpiration = undefined;
      user.resetPasswordToken = undefined;
      resetUser = user;
      return bcrypt.genSalt(12);
    })
    .then((salt) => {
      return bcrypt.hash(password, salt);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      return resetUser.save();
    })
    .then((user) => {
      res.redirect("/login");
    })
    .catch((err) => {
      return next(err);
    });
};

exports.getMailSent = (req, res, next) => {
  res.render("auth/mailSent", { pageTitle: "Inform", path: "/mailSent" });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/login");
  });
};
