var Message = require("../models/message");

function createNewMessage(message, callback) {
    Message.create(message, function (err, result) {
        if (err) callback(err, null);
        Message.populate(result, {path:"sender"}, function (err, data){
            if (err) callback(err, null);
            callback(null, data);
        });
    });
}

function getAllPrivateMessage(roomID, callback){
    var filter = {
        receiver: roomID
    };

    Message.find(filter).populate("sender").exec(function (err, data) {
        if (err) callback(err, null);
        callback(null, data);
    });
}

// Delete all messages in PM or group chat
function deleteMessages(receiver, callback){
    var filter = {
        receiver: receiver
    };
    Message.deleteMany(filter, function (err, data) {
        if (err) callback(err, null);
        callback(null, data);
    });
}

// Delete a message
function deleteMessage(id, callback){
    Message.findByIdAndRemove({_id: id}, function (err, result) {
        if (err) callback(err, null);
        callback(null, result);
    });
}

module.exports = {
    createNewMessage,
    getAllPrivateMessage,
    deleteMessages,
    deleteMessage
};
