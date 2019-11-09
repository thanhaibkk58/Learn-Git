var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt-nodejs");

var userSchema = new Schema({
    userID: {
        type: Schema.Types.ObjectID,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        index: {
            unique: true,
            dropDups: true
        }
    },
    username: {
        type: String
    },
    en_password: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    sex: {
        type: String,
        required: true,
        default: "None"
    },
    avatar_url: {
        type: String,
        default: "https://www.vasjamaica.com/sites/default/files/fb_avatar_0_0.jpg"
    }
}, {
    versionKey: false
});

userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function (en_password) {
    return bcrypt.compareSync(en_password, this.en_password);
};

module.exports = mongoose.model("User", userSchema);
