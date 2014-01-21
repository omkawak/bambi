var object = require("cloud/object.js");

/**
 * Get the current user's profile
 */
var get = function(req, res) {

    if (req.user) {

        var query = new Parse.Query(object.User);

        query.get(req.user.id).then(function(user) {
            res.success([user.toJSON()]);
        }, function() {
            res.error("user lookup failed");
        });


    } else {

        res.error("session missing");

    }

};

exports.get = get;
