
/* This Model class is what we create our own models from using the extends keyword so User inherits all of the functionality the Model class has.*/
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

// create our User model
class User extends Model {
  // set up method to run on instance data (per user) to check password
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password); // Using the keyword this, we can access this user's properties, including the password, which was stored as a hashed string
  }
}

// define table columns and configuration
// initialize the model's data and configuration, passing in two objects as arguments.
User.init(
  {
    // define an id column
    // define the columns and data types for those columns
    id: {
      // use the special Sequelize DataTypes object provide what type of data it is
      type: DataTypes.INTEGER,
      // this is the equivalent of SQL's `NOT NULL` option
      allowNull: false,
      // instruct that this is the Primary Key
      primaryKey: true,
      // turn on auto increment
      autoIncrement: true
    },
    // define a username column
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // define an email column
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      // there cannot be any duplicate email values in this table
      unique: true,
      // if allowNull is set to false, we can run our data through validators before creating the table data
      validate: {
        isEmail: true // built-in validation
      }
    },
    // define a password column
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        // this means the password must be at least four characters long
        len: [4]
      }
    }
  },
  {
    // The nested level of the object inserted is very important. Notice that the hooks property was added to the second object in User.init()
    hooks: {
      // set up beforeCreate lifecycle "hook" functionality
      // The keyword pair, async/await, works in tandem to make this async function look more like a regular synchronous function expression
      async beforeCreate(newUserData) { // The async keyword is used as a prefix to the function that contains the asynchronous function
        // await can be used to prefix the async function, which will then gracefully assign the value from the response to the newUserData's password property
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        return newUserData; // newUserData is then returned to the application with the hashed password
      },
      // set up beforeUpdate lifecycle "hook" functionality
      async beforeUpdate(updatedUserData) {
        updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
        return updatedUserData;
      }
    },
    // TABLE CONFIGURATION OPTIONS GO HERE (https://sequelize.org/v5/manual/models-definition.html#configuration))
    // configures certain options for the table
    // pass in our imported sequelize connection (the direct connection to our database)
    sequelize,
        // don't automatically create createdAt/updatedAt timestamp fields
    timestamps: false,
        // don't pluralize name of database table
    freezeTableName: true,
        // use underscores instead of camel-casing (i.e. `comment_text` and not `commentText`)
    underscored: true,
        // make it so our model name stays lowercase in the database
    modelName: 'user'
    
  }
);

module.exports = User;