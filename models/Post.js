/* This Model class is what we create our own models from using the extends keyword so User inherits all of the functionality the Model class has.*/
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create our Post model
class Post extends Model {
    /* Here, we're using JavaScript's built-in static keyword to indicate that the upvote method is one that's based on the Post model and not an instance method like we used earlier with the User model 
    we can now execute Post.upvote() as if it were one of Sequelize's other built-in methods. */
    static upvote(body, models) {
        // pass in the value of req.body (as body) and an object of the models (as models) as parameters
        return models.Vote.create({
            user_id: body.user_id,
            post_id: body.post_id
        }).then(() => {
            return Post.findOne({
                where: {
                    id: body.post_id
                },
                attributes: [
                    'id',
                    'post_url',
                    'title',
                    'created_at',
                    [
                        sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
                        'vote_count'
                    ]
                ]
            });
        });

    }
}

// create fields/columns for Post model
Post.init(
    { // defining the schema
        id: { 
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        post_url: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isURL: true
            }
        },
        user_id: {
            // Using the references property, we establish the relationship between this post and the user by creating a reference to the User model, specifically to the id column that is defined by the key property, which is the primary key. 
            type: DataTypes.INTEGER,
            // The user_id is conversely defined as the foreign key and will be the matching link.
            references: {
                model: 'user',
                key: 'id'
            }
        }
    },
    { // configure the metadata
        sequelize,
        freezeTableName: true,
        underscored: true, // In Sequelize, columns are camelcase by default.
        modelName: 'post'
    }
);

module.exports = Post;
// Before we can use the Post model, we need to require it in models/index.js and export it there