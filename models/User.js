const mongoose = require('mongoose');
const crypto = require('crypto');

const userScheama = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        max: 32
    },
    email: {
        type: String,
        trim: true,
        required: true,
        lowercase: true,
        unique: true
    },
    hashed_password: {
        type: String,
        required: true,
    },
    salt: String,
    role: {
        type: String,
        default: 'subscriber'
    },
    resetPasswordLink: {
        data: String,
        default: ''
    },
}, { timestamps: true });

//Virtuals
userScheama.virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    });

//Methods
userScheama.methods = {

    authenticate: function (plainTextPassword) {
        return this.encryptPassword(plainTextPassword) === this.hashed_password;
    },

    makeSalt: function() {
        return Math.round(new Date().valueOf * Math.random()) + '';
    },

    encryptPassword: function (password) {
        if (!password) return false;
        try {
            return crypto.createHmac('sha1', this.salt)
                .update(password)
                .digest('Hex');
        } catch (err) {
            return false;
        }
    }
}

module.exports = User = mongoose.model('User', userScheama);