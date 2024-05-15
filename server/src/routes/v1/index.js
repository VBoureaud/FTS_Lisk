const config = require('../../config');
const express = require('express');
const homeRoute = require('./home.route');
const docsRoute = require('./docs.route');
const userRoute = require('./user.route');
const citiesRoute = require('./cities.route');
const metaDataRoute = require('./metaData.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/',
    route: homeRoute,
  }, {
    path: '/user',
    route: userRoute,
  }, {
    path: '/cities',
    route: citiesRoute,
  }, {
    path: '/metaData',
    route: metaDataRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
