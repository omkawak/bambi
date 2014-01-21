var object = require("cloud/object.js");
var needs = require("cloud/system.needs.js");

/**
 * Create a new following relationship
 * between the current user and a specified user
 * @param {String} userId
 */
var add = function(req, res) {

    var followee = new object.User();
    followee.id = req.params.userId;

    var query = new Parse.Query(object.Follow);

    query.equalTo("followee", followee);
    query.equalTo("user", req.user);

    // Check if Follow already exist
    query.find().then(function(follow) {

        if (follow.length) { // Follow already exist

            res.success();

        } else { // Follow doesn't exist

            // Check if Followee exists
            needs.User(req.params.userId).then(function(user) {

                var follow = new object.Follow();

                // Set attributes
                follow.set("followee", user);

                follow.save().then(function() {
                    res.success();
                }, function() {
                    res.error("follow save failed");
                });


            }, function() {
                res.error("user doesn't exist");
            });

        }

    }, function() {
        res.error("follow lookup failed");
    });

};

/**
 * Remove an existing following relationship
 * between the current user and a specified user
 * @param {String} userId
 */
var remove = function(req, res) {

    var followee = new object.User();
    followee.id = req.params.userId;

    var query = new Parse.Query(object.Follow);

    query.equalTo("followee", followee);
    query.equalTo("user", req.user);

    // Check if Follow already exist
    query.find().then(function(follow) {

        if (follow.length) { // Follow already exist

            follow[0].destroy().then(function() {
                res.success();
            }, function() {
                res.error("follow delete failed");
            });

        } else { // Follow doesn't exist

            res.success();

        }

    }, function() {
        res.error("follow lookup failed");
    });

}

/**
 * Set the author of the object and the current date
 */
var beforeSave = function(req, res) {
    req.object.set("date", Date());
    if (req.user) {
        req.object.set("user", req.user);
        res.success();
    } else {
        res.error();
    }
};

/**
 * Increment users following and followers counts
 */
var afterSave = function(req) {

    Parse.Analytics.track('follow');

    Parse.Cloud.useMasterKey();    

    // Increment followee followers count
    needs.User(req.object.get("followee").id).then(function(followee) {
        followee.increment("followers");
        followee.save();
    });

    // Increment current user followers count
    needs.User(req.user.id).then(function(user) {
        user.increment("following");
        user.save();
    });

};

/**
 * Decrement users following and followers counts
 */
var afterDelete = function(req) {

    Parse.Analytics.track('unfollow');

    Parse.Cloud.useMasterKey();

    // Increment followee followers count
    needs.User(req.object.get("followee").id).then(function(followee) {
        followee.increment("followers", -1);
        followee.save();
    });

    // Increment current user followers count
    needs.User(req.user.id).then(function(user) {
        user.increment("following", -1);
        user.save();
    });

};

exports.add = add;
exports.remove = remove;
exports.beforeSave = beforeSave;
exports.afterSave = afterSave;
exports.afterDelete = afterDelete;
