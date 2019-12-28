var Conversation = require("../models/conversation");

function createConversation(conversation, callback) {
    Conversation.create(conversation, function (err, data) {
        if (err) callback(err, null);
        Conversation.populate(data, {path:"created_by"}, function (err, result){
            if (err) callback(err, null);
            callback(null, result);
        });
    });
}

function getAllConversations(userID, callback){
    Conversation.find({participants: userID}, function (err, result) {
        if (err) callback(err, null);
        callback(null, result);
    });
}

module.exports = {
    createConversation,
    getAllConversations
};
