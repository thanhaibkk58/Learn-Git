var express = require("express");
var router = express.Router();
var Friend = require("../models/friends.js");
var Message = require("../models/message.js");
var messages_controller = require("../controllers/messages_controller");

var checkAuthentication = require("../utils/check_authentication");

/* ---------------------------------------------------- */
/* POST - Add Friend */
router.post("/add_friend", checkAuthentication, function (req, res) {
    if (!req.body) return res.status(400);
    var friend = new Friend({
        userID1: req.user._id,
        userID2: req.body.userID2,
    });

    Friend.create(friend, function (err, result) {
        if (err) return res.status(500);
        res.status(200).send(result);
    });
});

/* ---------------------------------------------------- */
/* POST - Accept friend */
router.put("/accept", checkAuthentication, function (req, res) {
    if (!req.body) return res.status(400);
    var filter = {
        userID1: req.body.userID1,
        status: false
        // userID2: req.user.userID
    };

    var update = {
        status: true
    };
    Friend.findOneAndUpdate(filter, update, {new: true}, function (err, result) {
        if (err) console.error("Loi truy van");
        res.json(result);
    });
});

/* ---------------------------------------------------- */
/* DELETE - Delete friend */
router.post("/delete_friend", checkAuthentication, function(req, res){
    if (!req.body) return res.status(400);
    var filter = {
        $or: [
            {
                userID1: req.body.userID1,
                userID2: req.user._id
            },
            {
                userID1: req.user._id,
                userID2: req.body.userID1
            }
        ]
    };

    Friend.findOneAndDelete(filter, function (err, result) {
        if (err) return res.status(400);
        messages_controller.deleteMessages(result._id, function (err, data) {
            if (err) return res.status(400);
            return res.json(data);
        });
    });
});

/* ---------------------------------------------------- */
/* GET - Get all friends */
router.get("/all_friends", checkAuthentication, function (req, res) {
    if (!req.body) return res.status(400);
    var filter = {
        $or: [
            {
                userID1: req.user._id,
                status: true
            },
            {
                userID2: req.user._id,
                status: true
            }
        ]
    };

    Friend.find(filter).populate("userID1").populate("userID2").exec(function (err, friends) {
        if (err) console.error(err);
        res.json(friends);
    });
});

/* ---------------------------------------------------- */
/* GET - Get friend requests */
router.get("/friend_requests", checkAuthentication, function (req, res) {
    if (!req.body) return res.status(400);
    var filter = {
        status: false,
        userID2: req.body.userID
    };
    Friend.find(filter, function (err, result) {
        if (err) return res.status(400);
        res.json(result);
    });
});


module.exports = router;
