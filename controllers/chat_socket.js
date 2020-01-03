var socketio = require('socket.io');

var friends_controller = require("./friends_controller");
var messages_controller = require("./messages_controller");
var conversations_controller = require("./conversations_controller");

var User = require("../models/user");
var Message = require("../models/message");
var Conversation = require("../models/conversation");

module.exports.sockets = function (http) {
    var io = socketio.listen(http);

    var ioChat = io.of("/");
    var currentRoom;

    ioChat.on("connection", function (socket) {
        console.error("A user connected: " + socket.id);
        socket.on("set-info-user", function (user_id) {
            var userID = user_id.trim();
            socket.join(userID);

            friends_controller.getAllFriends(userID, function (err, friends) {
                if (err) console.error(err);
                socket.emit("set-all-friends", JSON.stringify(friends));
            });

            conversations_controller.getAllConversations(userID, function (err, conversations) {
                if (err) console.error(err);
                socket.emit("set-all-groups", JSON.stringify(conversations));
            });

            friends_controller.getAllRequestFriends(userID, function (err, requests) {
                if (err) console.error(err);
                socket.emit("set-all-request-friends", JSON.stringify(requests));
            });

            friends_controller.getAllSentRequests(userID, function (err, results) {
                if (err) console.error(err);
                socket.emit("get-all-sent-request", JSON.stringify(results));
            });

        });

        socket.on("send-users-temp", function (data) {
            // get All Users
            User.find({"_id": {$nin: data}}, function (err, results) {
                if (err) console.error(err);
                socket.emit("get-all-users", JSON.stringify(results));
            });
        });

        socket.on("confirm-request-friend", function (data) {
            friends_controller.acceptFriend(data.idFriend, function (err, result) {
                if (err) console.error(err);
                socket.join(result.userID1);
                socket.broadcast.to(result.userID1).emit('noti-confirm-request-friend', result);
                friends_controller.getAllFriends(data.userID, function (err, friends) {
                    if (err) console.error(err);
                    socket.emit("set-all-friends", JSON.stringify(friends));
                });
            });
        });

        socket.on("event-add-friend", function (data) {
            friends_controller.addFriend(data.userID1, data.userID2, function (err, result) {
                if (err) console.error(err);
                socket.join(data.userID2);
                socket.broadcast.to(data.userID2).emit('noti-sent-request-friend', result);
            })
        });

        socket.on("delete-request-friend", function (data) {
            friends_controller.deleteRequest(data, function (err, result) {
                console.error(err);
            });
        });

        socket.on("cancel-request-friend", function (data) {
            friends_controller.deleteRequest(data, function (err, result) {
                console.error(err);
            });
        });

        socket.on("join-room", function (data) {
            currentRoom = data.room_id;
            socket.join(currentRoom);
            messages_controller.getAllPrivateMessage(currentRoom, function (err, all_data) {
                if (err) console.error(err);
                socket.emit("get-old-messages", JSON.stringify(all_data));
            });
        });

        socket.on("send-message-to-server", function (data) {
            var message = new Message({
                content: data.message,
                type: data.type,
                receiver: currentRoom,
                sender: data.userID,
                created_at: Date.now()
            });
            messages_controller.createNewMessage(message, function (err, mess) {
                if (err) console.error(err);
                io.to(currentRoom).emit('emit-message-to-receiver', mess);
            });
        });

        socket.on("event-delete-message", function (data) {
            messages_controller.deleteMessage(data, function (err, result) {
                if (err) console.error(err);
                io.to(result.receiver).emit('emit-delete-message', result._id);
            })
        });

        socket.on("event-delete-friend", function (data) {
            friends_controller.deleteFriend(data.userID1, data.userID2, function (err, result) {
                if (err) console.error(err);
                io.to(result.userID1._id).emit("noti-delete-friend", result);
                io.to(result.userID2._id).emit("noti-delete-friend", result);
            });
        });

        socket.on("event-delete-conversation", function (data) {
            conversations_controller.deleteConversation(data, function (err, result) {
                if (err) console.error(err);
                else {
                    for (var i = 0; i < result.participants.length; i++){
                        io.to(result.participants[i]).emit("noti-delete-groupchat", result.name);
                    }
                }
            });
        });

        socket.on("event-create-group-chat", function (data) {
            var conversation = new Conversation({
                name: data.name,
                participants: data.participants,
                description: data.description,
                created_by: data.created_by
            });

            conversations_controller.createConversation(conversation, function (err, result) {
                if (err) console.error(err);
                else {
                    for (var i = 0; i < result.participants.length; i++){
                        io.to(result.participants[i]).emit("noti-create-groupchat", result);
                    }
                }
            });
        });

        socket.on("event-update-group-chat", function (data) {
            conversations_controller.updateConversations(data._id, data.name, data.participants, data.description, function (err, result) {
                if (err) console.error(err);
                else {
                    for (var i = 0; i < result.participants.length; i++){
                        io.to(result.participants[i]._id).emit("noti-update-groupchat", result);
                    }
                }
            })
        });

    });
};
