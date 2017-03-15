var db = require('../dbconnection.js');


var User = {

    getAllUsers: function (callback) {
        return db.query("Select * from user", callback);
    },

    getUser: function (userId, callback) {
        return db.query("Select * from user where user_id=?", [userId], callback);
    },

    addUser: function (User, callback) {

        var query = db.query("Insert into user values(?,?,?,?,?,?,?,?,?,?,?,?)", [, User.first_name, User.last_name, User.mobile_no, User.email_id, User.address, User.city, User.pin_code, User.user_type,  User.skills,User.image_name,User.user_id], callback);
        console.log("Add Project query sql => " + query.sql);
        console.log("Add Project query value => " + query.values);

        return query;
    },

    delete: function (userId, callback) {
        return db.query("delete from user where id=?", [userId], callback);
    },

    update: function (userId, User, callback) {
        return db.query("update user set first_name=?,last_name=?,email_id=?,address=?,city=?,pin_code=?,user_type=?, mobile_no=?,image_name=? where user_id=?", [User.first_name, User.last_name,User.email_id, User.address, User.city, User.pin_code, User.user_type, User.mobile_no,User.image_name, userId], callback);
    },

    login: function (User, callback) {

        console.log(User.username);
        var qstring = db.query("Select * from user where username=?",[User.username], callback);
        return qstring;
    },
    sendMessage: function (User, callback) {

        var query = db.query("Insert into messages values(?,?,?,?,?,?)", [, User.from_user_id, User.to_user_id, User.subject, User.messages, User.project_id], callback);
        return query;
    }


};

module.exports = User;