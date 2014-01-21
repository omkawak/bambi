var object = require("cloud/object.js");

/**
 * Checks the existence of a specific object
 * @param  {String} objectName
 * @param  {String} objectId
 * @return {Promise}
 */
var needs = function(objectName, objectId) {

    var promise = new Parse.Promise();

    var query = new Parse.Query(object[objectName]);

    query
        .get(objectId)
        .then(function(object) {
            promise.resolve(object);
        }, function() {
            promise.reject();
        });

    return promise;

};

exports.Product = function(productId){
    return needs("Product", productId);
};

exports.User = function(userId){
    return needs("User", userId);
};