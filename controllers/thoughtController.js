const { ObjectId } = require("mongoose").Types;
const { Thought, Reaction } = require("../models");

//* Aggregate function to get the number of thoughts overall
const thoughtCount = async () => {
  const numberOfThoughts = await Thought.aggregate().count("thoughtCount");
  return numberOfThoughts;
};

module.exports = {
  //* Get all thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find().populate('reactions');

      const thoughtObj = {
        thoughts,
        thoughtCount: await thoughtCount(),
      };

      res.json(thoughtObj);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  //* Get a single thought
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({
        _id: req.params.thoughtId,
      }).select("-__v");

      if (!thought) {
        return res.status(404).json({ message: "No thought with that ID" });
      }

      res.json({
        thought,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  //* create a new thought
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //* Update a thought
  async updateThought(req, res) {
    try {
      const thoughtId = req.params.thoughtId;
      const { thoughtText } = req.body;

      const thought = await Thought.findByIdAndUpdate(
        thoughtId,
        { thoughtText },
        { new: true, runValidators: true }
      );

      if (!thought) {
        return res.status(404).json({ message: "Thought not found" });
      }

      return res.json({ message: "Thought updated successfully", thought });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //* Delete a thought and remove reactions
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndRemove({
        _id: req.params.thoughtId,
      });

      if (!thought) {
        return res.status(404).json({ message: "No such thought" });
      }

      res.json({ message: "Thought successfully deleted" });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  //* Add a reaction to a thought
  async addReaction(req, res) {
    console.log("You are adding a Reaction!");
    console.log(req.body);

    try {
      const { reactionBody, username } = req.body;
      const thoughtId = req.params.thoughtId;

      //* Find the thought by its ID
      const thought = await Thought.findById(thoughtId);

      if (!thought) {
        return res.status(404).json({ message: "Thought not found" });
      }

      //* Create the new reaction and add it to the reactions array
      thought.reactions.push({ reactionBody, username });
      await thought.save();

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //* Remove reaction from a thought
  async removeReaction(req, res) {
    try {
      const thoughtId = req.params.thoughtId;
      const reactionId = req.params.reactionId;

      //* Find the thought by its ID
      const thought = await Thought.findById(thoughtId);

      if (!thought) {
        return res.status(404).json({ message: "Thought not found" });
      }

      //* Find the index of the reaction with the given reactionId
      const reactionIndex = thought.reactions.findIndex(
        (reaction) => reaction.reactionId.toString() === reactionId
      );

      if (reactionIndex === -1) {
        return res.status(404).json({ message: "Reaction not found" });
      }

      //* Remove the reaction from the reactions array
      thought.reactions.splice(reactionIndex, 1);
      await thought.save();

      res.json({ message: "Thought successfully deleted!", thought });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
