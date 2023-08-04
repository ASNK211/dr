const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv")
const cors = require("cors");
const session = require('express-session');
const cookie = require('cookie-session')
const passport  = require("passport");
var cron = require('node-cron');
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const orderRoute = require("./routes/order");

const ReOrder = require("./models/Reoder");
const theautoserial = require("./models/theautoserial");
const Card = require("./models/Cards");

const acountsRoute = require("./routes/accounts");
const serialRoute = require("./routes/serial");
const intproduct = require("./routes/intproduct");
const googleAuth = require("./routes/googleAuth");
const wallet = require("./routes/wallet")
const getway = require("./routes/getway")
const getcard = require("./routes/getcard")
const autoserial = require("./routes/theautoserial")
const competiton = require("./routes/competition")
// const{ autoserial } = require("./routes/theautoserial")
const MongoStore = require("connect-mongo");
const path = require("path");
const history = require('connect-history-api-fallback');
require('./passport');

app.use(express.json());
const port = process.env.PORT || 8800;
dotenv.config();
app.use(express.static('uploads'));
app.use(express.static('upload'));

app.use(
  cors({
       origin: "http://localhost:8080", // allow to server to accept request from different origin
       methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
       credentials: true, // allow session cookie from browser to pass through
 })
);

// app.use(
//   cors({
//        origin: "*", // allow to server to accept request from different origin
//        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//        credentials: true, // allow session cookie from browser to pass through
//  })
// );
app.use(session({
  secret: "sdfghjkl",
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())



mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URL)
.then(() =>console.log('connected!'))
.catch((e) =>console.error('faild'+ e));

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/orders", orderRoute);
app.use("/api/accounts", acountsRoute);
app.use("/api/serials", serialRoute);
app.use("/api/intproducts", intproduct);
app.use("/api/wallet", wallet);
app.use("/api", googleAuth);
app.use("/api/getway", getway);
app.use("/api/card", getcard);
app.use("/api/autoserial", autoserial);
app.use("/api/competiton", competiton);



app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})

