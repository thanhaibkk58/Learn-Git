var socketio = require('socket.io');
var mongoose = require('mongoose');
var events = require("events");
var eventEmitter = new events.EventEmitter();
var checkAuthentication = require("../utils/check_authentication");

var friends_controller = require("../controllers/friends_controller_2");
var messages_controller = require("../controllers/messages_controller_2");
var conversations_controller = require("../controllers/conversations_controller_2");

var User = require("../models/user");
var Message = require("../models/message");
var Conversation = require("../models/conversation");

module.exports.sockets = function (http) {
    var io = socketio.listen(http);

    var ioChat = io.of("/");
    var userID;
    var currentRoom;

    ioChat.on("connection", function (socket) {
        console.error("A user connected: " + socket.id);
        socket.on("set-info-user", function (user_id) {
            userID = user_id.trim();
            console.error(userID + " is logged in!");
            //
            socket.join(user_id);

            friends_controller.getAllFriends(userID, function (err, friends) {
                if (err) console.error(err);
                socket.emit("set-all-friends", JSON.stringify(friends));
            });

            conversations_controller.getAllConversations(user_id, function (err, conversations) {
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

        socket.on("confirm-request-friend", function (id_request) {
            friends_controller.acceptFriend(id_request, userID, function (err, result) {
                if (err) console.error(err);
                socket.broadcast.to(id_request).emit('noti-confirm-request-friend', result);
                friends_controller.getAllFriends(userID, function (err, friends) {
                    if (err) console.error(err);
                    socket.emit("set-all-friends", JSON.stringify(friends));
                });
            });
        });

        socket.on("event-add-friend", function (data) {
            friends_controller.addFriend(userID, data, function (err, result) {
                if (err) console.error(err);
                socket.join(data);
                socket.broadcast.to(data).emit('noti-sent-request-friend', result);
            })
        });

        socket.on("delete-request-friend", function (id_request) {
            friends_controller.deleteRequest(id_request, userID, function (result) {
                // Do something
            });
        });

        socket.on("cancel-request-friend", function (userID2) {
            friends_controller.deleteRequest(userID, userID2, function (result) {
                // Do something
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
                socket.broadcast.to(currentRoom).emit('emit-message-to-receiver', mess);
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
                console.error(result);
                socket.emit
            });
        });
    });
};
