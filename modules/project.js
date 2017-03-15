var db = require('../dbconnection.js');

var ProjectDetails = {

    add: function (Project, callback) {
        var query = db.query("Insert into projects_details values(?,?,?,?,?,?,?,?)", [,Project.project_name, Project.project_desc, Project.user_id, Project.skills, Project.project_duration, Project.project_budget, Project.status], callback);
        console.log("Add Project query sql => " + query.sql);
        console.log("Add Project query value => " + query.values);

        return query
    },
    getAllProjects: function (callback) {

        var query = db.query('SELECT CASE WHEN COUNT(*)+0 > 1 THEN COUNT(*) ELSE 0 END AS totalBids, details.* FROM projects_details details LEFT JOIN project_bids bid ON bid.project_id = details.id GROUP BY 2;', callback);
        /*var query = db.query("Select * from projects_details ORDER BY id DESC;", callback);*/

        return query
    },

    getProject: function (projectId, callback) {
        return db.query("Select * from projects_details where id=?", [projectId], callback);
    },

    getClientProject: function (userId, callback) {
        //var query = db.query('SELECT CASE WHEN COUNT(*)+0 > 1 THEN COUNT(*) ELSE 0 END AS totalBids, details.* FROM projects_details details LEFT JOIN project_bids bid ON bid.project_id = details.id WHERE bids.user_id=? GROUP BY bids.bid_amount;', [userId], callback);

        return db.query("Select * from projects_details where user_id=?", [userId], callback);
    },


    postBid: function (Project, callback) {

        var query = db.query("Insert into project_bids values(?,?,?,?,?)", [, Project.project_id, Project.user_id, Project.bid_amount, Project.proposal], callback);
        return query;

    },
    checkBid: function (projectid,userId, callback) {

        console.log('project id ' + projectid + "  user id  " + userId);
        return db.query("Select * from project_bids where project_id=? and user_id=?", [projectid, userId], callback);
        return query;

    },
    viewAllBids: function (projectid, callback) {

        return db.query("SELECT user.first_name,user.last_name, user.image_name, bids.* FROM `project_bids` bids LEFT JOIN `user` ON user.`user_id` = bids.`user_id` WHERE bids.project_id=? GROUP BY bids.bid_amount", [projectid], callback);
        return query;

    },
    hire: function (Project, callback) {

        var query = db.query("Insert into project_hired values(?,?,?)", [, Project.project_id, Project.user_id], callback);
        return query;

    }

};

module.exports = ProjectDetails;