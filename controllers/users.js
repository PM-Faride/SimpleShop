const Crypto = require("crypto");

const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const User = require("../models/user");

const mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sfaridedehghan@gmail.com",
    pass: "jwlykmmauokizdoa",
  },
});

let userId;

exports.getAddUser = (req, res, next) => {
  res.render("users/edit-user", {
    pageTitle: "Define User",
    path: "/users",
    input: {
      firstName: null,
      lastName: null,
      username: null,
      password: null,
      email: null,
      position: null,
    },
    validationErrs: {},
    backLink: "/users",
    editUserAction: "Sign Up",
  });
};

exports.postAddUser = (req, res, next) => {
  let validationErrs = validationResult(req);
  let user;
  const body = req.body;
  //off bashe nemiyare
  const accessLevels = [];
  for (const key in body) {
    if (body[key] === "on") accessLevels.push(key);
  }
  //alan juriye k age yeki dg ham meqdare on behesh bedam be onvane accesslevel miyare

  if (accessLevels.length === 0)
    validationErrs.array().push({
      param: "accessLevels",
      msg: "A user should at least have one access",
    });

  const { firstName, lastName, email, username, password, position } = body; //tasavi do password tu mw anjam shode
  //const imageFile = body.file;

  if (!validationErrs.isEmpty()) {
    const valdiationErrsObj = {};
    validationErrs = validationErrs.array();
    for (let i = 0; i < validationErrs.length; i++) {
      const err = validationErrs[i];
      if (err.param in valdiationErrsObj) {
        continue;
      }
      valdiationErrsObj[err.param] = err.msg;
    }
    return res.render("users/edit-user", {
      pageTitle: "Define User",
      path: "/users",
      input: {
        firstName: firstName,
        lastName: lastName,
        username: username,
        password: password,
        email: email,
        position: position,
      },
      validationErrs: valdiationErrsObj,
      backLink: "/users",
      editUserAction: "Add User",
    });
  }
  User.findOne({ $or: [{ username: username, email: email }] })
    .then((dbUser) => {
      if (dbUser) {
        const errs = {};
        if (dbUser.username === username) {
          errs.username = "There is a registered user with this username";
        }
        if (dbUser.email === email) {
          errs.email = "This email is already registered";
        }
        return res.render("users/edit-user", {
          pageTitle: "Define User",
          path: "/users",
          input: {
            firstName: firstName,
            lastName: lastName,
            username: username,
            password: password,
            email: email,
            position: position,
          },
          backLink: "users",
          validationErrs: errs,
          editUserAction: "Sign Up",
        });
      } else {
        bcrypt
          .genSalt(12)
          .then((salt) => {
            return bcrypt.hash(password, salt);
          })
          .then((hashedPassword) => {
            user = new User({
              firstName: firstName,
              lastName: lastName,
              email: email,
              username: username,
              password: hashedPassword,
              position: position,
              accessLevels: accessLevels,
            });
            return user.save();
          })
          .then((user) => {
            res.redirect("/users");
            return mailTransporter.sendMail({
              from: "sfaridedehghan@gmail.com",
              to: email,
              subject: "Membership Acknowledgement",
              html: `
            <h1>Congratulations</h1>
            <p>${req.session.user.firstName} ${req.session.user.lastName} added you to the shopify team
            your username is: ${username}
            and to get your password please connect to ${req.session.user.email}
            </p>
            `,
            });
          })
          .catch((err) => {
            return next(err);
          });
      }
    })
    .catch((err) => {
      return next(err);
    });
};

exports.getUsers = (req, res, next) => {
  const userId = req.user._id;
  User.find({ _id: { $ne: userId } })
    .then((users) => {
      res.render("users/users", {
        pageTitle: "Users",
        path: "/users",
        users: users,
        backLink: "",
      });
    })
    .catch((err) => {
      return next(err);
    });
};

