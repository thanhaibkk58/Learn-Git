var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    type: { // Text, sticker, image.
        type: String,
        required: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    receiver: { // conversationID or userID
        type: Schema.Types.ObjectId
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
