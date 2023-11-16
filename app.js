const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csurf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");

const User = require("./models/user");

const authRouter = require("./routes/auth");
const userRouter = require("./routes/users");

const MONGODB_URL =
  "mongodb+srv://faride:Faride@cluster0.5ea9n.mongodb.net/shopify";

// const fileStorage = multer.diskStorage({
//   filename: (req, file, cb) => {
//     cb(null, new Date().toISOString() + "-" + file.originalname);
//   },
//   destination: (req, file, cb) => {
//     cb(null, "images");
//   },
// });

// const fileFilter = (req, file, cb) => {
//   const acceptedType = file.mimetype.startsWith("image");
//   if (acceptedType) cb(null, true);
//   else cb(null, false);
// };

const sessionStorage = new MongoDBStore({
  uri: MONGODB_URL,
  collection: "sessions",
});

const app = express();

const csrf = csurf();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "image")));

app.use(bodyParser.urlencoded({ extended: false }));
// app.use(
// multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
// );

app.use(
  session({
    secret: "The 369 project version one and part of it",
    saveUninitialized: false,
    resave: false,
    store: sessionStorage,
  })
);

app.use(csrf);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) return next();
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
}); //session save user

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  /* SUPER IMPORTANT */
  console.log(req.session);
  res.locals.viewUsers = req.session.viewUsers; //in vase har dakhast seda mizane vase hamin vaqti man session meqdar bedam
  //daramesh
  next();
});

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.use("/", authRouter);
app.use("/users", userRouter);
app.get("/home", (req, res, next) => {
  res.render("index", { pageTitle: "Home", path: "/home", backLink: null });
});
app.use((req, res, next) => {
  return res.status(404).render("errors/404", {
    pageTitle: "404 Page",
    path: null,
    backLink: null,
  });
});
app.use((error, req, res, next) => {
  return res.status(500).render("errors/500", {
    errMsg: error.message,
    pageTitle: "Server Error",
    path: null,
    backLink: null,
  });
});
// app.use((req, res, next, error) => {
//   console.log(error);
// });

mongoose
  .connect(MONGODB_URL)
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    throw new Error(err);
  });
