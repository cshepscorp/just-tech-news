const router = require('express').Router();
const { User, Post, Vote, Comment } = require('../../models');

// GET /api/users
router.get('/', (req, res) => {
    // Access our User model and run .findAll() method)
    // one of the Model class's methods
    // .findAll() is equiv of `SELECT * FROM users;`
    User.findAll({
        attributes: { exclude: ['password'] }
      })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// GET /api/users/1
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id // like `SELECT * FROM users WHERE id = 1`
        },
        include: [
            {
                model: Post, // this is for posts they've created
                attributes: ['id', 'title', 'post_url', 'created_at']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                // including the Post model on the Comment model so we can see on which posts this user commented.
                include: {
                    model: Post,
                    attributes: ['title']
                }

            },
            {
                model: Post, // this is for posts they've voted on
                attributes: ['title'],
                through: Vote,
                as: 'voted_posts'
            }
        ]
    })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
});

// POST /api/users
router.post('/', (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
    // Pass in key/value pairs where the keys are what we defined in the User model and the values are what we get from req.body
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// This route will be found at http://localhost:3001/api/users/login in the browser.
router.post('/login', (req, res) => {
    // A GET method carries the request parameter appended in the URL string, whereas a POST method carries the request parameter in req.body, which makes it a more secure way of transferring data from the client to the server
    // expects {email: 'lernantino@gmail.com', password: 'password1234'}
    User.findOne({
        // We queried the User table using the findOne() method for the email entered by the user and assigned it to req.body.email.
        where: {
            email: req.body.email 
        }
    }).then(dbUserData => {
        if (!dbUserData) {
            res.status(400).json({ message: 'No user with that email address!' });
            return;
        }

        // res.json({ user: dbUserData });

        // verify the user's identity by matching the password from the user and the hashed password in the database
        //  the instance method was called on the user retrieved from the database, dbUserData
        const validPassword = dbUserData.checkPassword(req.body.password);

        // // Because the instance method returns a Boolean, we can use it in a conditional statement to verify whether the user has been verified or no
        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect password!' });
            return;
          }
          
          res.json({ user: dbUserData, message: 'You are now logged in!' });

  });  
});

// PUT /api/users/1
router.put('/:id', (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}

    // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData[0]) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// DELETE /api/users/1
router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
          id: req.params.id
        }
      })
      .then(dbUserData => {
        if (!dbUserData[0]) {
            res.status(404).json({ message: 'User successfully deleted' });
            return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
            console.log(err);
            res.status(500).json(err);
      });      
});

module.exports = router;
