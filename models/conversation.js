var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var conversationSchema = new Schema({
    name: {
        type: String,
        required: true,
        default: "No Name"
    },
    participants: [{
        type: Schema.Types.ObjectId,
        required: true,
        default: [],
        ref: "User"
    }],
    created_by: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
});


module.exports = mongoose.model("Conversation", conversationSchema);
