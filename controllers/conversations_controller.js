var express = require("express");
var router = express.Router();
var Conversation = require("../models/conversation.js");
var checkAuthentication = require("../utils/check_authentication");

// function createConversation(_id, type, name, created_by, created_at){
//     var conversation = new Conversation({
//         _id: _id,
//         type: type,
//         name: name,
//         created_by: created_by,
//         created_at: Date.now()
//     });
//     Conversation.create(conversation, function (err, result) {
//         if (err) return null;
//         return result;
//     });
// }

// /* ---------------------------------------------------- */
// /* POST - Create Conversation */
// router.post("/create_conversation", checkAuthentication, function (req, res) {
//     if (!req.body) return res.status(400);
//     var conversation = new Conversation({
//         _id: new mongoose.Schema.ObjectID,
//         type: "group",
//         name: req.body.name,
//         created_by: req.user.userID,
//         created_at: Date.now()
//     });
//
//     Conversation.create(conversation, function (err, result) {
//         if (err) console.error("Loi truy van");
//         return json(result);
//     });
// });
//
// /* ---------------------------------------------------- */
// /* PUT - Update Conversation */
// router.put("/update_conversation", checkAuthentication, function (req, res) {
//     if (!req.body) return res.status(400);
//     var conversation = new Conversation({
//         _id: new mongoose.Schema.ObjectID,
//         type: "group",
//         name: req.body.name,
//         created_by: req.user.userID,
//         created_at: Date.now()
//     });
//
//     Conversation.findByIdAndUpdate(conversation._id, conversation, function (err, result) {
//         if (err) console.error("Loi truy van");
//         return json(result);
//     });
// });


module.exports = router;
