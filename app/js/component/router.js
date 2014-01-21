define(function(require) {

    'use strict';

    /**
     * Module dependencies
     */

    var defineComponent = require('flight/lib/component');

    /**
     * Module exports
     */

    return defineComponent(router);

    /**
     * Module function
     */

    function router() {
        this.defaultAttrs({

        });

        this.redirect = function(e, data) {

        };

        this.openView = function(viewId) {
            this.$node.trigger('uiViewsOpenView', {
                viewId: viewId
            });
        };

        this.after('initialize', function() {

            var _self = this;

            this.app = Davis(function() {

                this.configure(function() {
                    this.generateRequestOnPageLoad = true
                });

                this.get('/', function(req) {
                    this.redirect('/shop');
                });

                this.get('/sell', function(req) {
                    _self.trigger('uiUploadAction');
                });

                this.get('/logout', function(req) {
                    _self.trigger('uiLogoutAction');
                    this.redirect('/shop');
                });

                this.get('/messages', function(req) {
                    _self.trigger('uiNeedsMessagesData');
                    _self.openView('messagesView');
                });


                this.get('/messages/:messageId', function(req) {
                    _self.trigger('uiNeedsMessageData',   {
                        messageId: req.params.messageId
                    });
                    _self.openView('messagesView');
                });

                /** Display the current user's timeline */
                this.get('/shop', function(req) {
                    _self.trigger('uiNeedsTimelineListings');
                    _self.openView('shopView');
                });

                /** Display listings nearby the current user */
                this.get('/discover', function(req) {
                    _self.trigger('uiNeedsDiscoverListings');
                    _self.openView('discoverView');
                });

                /** Display filtered listings nearby the current user */
                this.get('/discover/:category', function(req) {
                    _self.trigger('uiNeedsDiscoverListings', {
                        category: req.params.category
                    });
                    _self.openView('discoverView');
                });

                this.get('/u/:userId', function(req) {

                    _self.trigger('uiNeedsUserData', {
                        userId: req.params.userId
                    });

                    _self.trigger('uiNeedsUserListings', {
                        userId: req.params.userId
                    });

                    _self.openView('userView');

                });

                this.get('/p/:productId', function(req) {

                    _self.trigger('uiNeedsProductData', {
                        productId: req.params.productId
                    });

                    _self.openView('product');

                });

            })

            this.app.start();

        });
    }

});
