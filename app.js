const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const path = require("path");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const connectDB = require("./config/db");

const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");


process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config();

require("./config/passport")(passport);

connectDB();

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//Session
app.use(
  session({
    secret: "ERP-system",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
  })
);

//Passwort Middleware
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  if (!req.user) return next();
  if (1) {
    req.session.isAdmin = false;
    req.session.save();
  } else req.session.isAdmin = false;
  next();
});

app.use(async (req, res, next) => {
  const date = new Date().getDate();
  const hrs = new Date().getHours();
  if (date === 1 && hrs === 1) {
    const allUsers = await UserModel.find({}).exec();
    allUsers.map((user) => {
      user.requestsPerMonth = 0;
      user.save();
    });
  }
  next();
});

const PORT = process.env.PORT || 3000;

// app.use(express.static(path.join(__dirname, "public")));

app.use("/", authRouter);
app.use("/error", (req, res, next) => res.render);
app.use("/user", userRouter);


app.listen(PORT, console.log(`Server running at ${PORT}`));

process.on("unhandledRejection", (err) => {
  // unhandled promise rejection
  console.log("UNHANDLED REJECTION");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
