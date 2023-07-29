const { Schema, Types } = require("mongoose");

//* Reaction Schema blueprint(Schema Only)
const reactionSchema = new Schema({
  reactionId: {
    type: Schema.Types.ObjectId,
    default: () => new Types.ObjectId(),
  },
  reactionBody: {
    type: String,
    required: true,
    maxlength: 280,
  },
  username: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//* Getter method to format the timestamp on query
reactionSchema.virtual("formattedCreatedAt").get(function () {
  //? Do I format the timestamp to a string //?
  return this.createdAt.toLocaleString(); //? Do I use a different date formatting method here //?
});

module.exports = reactionSchema;
