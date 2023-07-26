const { Schema, model } = require("mongoose");

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
  //? How would I create this array of nested documents created with the reactionSchema //?
  reactions: [],
});

//* Getter method to format the timestamp on query
thoughtSchema.virtual("formattedCreatedAt").get(function () {
  //? Do I format the timestamp to a string //?
  return this.createdAt.toLocaleString(); //? Do I use a different date formatting method here //?
});

//* Virtual that retrieves the length of the thought's reaction array field on query.
thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

const Thought = model("thought", thoughtSchema);

module.exports = Thought;
