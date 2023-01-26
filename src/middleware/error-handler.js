/**
 * Middleware for catching otherwise uncaught errors.
 * Obviously, we will hope this goes unneeded.
 */
const errorHandler = (error, req, res, next) => {
  if (error.status) {
    res.status(error.status).send({ message: error.message });
  } else {
    res.status(500).send({
      message: error,
    });
    next(error);
  }
};

module.exports = errorHandler;
