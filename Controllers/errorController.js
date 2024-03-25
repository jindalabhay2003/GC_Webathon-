const AppError = require(`${__dirname}/../utils/appError`);

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.keyValue.name;
  const message = `Duplicate Fields value: "${value}." Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, req, res) => {
  console.error("ERROR", err);
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong",
    message: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).render("error", {
      title: "Something went wrong",
      message: err.message,
    });
  }

  console.error("ERROR", err);

  return res.status(err.statusCode).render("error", {
    title: "Something went wrong",
    message: "Please try again later.",
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500; //internal server error
  err.status = err.status || "error"; // status -> fail
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;

    if (error.name === "CastError") {
      error = handleCastErrorDB(error);
    }
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error._message === "Validation failed")
      error = handleValidationErrorDB(error);
    sendErrorProd(error, req, res);
  }
};
