const User = require('./User');
const Post = require('./Post');
const Vote = require('./Vote');

/* A user can make many posts. But a post only belongs to a single user, and never many users. By this relationship definition, we know we have a one-to-many relationship.*/
// create associations
/* This association creates the reference for the id column in the User model to link to the corresponding foreign key pair, which is the user_id in the Post model.*/
User.hasMany(Post, {
    foreignKey: 'user_id'
});

/* defining the relationship of the Post model to the User. The constraint we impose here is that a post can belong to one user, but not many users. Again, we declare the link to the foreign key, designated at user_id in the Post model */
Post.belongsTo(User, {
    foreignKey: 'user_id'
});

/* With these two .belongsToMany() methods in place, we're allowing both the User and Post models to query each other's information in the context of a vote. If we want to see which users voted on a single post, we can now do that. If we want to see which posts a single user voted on, we can see that too. This makes the data more robust and gives us more capabilities for visualizing this data on the client-side. */
User.belongsToMany(Post, {
    through: Vote,
    as: 'voted_posts', // renames the column header to make more readable
    foreignKey: 'user_id'
});
/* Furthermore, the Vote table needs a row of data to be a unique pairing so that it knows which data to pull in when queried on. So because the user_id and post_id pairings must be unique, we're protected from the possibility of a single user voting on one post multiple times. 
This layer of protection is called a foreign key constraint*/
Post.belongsToMany(User, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'post_id'
});

/* By also creating one-to-many associations directly between these models, we can perform aggregated SQL functions between models. In this case, we'll see a total count of votes for a single post when queried. This would be difficult if we hadn't directly associated the Vote model with the other two. */

Vote.belongsTo(User, {
    foreignKey: 'user_id'
});

Vote.belongsTo(Post, {
    foreignKey: 'post_id'
});

Vote.hasMany(Vote, {
    foreignKey: 'user_id'
});

Vote.hasMany(Vote, {
    foreignKey: 'post_id'
});

module.exports = { User, Post, Vote };