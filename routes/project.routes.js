var express = require('express');
var router = express.Router();
var Project = require('../modules/project');

router.post('/add', function (req, res, next) {
    Project.add(req.body, function (err, count) {
        if (err) {
            res.json({"Error": false, "message": err, "code": 400});
        }
        else {
            res.json({"Error": false, "message": "Success", "code": 200});
        }
    });
});


router.get('/getAllProjects', function (req, res, next) {

    Project.getAllProjects(function (err, rows) {
        if (rows) {
            if (err) {
                res.json({"Error": false, "message": err, "code": 400});
            }
            else {
                var data = [];
                for (var i = 0; i < rows.length; i++) {
                    (function (i) {
                        var index = i;
                        return (getProject(rows[i].id, rows[i].user_id, function (bidsrow) {
                            var post_obj = {};
                            if (rows[index]) {
                                post_obj.projectData = rows[index];
                                post_obj.bids = bidsrow;
                                data.push(post_obj);
                                if (data.length === rows.length)
                                    res.json({"Error": false, "message": "Success", "code": 200, data: data});
                            }
                        }));
                    })(i);
                }
            }
        }
    });
});

function getProject(projectId, userId, callback) {
    Project.checkBid(projectId, userId, function (err, rows) {
        if (err) {
            res.json(err);
        }
        else {
            callback(rows);
        }
    });
}

function viewAllBids(projectId, callback) {
    Project.viewAllBids(projectId, function (err, rows) {
        if (err) {
            res.json(err);
        }
        else {
            callback(rows);
        }
    });
}


router.get('/:projectId?', function (req, res, next) {

    Project.getProject(req.params.projectId, function (err, rows) {

        if (err) {
            res.json(err);
        }
        else {
            var data = [];
            for (var i = 0; i < rows.length; i++) {
                (function (i) {
                    var index = i;
                    return (viewAllBids(rows[i].id, function (bidsrow) {
                        var post_obj = {};
                        if (rows[index]) {
                            post_obj.projectData = rows[index];
                            post_obj.bids = bidsrow;
                            data.push(post_obj);
                            if (data.length === rows.length)
                                res.json({"Error": false, "message": "Success", "code": 200, data: data});
                        }
                    }));
                })(i);
            }
        }
    });
});

router.get('/client/:userId?', function (req, res, next) {

    console.log('client projects api call');
    console.log('client user id = ' + req.param.userId);
    Project.getClientProject(req.params.userId, function (err, rows) {

        if (err) {
            res.json(err);
        }
        else {
            if (rows.length != 0) {
                var data = [];
                for (var i = 0; i < rows.length; i++) {
                    (function (i) {
                        var index = i;
                        return (viewAllBids(rows[i].id, function (bidsrow) {
                            var post_obj = {};
                            if (rows[index]) {
                                post_obj.projectData = rows[index];
                                post_obj.bids = bidsrow;
                                data.push(post_obj);
                                if (data.length === rows.length)
                                    res.json({"Error": false, "message": "Success", "code": 200, data: data});
                            }
                        }));
                    })(i);
                }
            } else {
                res.json({"Error": false, "message": "Success", "code": 200, data: rows});
            }
        }
    });
});

router.get('/postBid/:projectId&:userId', function (req, res, next) {

    Project.checkBid(req.params.projectId, req.params.userId, function (err, rows) {

        if (err) {
            console.log(err);
            res.json(err);
        }
        else {

            console.log(rows);
            var isAvailable = rows.length == 1 ? true : false;

            res.json({
                "Error": false,
                "message": isAvailable ? "You Already bid for this project." : "success",
                "code": 200,
                isAvailable: isAvailable
            });
        }
    });
});

router.post('/postBid', function (req, res, next) {

    Project.postBid(req.body, function (err, count) {
        if (err) {
            res.json({"Error": false, "message": err, "code": 400});
        }
        else {
            res.json({"Error": false, "message": "Success", "code": 200});
        }
    });

});

router.post('/hire', function (req, res, next) {
    Project.hire(req.body, function (err, count) {
        if (err) {
            res.json({"Error": false, "message": err, "code": 400});
        }
        else {
            res.json({"Error": false, "message": "Success", "code": 200});
        }
    });
});

module.exports = router;