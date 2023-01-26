const config = require('config');
const bodyParser = require('body-parser');
const express = require('express');
const { authHandler, errorHandler } = require('./middleware');
const { propertyDetailsController } = require('./controllers');

// Gather Configs.
const application = config.get('application');
const port = application.get('port');

// App Setup.
const app = express();
app.use(bodyParser.json());

// Apply Error Middleware.
app.use(errorHandler);

// Protected Routes.
app.get('/property', authHandler, propertyDetailsController.getPropertyDetails);

// Start the Express Server.
app.listen(port, () => console.info(`Application Running on Port: ${port}.`));

module.exports = app;
