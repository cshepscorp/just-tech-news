const router = require('express').Router();

const apiRoutes = require('./api');
// what user will see
const homeRoutes = require('./home-routes.js');

// dashboard
const dashboardRoutes = require('./dashboard-routes.js');

router.use('/dashboard', dashboardRoutes);
/* Since we set up the routes the way we did, we don't have to worry about importing multiple files for different endpoints. The router instance in routes/index.js collected everything for us and packaged them up for server.js to use. */

// here we are collecting the packaged group of API endpoints and prefixing them with the path /api
router.use('/api', apiRoutes);
router.use('/', homeRoutes);

// second use of router.use in case we make a request to any endpoint that doesn't exist, we'll receive a 404 error indicating we have requested an incorrect resource, another RESTful API practice
router.use((req, res) => {
  res.status(404).end();
});

module.exports = router;