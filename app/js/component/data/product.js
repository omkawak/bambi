define(function(require) {

    'use strict';

    /**
     * Module dependencies
     */

    var defineComponent = require('flight/lib/component');

    /**
     * Module exports
     */

    return defineComponent(product);

    /**
     * Module function
     */

    function product() {

        this.fetchProduct = function(e, data) {

            var _self = this;

            var Product = Parse.Object.extend("Product");
            var query = new Parse.Query(Product);

            query.include("user");
            query.include("currency");

            query
                .get(data.productId)
                .done(function(product) {
                    _self.trigger("dataProduct", {
                        product: product.toJSON()
                    });
                });

        };

        this.fetchProductComments = function(e, data) {

            var _self = this;

            var Comment = Parse.Object.extend("Comment");
            var Product = Parse.Object.extend("Product");

            var product = new Product();
            product.id = data.productId;

            var query = new Parse.Query(Comment);

            query.include("user");
            query.equalTo("product", product);
            query.ascending("createdAt");

            query
                .find()
                .done(function(comments) {
                    var json = [];
                    _.each(comments, function(comment) {
                        json.push(comment.toJSON());
                    });
                    _self.trigger("dataProductComments", {
                        productComments: json
                    });
                });

        };

        this.sendProductComment = function(e, data) {

            var _self = this;

            var Comment = Parse.Object.extend("Comment");
            var Product = Parse.Object.extend("Product");

            var product = new Product();
            product.id = data.comment.productId;

            var comment = new Comment();
            comment.set("product", product);
            comment.set("body", data.comment.body);

            comment
                .save()
                .done(function() {
                    _self.trigger('uiProductSentComment');
                    _self.trigger('uiNeedsProductCommentsData', {
                        productId: data.comment.productId
                    });
                });

        };

        this.after('initialize', function() {
            this.on('uiNeedsProductData', this.fetchProduct);
            this.on('uiNeedsProductCommentsData', this.fetchProductComments);
            this.on('uiSendProductCommentAction', this.sendProductComment);
        });

    }

});
