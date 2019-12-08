var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var User = require("../models/user");
var passport = require("passport");
var uploadImage = require("../controllers/upload_2");

var checkAuthentication = require("../utils/check_authentication");

/* ---------------------------------------------------- */
/* GET - Sign up */
router.get("/signup", function(req, res) {
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

// Update profile
router.post("/user/update", checkAuthentication, function (req, res) {
    if (!req.body) return res.status(400);
    var avatar_url;
    if (req.files !== null) {
        uploadImage.uploadImage(req.files.image, req.user._id);
        avatar_url = "http://localhost:3000/public/images/" + req.user._id + ".jpg";
    } else {
        avatar_url = req.user.avatar_url;
    }

    var update = {
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        avatar_url: avatar_url
    };

    User.findOne({email: req.body.email}, function (err, result) {
        if (err) return res.status(400);
        var id1;
        if (result != null){
            id1 = result._id + "";
        }
        var id2 = req.user._id + "";
        if (id1 !== id2 && result != null){
            // Email already exists
            console.error("Email already exists!");
            return res.redirect("/");
        } else {
            // Update
            User.findByIdAndUpdate(req.user._id, update, function (err, user) {
                if (err) res.status(400);
                // return res.status(200);
                return res.redirect("/");
            });
        }
    });
});

router.get('/logout', checkAuthentication, function (req, res) {
    req.logout();
    res.redirect('/login');
});

module.exports = router;
