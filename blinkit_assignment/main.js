const { Router } = require("express");
const { Middleware, check } = require("./middleware/auth");
const router = Router();
const multer = require('multer');
const { User, Img } = require("./db")
const jwt = require("jsonwebtoken")
const { jwt_secret } = require("./config")
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

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
        const filePath=path.join(__dirname + 'uploads' + req.file.filename);
        const newImage = new Img({
            name: req.body.name,
            img: {
                data: fs.readFileSync(filePath),
                contentType: 'image/png'
            }
        });
        await newImage.save();
        res.json({
            msg:"Successfully uploaded"
        });    
    } catch (error) {
        res.status(400).send(error.message);
    }
})

module.exports = router;