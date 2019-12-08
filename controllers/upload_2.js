var path = require("path");


function uploadImage(_image, userID) {
    var url = "public/images/" + userID + ".jpg";

    _image.mv(url, function(err) {
        if (err) return null;
        return  "http://localhost:3000/" + url;
    });
}
 module.exports = {
    uploadImage
 };
