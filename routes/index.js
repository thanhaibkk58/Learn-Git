var express = require('express');
var router = express.Router();
var checkAuthentication = require("../utils/check_authentication");

/* GET home page. */
router.get("/", checkAuthentication, function(req, res, next) {
  res.render("index", { title: 'Express' });
});

module.exports = router;
