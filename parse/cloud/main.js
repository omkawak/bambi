var _ = require("underscore");


var object = require("cloud/object.js");

var needs = require("cloud/system.needs.js");
var follow = require("cloud/system.follow.js");
var post = require("cloud/system.post.js");
var feed = require("cloud/system.feed.js");
var me = require("cloud/system.me.js");

Parse.Cloud.define('post', post.add);
Parse.Cloud.define('feed', feed.get);
Parse.Cloud.define('me', me.get);

Parse.Cloud.beforeSave(Parse.User, function(req, res) {

    Parse.Cloud.useMasterKey();

    if (!req.object.id) {

        req.object.set("listings", 0);
        req.object.set("followers", 0);
        req.object.set("following", 0);

    }

    res.success();

});

Parse.Cloud.afterSave("Product", function(req, res) {

    // Only list product if it didn't exist
    if (!req.object.existed()) {

        var listing = new object.Listing();

        listing.set("product", req.object);
        listing.set("user", req.user);
        listing.set("type", "list");

        listing.save();

    }

});

Parse.Cloud.afterSave("Message", function(req, res) {

    // Set the latest message on the conversation
    var conversation = req.object.get("conversation");
    conversation.set("lastMessage", req.object);
    conversation.set("date", Date());
    conversation.save();

    // Create a listing of type want
    if (req.object.get("product")) {
        var listing = new object.Listing();
        listing.set("product", req.object.get("product"));
        listing.set("user", req.user);
        listing.set("type", "want");
    }

});


Parse.Cloud.beforeSave("Message", function(req, res) {

    var errors = [];

    // User needs to be logged in
    if (!req.user) {
        errors.push("user not logged in");
    }

    // The body can't be empty
    if (!req.object.get("body").replace(" ", "")) {
        errors.push("message body missing");
    }

    if (!req.object.get("product") && !req.object.get("conversation"))  {
        errors.push("message conversation missing");
    }

    if (errors.length) {
        res.error(errors[0]);
    } else {

        req.object.set("user", req.user);
        req.object.set("date", Date());

        if (req.object.get("conversation")) {

            res.success();

        } else if (req.object.get("product")) {

            // Message must be assigned to a conversation
            var query = new Parse.Query(object.Conversation);
            query.containsAll("users", [req.user, req.object.get("to")]);
            query.find().then(function(conversations) {
                if (conversations.length) {

                    // Assign the message to an existing conversation
                    req.object.set("conversation", conversations[0]);

                    res.success();

                } else {

                    // Create a new conversation
                    var conversation = new object.Conversation();
                    conversation.set("users", [req.user, req.object.get("to")]);
                    conversation.save().then(function(conversation) {

                        // Assign the message to the new conversation
                        req.object.set("conversation", conversation);
                        res.success();

                    }, function() {
                        res.error();
                    });

                }
            }, function() {
                res.error();
            })

        }

    }

});


Parse.Cloud.beforeSave("Comment", function(req, res) {

    var errors = [];

    // User needs to be logged in
    if (!req.user) {
        errors.push("user not logged in");
    }

    // The body can't be empty
    if (!req.object.get("body").replace(" ", "")) {
        errors.push("comment body missing");
    }

    if (errors.length) {
        res.error(errors[0]);
    } else {
        req.object.set("user", req.user);
        req.object.set("date", Date());
        res.success();
    }

});

Parse.Cloud.afterSave("Comment", function(req) {

    var productId = req.object.get("product").id;

    var query = new Parse.Query(object.Product);

    query
        .get(productId)
        .done(function(product) {
            product.increment("comments");
            product.save();
        })

});
