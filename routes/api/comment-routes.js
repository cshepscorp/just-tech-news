const router = require('express').Router();
/* included User bc In a query to the post table, we would like to retrieve not only information about each post, but also the user that posted it. With the foreign key, user_id, we can form a JOIN, an essential characteristic of the relational data model*/
const { Comment } = require('../../models');

router.get('/', (req, res) => {
    Comment.findAll()
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.post('/', (req, res) => {
    Comment.create({
        comment_text: req.body.comment_text,
        user_id: req.body.user_id,
        post_id: req.body.post_id
    })
    .then(dbCommentData => res.json(dbCommentData))
    .catch(err => {
        res.status(400).json(err);
    });
});

router.delete('/:id', (req, res) => {
    Comment.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbCommentData => {
        if(!dbCommentData) {
            // The 404 status code identifies a user error and will need a different request for a successful response.
            res.status(404).json({ message: 'No comment with this id was found'});
            return;
    }
    res.json(dbCommentData);
    })  
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;