var _ = require("underscore");
var object = require("cloud/object.js");

var PRODUCTS_PER_PAGE = 20;

/**
 * Get a product's feed
 * @param {String} productId
 * @param {String} page
 */
function getProductFeed(req, res) {

    var query = new Parse.Query(object.Product);

    query.include("user");
    query.include("currency");

    query.get(req.params.productId, {
        success: function(product) {
        	var json = [];
        	json.push(product.toJSON());
            res.success(json);
        },
        error: function(object, error) {
            res.error("product lookup failed");
        }
    });

}

/**
 * Get a user's feed
 * @param {String} userId
 * @param {String} page
 */
function getUserFeed(req, res) {

    var query = new Parse.Query(object.Product);

    var user = new object.User();
    user.id = req.params.userId;

    query.include("user");
    query.include("currency");

    query.equalTo("user", user);

    query.find({
        success: function(products) {
        	var json = [];
        	_.each(products, function(product){
        		json.push(product.toJSON());
        	})
            res.success(json);
        },
        error: function(object, error) {
            res.error("product lookup failed");
        }
    });


}

/**
 * Get the connected user's feed
 * @param {String} page
 */

function getFeed(req, res) {

    var query = new Parse.Query(object.Product);

    query.include("user");
    query.include("currency");

    query.find({
        success: function(products) {
        	var json = [];
        	_.each(products, function(product){
        		json.push(product.toJSON());
        	})
            res.success(json);
        },
        error: function(object, error) {
            res.error("product lookup failed");
        }
    });

}

/**
 * Get a feed specified by type
 * @param {String} userId
 * @param {String} productId
 * @param {String} type
 * @param {String} page
 */
var get = function(req, res) {

    var type = req.params.type;

    switch (type) {

        case "product":
            getProductFeed(req, res);
            break;

        case "user":
            getUserFeed(req, res);
            break;

        default:
            getFeed(req, res);
            break;

    }

};

exports.get = get;
