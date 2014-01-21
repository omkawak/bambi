define(function(require) {

    'use strict';

    /**
     * Module dependencies
     */

    var defineComponent = require('flight/lib/component');
    var Ractive = require('/bower_components/ractive/build/Ractive.min.js');
    var template = require('text!template/product.html');

    /**
     * Module exports
     */

    return defineComponent(product);

    /**
     * Module function
     */

    function product() {

        this.defaultAttrs({
            newCommentButtonSelector: '#product-comment-submit',
            newCommentTextareaSelector: '#product-comment-textarea',
            signInButtonSelector: '.callout-login button',
            relistButtonSelector: '#product-relist',
            likeButtonSelector: '#product-like',
            buyButtonSelector: '#product-buy'
        });

        /**
         * Initiate "relist" process
         * @trigger {Event} uiRelistProductAction
         */
        this.relist = function() {
            this.trigger('uiRelistProductAction', {
                productId: this.r.get("product").id
            });
        };


        /**
         * Initiate "like" process
         * @trigger {Event} uiLikeProductAction
         */
        this.like = function() {
            this.trigger('uiLikeProductAction', {
                productId: this.r.get("product").id
            });
        };

        /**
         * Initiate "buy" process
         * @trigger {Event} uiBuyProductAction
         */
        this.buy = function() {
            this.trigger('uiBuyProductAction', {
                productId: this.r.get("product").id
            });
        };

        this.resetProduct = function() {
            this.r.set('product', {});
            this.r.set('comments', []);
        };

        this.setProduct = function(e, data) {

            // Request comments
            this.trigger('uiNeedsProductCommentsData', {
                productId: data.product.id
            });

            // Render product
            this.r.set('product', data.product);

        };

        this.setCurrentUser = function(e, data) {
            this.r.set('currentUser', data.currentUser);
            this.select('newCommentTextareaSelector').autosize();
        };

        this.setProductComments = function(e, data) {
            this.r.set('comments', data.productComments);
        };

        this.sendComment = function(e, data) {
            var $textarea = this.select('newCommentTextareaSelector');
            var commentBody = $textarea.val();
            if (commentBody) {
                this.trigger('uiSendProductCommentAction', {
                    comment: {
                        productId: this.r.get("product").id,
                        body: commentBody
                    }
                });
            }
        };

        this.resetNewComment = function(e, data) {
            var product = this.r.get('product');
            product.comments++;
            this.r.set('product', product);
            var $textarea = this.select('newCommentTextareaSelector');
            $textarea.val("").trigger('autosize.resize');
            $textarea.blur();
        };

        this.requestLogin = function(e, data) {
            this.trigger('uiHeaderOpenLoginModal');
        };

        this.buy = function(e, data) {
            this.trigger('uiBuyAction', {
                product: this.r.get('product')
            });
        };

        this.after('initialize', function() {

            this.r = new Ractive({
                el: this.$node,
                template: template,
                data: {}
            });

            this.on(document, 'dataProduct', this.setProduct);
            this.on(document, 'dataProductComments', this.setProductComments);
            this.on(document, 'uiNeedsDataProduct', this.resetProduct);
            this.on(document, 'uiProductSentComment', this.resetNewComment);
            this.on(document, 'dataCurrentUser', this.setCurrentUser);

            this.on('click', {
                newCommentButtonSelector: this.sendComment,
                signInButtonSelector: this.requestLogin,
                buyButtonSelector: this.buy
            });

        });

    }

});
