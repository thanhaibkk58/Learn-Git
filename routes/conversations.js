var express = require("express");
var router = express.Router();
var Conversation = require("../models/conversation.js");
var checkAuthentication = require("../utils/check_authentication");
var conversations_controller = require("../controllers/conversations_controller");
var messages_controller = require("../controllers/messages_controller");

/* ---------------------------------------------------- */
/* POST - Create Conversation */
router.post("/create_conversation", checkAuthentication, function (req, res) {
    if (!req.body) return res.status(400);
    var conversation = new Conversation({
        _id: new mongoose.Schema.ObjectID,
        type: "group",
        name: req.body.name,
        created_by: req.user.userID,
        created_at: Date.now()
    });

    Conversation.create(conversation, function (err, result) {
        if (err) console.error("Loi truy van");
        return json(result);
    });
});

/* ---------------------------------------------------- */
/* PUT - Update Conversation */
router.put("/update_conversation", checkAuthentication, function (req, res) {
    if (!req.body) return res.status(400);
    var conversation = new Conversation({
        _id: new mongoose.Schema.ObjectID,
        type: "group",
        name: req.body.name,
        created_by: req.user.userID,
        created_at: Date.now()
    });

    Conversation.findByIdAndUpdate(conversation._id, conversation, function (err, result) {
        if (err) console.error(err);
        return json(result);
    });
});

/* ---------------------------------------------------- */
/* POST - Delete Conversation */
router.post("/delete_conversation", checkAuthentication, function (req, res) {
    if (!req.body) return res.status(400);
    conversations_controller.deleteConversation(req.body._id, function (err, result) {
        if (err) return res.status(400);
        messages_controller.deleteMessages(result._id, function (err, data) {
            if (err) return res.status(400);
            return res.json(data);
        });
    });
});


module.exports = router;
