const express = require('express');
const routes = require('./controllers');
const app = express();
const PORT = process.env.PORT || 3001;
// importing the connection to Sequelize from config/connection.js
const sequelize = require('./config/connection'); 

// to reference css and html stuff
const path = require('path');

// handlebars
const exphbs = require('express-handlebars');
const helpers = require('./utils/helpers');
const hbs = exphbs.create({ helpers });

// session cookie related stuff
const session = require('express-session');

const SequelizeStore = require('connect-session-sequelize')(session.Store);

// This code sets up an Express.js session and connects the session to our Sequelize database.
const sess = {
  secret: 'lolawall',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// to reference stylesheets and html stuff
// express.static() method is a built-in Express.js middleware function that can take all of the contents of a folder and serve them as static assets
app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// turn on routes
app.use(routes);

// turn on connection to db and server
// establish the connection to the database
/* The "sync" part means that this is Sequelize taking the models and connecting them to associated database tables. If it doesn't find a table, it'll create it for you */
// force: false... doesn't have to be included, but if it were set to true, it would drop and re-create all of the database tables on startup - SIMILAR TO: DROP TABLE IF EXISTS
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
  });