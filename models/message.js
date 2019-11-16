var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    _id: {
        type: mongoose.Schema.ObjectID,
        required: true,
        unique: true
    },
    content: {
        type: String,
        required: true
    },
    type: { // Text, sticker, image.
        type: String,
        required: true
    },
    conversationID: {
        type: mongoose.Schema.ObjectID,
        ref: "Conversation"
    },
    sender: {
        type: mongoose.Schema.ObjectID,
        ref: "User"
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now()
    }
}, {
    versionKey: false
});

module.exports = mongoose.model("Message", messageSchema);
