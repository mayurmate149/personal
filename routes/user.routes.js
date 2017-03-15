var express = require('express');
var router = express.Router();
var User = require('../modules/user');
var path = require('path'),
    fs = require('fs');
var multer = require('multer')
var upload = multer({dest: 'uploads/'});
const jwt = require('express-jwt');


const authCheck = jwt({
    secret: 'vUzIMDAaBrrDq0TfhwBFMzDI8m04IvATxi-qJh_VmusA50iBA60HvfewZ9g4Ho7X',
    audience: '14d5shC8K8nzjey0fmIv21c2DXScsGzx'
});


router.post('/add', function (req, res, next) {

    User.addUser(req.body, function (err, count) {
        if (err) {
            res.json(err);
        }
        else {
            res.json({"Error": false, "message": "Success", "code": 200});
        }
    });
});

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        //callback(null, file.fieldname + '-' + Date.now());
        callback(null, Date.now() + '.png');
    }
});
var upload = multer({storage: storage}).single('avatar');

router.post('/uploads', function (req, res, next) {

    upload(req, res, function (err) {
        if (err) {
            console.log("Error uploading file.");
            return res.end("Error uploading file.");
        }else{
            res.json({"Error": false, "message": "Success", "code": 200, "imageName" : req.file.filename, data :req.file});

        }
    });
});

router.put('/update/:userId', function (req, res, next) {

    User.update(req.params.userId,req.body, function (err, rows) {

        if (err) {
            res.json(err);
        }
        else {
            res.json({"Error": false, "message": "Success", "code": 200, data : rows});
        }
    });
});

router.delete('/delete/:userId', function (req, res, next) {

    User.delete(req.params.mobileno,function (err, count) {

        if (err) {
            res.json(err);
        }
        else {
            res.json({"Error": false, "message": "Success", "code": 200});
        }
    });
});

router.get('/', authCheck,function (req, res, next) {

    User.getAllUsers(function (err, rows) {

        if (err) {
            res.json(err);
        }
        else {
            res.json({"Error": false, "message": "Success", "code": 200, "data": rows});
        }
    });

});

router.get('/:userId?', function (req, res, next) {

    console.log(req.params.userId);
    User.getUser(req.params.userId, function (err, rows) {

        if (err) {
            res.json(err);
        }
        else {

            if(rows.length != 0){
                if (rows[0].image_name == "") {
                    rows[0].image_name = "default.png";
                }

                res.json({"Error": false, "message": "Success", "code": 200, "data": rows});
            }else{
                res.json({"Error": false, "message": "Success", "code": 200, "data": rows});
            }
        }
    });

});

router.post('/message', function (req, res, next) {

    User.sendMessage(req.body, function (err, count) {
        if (err) {
            res.json({"Error": false, "message": err, "code": 400});
        }
        else {
            res.json({"Error": false, "message": "Success", "code": 200});
        }
    });

});


router.post('/login', function (req, res, next) {

    User.login(req.body, function (err, rows) {
        if (err) {
            res.json({"Error": true, "message": err, "code": 400, "data": rows});
        }
        else {

            if(rows.length != 0){
                var data = rows[0];
                var userName = data.username;
                var password = data.password;
            }

            if(userName == req.body.username && password == req.body.password){
                res.json({"Error": false, "message": "Login Succesfully", "code": 200, "data": rows});
            }else{
                res.json({"Error": true, "message": "Username or passoword is not correct.", "code": 400, "data": rows});
            }

        }
    });
});

module.exports = router;