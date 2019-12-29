var express = require('express');
var router = express.Router();
var checkAuthentication = require("../utils/check_authentication");
var friends_controller = require("../controllers/friends_controller");

/* GET home page. */
router.get("/", checkAuthentication, function (req, res) {
  res.render('index.ejs', {user: req.user});
});

module.exports = router;
