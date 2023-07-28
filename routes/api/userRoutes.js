const router = require("express").Router();
const {
  getUsers,
  getSingleUser,
  createUser,
  deleteUser,
  updateUser,
  addFriend,
  removeFriend,
} = require("../../controllers/userController.js");

//* /api/users
router.route("/").get(getUsers).post(createUser);

//* /api/users/:userId
router.route("/:userId").get(getSingleUser).put(updateUser).delete(deleteUser);

//* /api/users/:userId/addFriend/:friendId (New Route for Adding Friend)
router.post("/:userId/addFriend/friends/:friendId", addFriend);

//* /api/users/:userId/removeFriend/:friendId
router.delete("/:userId/removeFriend/friends/:friendId", removeFriend);

module.exports = router;
