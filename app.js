var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var apiv1Router = require("./routes/apiv1/items");

var app = express();

//conect to db
require("./database/connectMongoose");


// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/apiv1", apiv1Router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.locals.error = req.app.get("env") === "development" ? err : {};

  const msg = err.message;
  err.message = [msg];

  if (err.errors) {
    res.status(err.status || 422);
    err.status ? err.status = err.status : err.status = 422;
    const messageError = err.array().map(item => {
      return item.msg;
    });
    err.message = messageError;
  }

  if (isAPIRequest(req)) {
    if (err.errors) {
      const errors = err.array();
      res.status = err.status;

      const messagesErrors = errors.map(item => {
        return { param: item.param, error: item.msg };
      });

      res.json({ errors: messagesErrors });
      return;
    } else {
      res.status(err.status || 404);
      res.json({ errors: err });
    }
  }

  // render the error page
  res.render("error");
});

function isAPIRequest(req) {
  return req.originalUrl.startsWith("/apiv1");
}


module.exports = app;
