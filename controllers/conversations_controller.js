var Conversation = require("../models/conversation");
var message_controller = require("../controllers/messages_controller");

function createConversation(conversation, callback) {
    Conversation.create(conversation, function (err, data) {
        if (err) callback(err, null);
        Conversation.populate(data, {path:"created_by"}, function (err, result){
            if (err) callback(err, null);
            callback(null, result);
        });
    });
}

function updateConversations(_id, name, participants, description, callback) {
    var upadte = {
        name: name,
        participants: participants,
        description: description
    };
    Conversation.findByIdAndUpdate(_id, upadte, function (err, result) {
        if (err) callback(err, null);
        callback (null, result);
    });
}

function getAllConversations(userID, callback){
    Conversation.find({participants: userID}, function (err, result) {
        if (err) callback(err, null);
        Conversation.populate(result, {path:"participants"}, function (err, data){
            if (err) callback(err, null);
            callback(null, data);
        });
    });
}

function deleteConversation(id, callback){
    Conversation.findOneAndDelete({_id: id}, function (err, result) {
        if (err) callback(err, null);
        message_controller.deleteMessages(result._id, function (err, data) {
            if (err) callback(err, null);
            callback(null, result);
        });
    });
}

module.exports = {
    createConversation,
    getAllConversations,
    deleteConversation,
    updateConversations
};
