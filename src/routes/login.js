const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const app = express();

app.post('/login', function (req, res) {

    let body = req.body;

    User.findOne({ email: body.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            })
        }

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "This email does not exist"
                }
            })
        }

        if (!bcrypt.compareSync(body.password, userDB.password)){
            return res.status(400).json({
                ok: false,
                err: {
                message: "Wrong password"
                }
            });
        }

        let token = jwt.sign({ user: userDB },
            process.env.AUTH_SEED,
            { expiresIn: process.env.TOKEN_TTL
        });

        res.json({
            ok: true,
            user: userDB,
            token
        });
   })
})

module.exports = app;