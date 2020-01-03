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

function acceptFriend(idFriend, callback){
    var update = {
        status: true
    };

    Friend.findByIdAndUpdate(idFriend, update).populate("userID2").exec(function (err, result) {
        if (err) callback(err, null);
        callback(null, result);
    });
}

function deleteRequest(idFriend, callback){
    Friend.findByIdAndRemove({_id: idFriend}, function (err, result) {
        if (err) callback(err, null);
        callback(null, result);
    });
}

function deleteFriend(userID1, userID2, callback){
    var filter = {
        $or: [
            {
                userID1: userID1,
                userID2: userID2,
                status: true
            },
            {
                userID1: userID2,
                userID2: userID1,
                status: true
            }
        ]
    };
    Friend.findOneAndDelete(filter, function (err, result) {
        if (err) callback(err, null);
        Friend.populate(result, [{path:"userID1"}, {path:"userID2"}], function (err, data){
            if (err) callback(err, null);
            callback(null, data);
        });
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

    Friend.create(friend, function (err, friend) {
        if (err) callback(err, null);
        Friend.populate(friend, {path:"userID1"}, function (err, result){
            if (err) callback(err, null);
            callback(null, result);
        });
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
