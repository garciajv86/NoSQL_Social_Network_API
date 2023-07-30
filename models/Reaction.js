const { Schema, Types } = require("mongoose");
const formatDate = require("../utils/dateFormat.js");

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
  return formatDate(this.createdAt);
});

module.exports = reactionSchema;
