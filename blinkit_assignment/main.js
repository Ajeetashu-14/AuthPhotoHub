const { Router } = require("express");
const { Middleware,check} = require("./middleware/auth");
const router = Router();
const multer = require('multer');
const { User, Img } = require("./db")
const jwt = require("jsonwebtoken")
const { jwt_secret } = require("./config")
const fs = require('fs');
const path = require('path');

const upload = multer({ dest: 'uploads/' });

router.post('/signup', check, (req, res) => {
    const { username, password } = req.body;

    User.create({
        username,
        password
    })
        .then(function () {
            res.json({
                msg: "Account created successfully"
            })
        })
        .catch(function (err) {
            res.status(500).json({
                error: "Error creating account",
                details: err.message
            });
        });
});

router.post('/signin', (req, res) => {
    const username = req.body.username
    const password = req.body.password
    User.findOne({
        username,
        password
    })
        .then(function (response) {
            if (response) {
                const token = jwt.sign({ username }, jwt_secret)
                res.json({
                    token
                })
            }
            else {
                res.status(411).json({
                    msg: "Incorrect username and password"
                })
            }
        })
});


router.post('/upload', Middleware, upload.single('image'), async (req, res) => {
    try {
        const newImage = new Img({
            name: req.body.name,
            img: {
                data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
                contentType: 'image/png'
            }
        });
        await newImage.save();
        res.send('Image uploaded successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
});
router.get('/:username', async (req, res) => {
    console.log("entered get username")
    const username = req.query.username;
    console.log("username-" + username)
    try {
        const user = await User.findOne({ username });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;