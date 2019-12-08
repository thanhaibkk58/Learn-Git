var express = require("express");
var router = express.Router();
var path = require("path");

/* ---------------------------------------------------- */
/* POST - Upload a file */
router.post("/upload", function (req, res) {
    if (!req.files) return res.status(400).json({Err: "File: " + req.files.image});
    var image = req.files.image;
    var idImage = req.user._id;
    var url = "public/images/" + idImage + ".jpg";

    image.mv(url, function(err) {
        if (err) return res.status(500);
        else return res.status(200).send({
            status: "OK",
            url: "http://localhost:3000/" + url
        });
    });
});

/* ---------------------------------------------------- */
/* GET - Get a file */
router.get("/public/images/:image", function (req, res) {
    if (!req.body) return res.status(400);
    var image = req.params.image;
    res.sendFile(path.resolve("./public/images/" + image));
});

module.exports = router;
