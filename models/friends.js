var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var friendSchema = new Schema({
    userID1: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    userID2: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    status: {
        type: Boolean,
        required: true,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
}, {
    versionKey: false
});

module.exports = mongoose.model("Friend", friendSchema);
