const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require("mongoose");
const User = require('./../models/user');
const app = express();

app.post('/', function (req, res) {
    let body = req.body;
    let { username, email, password, role } = body;
    let user = new User({
        _id: new mongoose.Types.ObjectId(),
        username,
        email,
        password: bcrypt.hashSync(password, 10),
        role
    });

    user.save((err, userDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }

        res.json({
            ok: true,
            user: userDB
        });
    })
});

module.exports = app;