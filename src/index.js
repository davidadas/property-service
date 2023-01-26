const config = require('config');
const bodyParser = require('body-parser');
const express = require('express');
const { validate, Joi } = require('express-validation');
const { authHandler, errorHandler } = require('./middleware');
const { propertyDetailsController } = require('./controllers');

// Gather Configs.
const application = config.get('application');
const port = application.get('port');

// App Setup.
const app = express();
app.use(bodyParser.json());

// Protected Routes.
const propertySchema = {
  query: Joi.object({
    address: Joi.string().min(3),
    zipcode: [Joi.string(), Joi.number()],
  }),
};

app.get('/property', validate(propertySchema, {}, {}), authHandler, propertyDetailsController.getPropertyDetails);

// Apply Error Middleware.
app.use(errorHandler);

// Start the Express Server.
app.listen(port, () => console.info(`Application Running on Port: ${port}.`));

module.exports = app;
