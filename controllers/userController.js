const { User } = require("../models");

module.exports = {
  //* Get all users
  async getUsers(req, res) {
    try {
      const dbUserData = await User.find().populate("thoughts"); //* Populate the 'thoughts' field in the User model

      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  //* Get a user
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .populate("thoughts")
        .populate("friends");

      if (!user) {
        return res.status(404).json({ message: "No user with that ID" });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //* Create a user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  //* Delete a user
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId });

      if (!user) {
        res.status(404).json({ message: "No user with that ID" });
      }

      await User.deleteMany({ _id: { $in: user.thoughts || [] } });
      return res.json({ message: "User and thoughts deleted!" });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //* Update a user
  async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!user) {
        res.status(404).json({ message: "No user with this id!" });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //* Add a friend
  async addFriend(req, res) {
    try {
      const userId = req.params.userId;
      const friendId = req.params.friendId;

      //* Check if both the user and the friend exist in the database
      const user = await User.findById(userId);
      const friend = await User.findById(friendId);

      if (!user || !friend) {
        return res.status(404).json({ message: "User or friend not found" });
      }

      //* Check if the friend is already in the user's friend list
      if (user.friends.includes(friendId)) {
        return res.status(400).json({ message: "Friend is already added" });
      }

      //* Add the friend to the user's friend list
      user.friends.push(friendId);
      await user.save();

      //* Add the user to the friend's friend list
      friend.friends.push(userId);
      await friend.save();

      //* Return the updated user object with the new friend added
      res.json({
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          thoughts: user.thoughts,
        },
        friend: {
          _id: friend._id,
          username: friend.username,
        },
        message: "Friend added successfully",
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //* Remove a friend
  async removeFriend(req, res) {
    try {
      const userId = req.params.userId;
      const friendId = req.params.friendId;

      //* Check if both the user and the friend exist in the database
      const user = await User.findById(userId);
      const friend = await User.findById(friendId);

      if (!user || !friend) {
        return res.status(404).json({ message: "User or friend not found" });
      }

      //* Check if the friend is in the user's friend list
      const friendIndex = user.friends.indexOf(friendId);
      if (friendIndex === -1) {
        return res
          .status(400)
          .json({ message: "Friend not found in the user's friend list" });
      }

      //* Remove the friend from the user's friend list
      user.friends.splice(friendIndex, 1);
      await user.save();

      //* Remove the user from the friend's friend list
      const userIndex = friend.friends.indexOf(userId);
      if (userIndex !== -1) {
        friend.friends.splice(userIndex, 1);
        await friend.save();
      }

      //* Return the updated user object with the friend removed
      res.json({
        user: {
          _id: user._id,
          username: user.username,
        },
        friend: {
          _id: friend._id,
          username: friend.username,
        },
        message: "Friend removed successfully",
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
