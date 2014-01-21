define(function(require) {

    'use strict';

    /**
     * Module dependencies
     */

    var defineComponent = require('flight/lib/component');

    /**
     * Module exports
     */

    return defineComponent(listings);

    /**
     * Module function
     */

    function listings() {

        this.defaultAttrs({

        });

        var Listing = Parse.Object.extend("Listing");
        var Product = Parse.Object.extend("Product");
        var User = Parse.Object.extend("User");
        var Follow = Parse.Object.extend("Follow");

        /**
         * Get the listings listed or relisted by users
         * nearby the current logged in user
         * @trigger {Event} dataDiscoverListings
         */
        this.fetchDiscoverListings = function(e, data) {

            var _self;
            var query;
            var queryProducts;
            var queryUserProducts;

            _self = this;

            // fetch the listings listed or relisted by the followees
            query = new Parse.Query(Listing);
            query.containedIn("type", ["list", "relist"]);
            query.include("user");
            query.include("product");
            query.include("product.user");
            query.include("product.currency");

            queryUserProducts = new Parse.Query(Product);
            queryUserProducts.equalTo("user", Parse.User.current());

            // Filter out products created by the current user
            query.doesNotMatchQuery("product", queryUserProducts);

            query.find().done(function(listings) {
                var discoverListings = [];
                _.each(listings, function(listing) {
                    discoverListings.push(listing.toJSON());
                })
                _self.trigger('dataDiscoverListings', {
                    discoverListings: discoverListings
                });
            });

        };

        /**
         * Get the listings listed or relisted by
         * a specific user identified by userId
         * @param  {String} userId
         * @trigger {Event} dataUserListings
         */
        this.fetchUserListings = function(e, data) {

            var _self;
            var query;
            var queryFollowees;
            var queryUserProducts;

            _self = this;

            var user = new User();
            user.id = data.userId;

            // fetch the listings listed or relisted by the followees
            query = new Parse.Query(Listing);
            query.containedIn("type", ["list", "relist"]);
            query.equalTo("user", user);
            query.include("user");
            query.include("product");
            query.include("product.user");
            query.include("product.currency");

            if (data.userId !== Parse.User.current().id) {

                queryUserProducts = new Parse.Query(Product);
                queryUserProducts.equalTo("user", Parse.User.current());

                // Filter out products created by the current user
                query.doesNotMatchQuery("product", queryUserProducts);

            }

            query.find().done(function(listings) {
                var userListings = [];
                _.each(listings, function(listing) {
                    userListings.push(listing.toJSON());
                })
                _self.trigger('dataUserListings', {
                    userListings: userListings
                });
            });

        };

        /**
         * Get the listings listed or relisted by users
         * followed by the current logged in user
         * @trigger {Event} dataTimelineListings
         */
        this.fetchTimelineListings = function(e, data) {

            var _self;
            var query;
            var queryFollowees;
            var queryUserProducts;

            _self = this;

            // retrieve the current user followees
            queryFollowees = new Parse.Query(Follow);
            queryFollowees.equalTo("user", Parse.User.current());

            // fetch the listings listed or relisted by the followees
            query = new Parse.Query(Listing);
            query.containedIn("type", ["list", "relist"]);
            query.matchesKeyInQuery("user", "followee", queryFollowees);
            query.include("user");
            query.include("product");
            query.include("product.user");
            query.include("product.currency");

            queryUserProducts = new Parse.Query(Product);
            queryUserProducts.equalTo("user", Parse.User.current());

            // Filter out products created by the current user
            query.doesNotMatchQuery("product", queryUserProducts);

            query.find().done(function(listings) {
                var timelineListings = [];
                _.each(listings, function(listing) {
                    timelineListings.push(listing.toJSON());
                })
                _self.trigger('dataTimelineListings', {
                    timelineListings: timelineListings
                });
            });

        };

        this.after('initialize', function() {
            this.on('uiNeedsUserListings', this.fetchUserListings);
            this.on('uiNeedsDiscoverListings', this.fetchDiscoverListings);
            this.on('uiNeedsTimelineListings', this.fetchTimelineListings);
        });

    }

});
