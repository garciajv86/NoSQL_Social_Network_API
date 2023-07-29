const router = require("express").Router();
const {
  getThoughts,
  createThought,
  updateThought,
  getSingleThought,
  deleteThought,
  addReaction,
  removeReaction,
} = require("../../controllers/thoughtController");

//* /api/thoughts
router.route("/").get(getThoughts).post(createThought);

//* /api/thoughts/:thoughtId
router.route("/:thoughtId").get(getSingleThought).delete(deleteThought);

//* /api/thoughts/:thoughtId/reactions
router.route("/:thoughtId/reactions").post(addReaction);

//* /api/thoughts/:thoughtId/reactions/:reactionId
router.route("/:thoughtId/reactions/:reactionId").delete(removeReaction);

//* /api/thoughts/:thoughtId
router.route("/:thoughtId").put(updateThought);

module.exports = router;
