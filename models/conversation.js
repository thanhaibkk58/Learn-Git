var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var conversationSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    type: {
        type: String, // "private" or "group",
        required: true
    },
    name: {
        type: String,
        required: true,
        default: "No Name"
    },
    participants: {
        type: [Schema.Types.ObjectId],
        required: true,
        default: []
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
});


module.exports = mongoose.model("Conversation", conversationSchema);