exports.getEditUser = (req, res, next) => {
  userId = req.params.id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(422).render("users/edit-user", {
          path: "/users/edit-user",
          pageTitle: "Edit User",
          backLink: "/users",
          input: {},
          editUserAction: "Edit User",
        });
      }
      user.password = null;
      return res.render("users/edit-user", {
        path: "/users/edit-user",
        pageTitle: "Edit User",
        backLink: "/users",
        input: user,
        validationErrs: {},
        editUserAction: "Edit user",
      });
    })
    .catch((err) => {
      return next(err);
    });
};

exports.postEditUser = (req, res, next) => {
  let validationErrs = validationResult(req);
  const body = req.body;
  //off bashe nemiyare
  const accessLevels = [];
  for (const key in body) {
    if (body[key] === "on") accessLevels.push(key);
  }
  //alan juriye k age yeki dg ham meqdare on behesh bedam be onvane accesslevel miyare

  if (accessLevels.length === 0)
    validationErrs.array().push({
      param: "accessLevels",
      msg: "A user should at least have one access",
    });

  const { firstName, lastName, email, username, password, position } = body; //tasavi do password tu mw anjam shode

  if (!validationErrs.isEmpty()) {
    const valdiationErrsObj = {};
    validationErrs = validationErrs.array();
    for (let i = 0; i < validationErrs.length; i++) {
      const err = validationErrs[i];
      if (err.param in valdiationErrsObj) {
        continue;
      }
      valdiationErrsObj[err.param] = err.msg;
    }
    return res.render("users/edit-user", {
      pageTitle: "Define User",
      path: "/users",
      input: {
        firstName: firstName,
        lastName: lastName,
        username: username,
        password: password,
        email: email,
        position: position,
      },
      validationErrs: valdiationErrsObj,
      backLink: "/users",
      editUserAction: "Edit User",
    });
  }
  User.findOne({
    $or: [{ username: username, email: email }],
    _id: { $ne: userId },
  })
    .then((dbUser) => {
      if (dbUser) {
        const errs = {};
        if (dbUser.username === username) {
          errs.username = "There is a registered user with this username";
        }
        if (dbUser.email === email) {
          errs.email = "This email is already registered";
        }
        return res.render("users/edit-user", {
          pageTitle: "Define User",
          path: "/users",
          input: {
            firstName: firstName,
            lastName: lastName,
            username: username,
            password: password,
            email: email,
            position: position,
          },
          validationErrs: errs,
          backLink: "/users",
          editUserAction: "Edit User",
        });
      } else {
        bcrypt
          .genSalt(12)
          .then((salt) => {
            return bcrypt.hash(password, salt);
          })
          .then((hashedPassword) => {
            User.findOne({ _id: userId })
              .then((user) => {
                if (user) {
                  user.firstName = firstName;
                  user.lastName = lastName;
                  user.email = email;
                  user.username = username;
                  user.password = hashedPassword;
                  user.position = position;
                  user.accessLevels = accessLevels;
                  return user.save();
                } else {
                  throw err;
                }
              })
              .then((user) => {
                console.log(req.session.viewUsers);
                res.redirect("/users");
                return mailTransporter.sendMail({
                  from: "sfaridedehghan@gmail.com",
                  to: email,
                  subject: "User Info Update",
                  html: `
              <h1>Profile Updated</h1>
              <p>${req.session.user.firstName} ${req.session.user.lastName} has modified your information
              please contact ${req.session.user.email} for more information
              </p>
              `,
                });
              })
              .catch((err) => {
                return next(err);
              });
          })
          .catch((err) => {
            return next(err);
          });
      }
    })
    .catch((err) => {
      return next(err);
    });
};

// exports.getUsers = (req, res, next) => {
//   User.find()
//     .then((users) => {
//       res.render("users/users", {
//         pageTitle: "Users",
//         path: "/users",
//         users: users,
//         backLink: "",
//       });
//     })
//     .catch((err) => {
//       return next(err);
//     });
// };

exports.deleteUser = (req, res, next) => {
  const userId = req.params.id;

  User.findByIdAndDelete(userId).then((user) => {
    if (!user) throw new Error("There no user with the given id");
    return res.redirect("/users");
  });
};
