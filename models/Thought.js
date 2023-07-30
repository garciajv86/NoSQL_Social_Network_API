const { Schema, model } = require("mongoose");
const reactionSchema = require("./Reaction");
const formatDate = require("./utils/dateFormat.js");

//* Thought Schema blueprint
const thoughtSchema = new Schema({
  thoughtText: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 280,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  //* username field representing the user who created the thought
  username: {
    type: String,
    required: true,
  },
  //* These reactions are like replies
  reactions: [reactionSchema],
});

//* Getter method to format the timestamp on query
thoughtSchema.virtual("formattedCreatedAt").get(function () {
  return formatDate(this.createdAt);
});

//* Virtual that retrieves the length of the thought's reaction array field on query.
thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

const Thought = model("Thought", thoughtSchema);

module.exports = Thought;
