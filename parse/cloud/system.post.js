var object = require("cloud/object.js");

/**
 * Post a new product
 * @param {String} imageUrl
 * @param {String} description
 * @param {Number} price
 */
var add = function(req, res) {

    if (req.user) {

        var product = new object.Product;

        product.set("description", req.params.description);
        product.set("price", req.params.price);
        product.set("imageUrl", req.params.imageUrl);
        product.set("likes", 0);
        product.set("comments", 0);
        product.set("user", req.user);

        product.save().then(function(product) {
            res.success(product.toJSON());
        }, function() {
            res.error("product save failed");
        });

    } else {

        res.error("session missing");

    }

};

exports.add = add;
