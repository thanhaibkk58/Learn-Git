var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var Message = require("../models/message.js");

var checkAuthentication = require("../utils/check_authentication");

/* ---------------------------------------------------- */
/* POST - Create Message */
router.post("/create_message", checkAuthentication, function (req, res) {
    if (!req.body) return res.status(400);
    message = new Message({
        _id: new mongoose.Schema.ObjectID,
        content: req.body.content,
        type: req.body.type,
        conversationID: req.body.conversationID,
        sender: req.user.userID,
        created_at: Date.now()
    });

    Message.create(message, function (err, result) {
        if (err) console.error("Loi truy van");
        return json(result);
    });
});


module.exports = router;
