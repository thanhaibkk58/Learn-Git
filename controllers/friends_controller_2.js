var Friend = require("../models/friends.js");
var  User = require("../models/user");

function getAllFriends(userID, callback) {
    var filter = {
        $or: [
            {
                userID1: userID,
                status: true
            },
            {
                userID2: userID,
                status: true
            }
        ]
    };

    Friend.find(filter).populate("userID1").populate("userID2").exec(function (err, friends) {
        if (err) callback(err, null);
        callback(null, friends);
    });

}

function getAllRequestFriends(userID, callback){
    var filter = {
        userID2: userID,
        status: false
    };

    Friend.find(filter).populate("userID1").exec(function (err, friends) {
        if (err) callback(err, null);
        callback(null, friends);
    });
}

function acceptFriend(userID1, userID2, callback){
    var filter = {
        userID1: userID1,
        userID2: userID2,
        status: false
    };
    var update = {
        status: true
    };

    Friend.findOneAndUpdate(filter, update, function (err, result) {
        if (err) callback(err, null);
        callback(null, result);
    });
}

function deleteRequest(userID1, userID2, callback){
    var filter = {
        userID1: userID1,
        userID2: userID2,
        status: false
    };
    Friend.findOneAndDelete(filter, function (err, result) {
        if (err) callback(err, null);
        callback(null, result)
    });
}

function deleteFriend(userID1, userID2, callback){
    var filter = {
        userID1: userID1,
        userID2: userID2,
        status: true
    };
    Friend.findOneAndDelete(filter, function (err, result) {
        if (err) callback(err, null);
        callback(null, result)
    });
}

function getAllSentRequests(userID, callback){
    var filter = {
        userID1: userID,
        status: false
    };

    Friend.find(filter).populate("userID2").exec(function (err, results) {
        if (err) callback(err, null);
        callback(null, results);
    });
}

function addFriend(userID1, userID2, callback){
    var friend = new Friend({
        userID1: userID1,
        userID2: userID2,
        status: false,
        created_at: Date.now()
    });

    Friend.create(friend, function (err, result) {
        if (err) callback(err, null);
        callback(null, result);
    });
}

module.exports = {
    getAllFriends,
    getAllRequestFriends,
    acceptFriend,
    deleteRequest,
    getAllSentRequests,
    deleteFriend,
    addFriend
};
