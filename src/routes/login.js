const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const app = express();

app.post('/', async function (req, res) {

    let body = req.body;

    try {
        const userDB = await User.findOne({ username: body.username });

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "This username does not exist"
                }
            })
        }

        if (!bcrypt.compareSync(body.password, userDB.password)){
            console.log("Error")
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

    } catch (err) {
        return res.status(400).json({
            message: 'An error has occurred',
            err
        })
    }
})

module.exports = app;