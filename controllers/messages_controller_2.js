var Message = require("../models/message");

function createNewMessage(message, callback) {
    Message.create(message, function (err, result) {
        if (err) callback(err, null);
        callback(null, result);
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

function deleteMessage(){
    return null;
}

module.exports = {
    createNewMessage,
    getAllPrivateMessage,
    deleteMessage
};
