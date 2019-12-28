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
    avatar_url: {
        type: String,
        default: "https://localhop-prod.s3.amazonaws.com/uploads/1fd8c13703d95609fed6f779b59f41cb_meeting-icon-png-presentation-icon-board-meeting-icon-meeting-icon--4.png"
    },
    description: {
        type: String
    },
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
