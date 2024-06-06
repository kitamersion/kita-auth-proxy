var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var swaggerJsDoc = require('swagger-jsdoc');
var swaggerUi = require('swagger-ui-express');
require('dotenv').config();
var cors = require('cors');

var healthRouter = require('./api/health');
var indexRouter = require('./api/home');
var oauthRouter = require('./api/mal/oauth');

var app = express();

var corsOptions = {
  origin: function (origin, callback) {
    if (origin.startsWith('moz-extension://') || origin === 'https://myanimelist.net' || origin === 'https://api.myanimelist.net') {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

var swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Kitamersion Auth Proxy',
      version: '1.0.0',
      description: 'API Documentation for Kitamersion Auth Proxy',
    },
    servers: [`http://localhost:${process.env.PORT || 3000}`],
  },
  apis: [path.join(__dirname, './api/**/*.js')]
};

var swaggerDocs = swaggerJsDoc(swaggerOptions);
const disableSwaggerBanner = '.swagger-ui .topbar { display: none }';
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, { customCss: disableSwaggerBanner }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/', indexRouter);
app.use('/health', healthRouter);
app.use('/mal/oauth', oauthRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log(`App listening on port http://localhost:${port}`);
});

module.exports = app;