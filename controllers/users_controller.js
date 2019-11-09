var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var User = require("../models/user");
var passport = require("passport");

var checkAuthentication = require("../utils/check_authentication");

/* ---------------------------------------------------- */
/* GET - Sign up */
router.get("/signup", function(req, res, next) {
    res.render("dark/register.ejs", { title: "Signup" });
});

/* ---------------------------------------------------- */
/* POST - Sign up */
router.post("/signup", passport.authenticate("local-signup", {
    successRedirect: "/",
    failureRedirect: "/",
    failureFlash : true
}));

// Hiển thị form login
router.get('/login', function (req, res) {
    // Hiển thị trang và truyển lại những tin nhắn từ phía server nếu có
    res.render('dark/login.ejs', {message: req.flash('loginMessage')});
});

// Xử lý thông tin khi có người thực hiện đăng nhập
router.post('/login', passport.authenticate("local-login", {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/logout', checkAuthentication, function (req, res) {
    req.logout();
    res.redirect('/login');
});

module.exports = router;
