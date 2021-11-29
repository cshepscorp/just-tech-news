const router = require('express').Router();
const { Post, User, Comment, Vote } = require('../models');
// special Sequelize functionality
const sequelize = require('../config/connection');

// render the homepage.handlebars template (the .handlebars extension is implied)
router.get('/', (req, res) => {
  console.log(req.session);
  
  Post.findAll({
    
    attributes: [
      'id',
      'post_url',
      'title',
      'created_at',
      [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
    ],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
    .then(dbPostData => {
      // loop over and map each Sequelize object into a serialized version of itself, saving the results in a new posts array
      const posts = dbPostData.map(post => post.get({ plain: true }));
      // pass a single post object into the homepage template
      res.render('homepage', { 
        posts, 
        loggedIn: req.session.loggedIn // tracks users session
        
      });

    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });

});

// render login
router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

router.get('/post/:id', (req, res) => {
  Post.findOne({
    where: {
        id: req.params.id
    },
    attributes: [
        'id', 
        'post_url', 
        'title', 
        'created_at',
        [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']],
    include: [
        {
            model: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            // also include the User model itself so it can attach the username to the comment
            include: {
                model: User,
                attributes: ['username']
            }
        },
        {
            model: User,
            attributes: ['username']
        }
    ]
  })
    .then(dbPostData => {
        if(!dbPostData) {
            // The 404 status code identifies a user error and will need a different request for a successful response.
            res.status(404).json({ message: 'No post with this id was found'});
            return;
        }

        // serialize the data
        const post = dbPostData.get({ plain: true });

        // pass data to template
        res.render('single-post', { 
          post,
          loggedIn: req.session.loggedIn
          // user will only see comments if logged in
        });
    })  
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;

/* Previously, we used res.send() or res.sendFile() for the response. Because we've hooked up a template engine, we can now use res.render() and specify which template we want to use. In this case, we want to render the homepage.handlebars template (the .handlebars extension is implied).
Handlebars.js will automatically feed that into the main.handlebars template, however, and respond with a complete HTML file*/