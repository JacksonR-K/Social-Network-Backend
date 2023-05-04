const router = require('express').Router();
const {
  getThoughts,
  getSingleThought,
  addThought,
  updateThought,
  deleteThought,
  addReaction,
  deleteReaction,
} = require('../../controllers/thoughtController');

// /api/thoughts
router.route('/')
    .get(getThoughts)
    .post(addThought);

// /api/thoughts/:thoughtId
router.route('/:thoughtId')
    .get(getSingleThought)
    .put(updateThought)
    .delete(deleteThought)

// /api/thoughts/:thoughtId/reactions
router.route('/:thoughtId/reactions')
    .post(addReaction)

// /api/thoughts/:thoughtId/reactions
router.route('/:thoughtId/reactions/:reactionId')
    .delete(deleteReaction);

module.exports = router;
