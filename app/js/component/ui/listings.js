define(function(require) {

    'use strict';

    /**
     * Module dependencies
     */

    var defineComponent = require('flight/lib/component');
    var Ractive = require('/bower_components/ractive/build/Ractive.min.js');
    var template = require('text!template/listings.html');

    /**
     * Module exports
     */

    return defineComponent(listings);

    /**
     * Module function
     */

    function listings() {

        this.defaultAttrs({
            listingsSelector: '.listings',
            listingSelector: '.listings .listing'
        });

        this.relayout = function() {

            var $container = this.select('listingsSelector');
            var handler = this.select('listingSelector');

            // Prepare layout options.
            var options = {
                autoResize: true, // This will auto-update the layout when the browser window is resized.
                container: $container, // Optional, used for some extra CSS styling
                offset: 15, // Optional, the distance between grid items
                outerOffset: 15,
                flexibleWidth: 236 // Optional, the maximum width of a grid item
            };

            // Call the layout function.
            handler.wookmark(options);
        };

        /**
         * Normalize a timeline listings object and
         * renders it
         * @param {Object} timelineListings
         */
        this.setTimelineListings = function(e, data) {
            this.setListings(e, {
                listings: data.timelineListings
            });
        };

        /**
         * Normalize a user listings object and
         * renders it
         * @param {Object} userListings
         */
        this.setUserListings = function(e, data) {
            this.setListings(e, {
                listings: data.userListings
            });
        };

        /**
         * Normalize a discover listings object and
         * renders it
         * @param {Object} discoverListings
         */
        this.setDiscoverListings = function(e, data) {
            this.setListings(e, {
                listings: data.discoverListings
            });
        };

        /**
         * Renders a listings object
         * @param {[type]} e    [description]
         * @param {[type]} data [description]
         */
        this.setListings = function(e, data) {
            this.r.set("listings", data.listings);
            this.relayout();
        };

        this.after('initialize', function() {

            this.listingsType = this.$node.data('listings-type');

            this.r = new Ractive({
                el: this.$node,
                template: template,
                data: {}
            });

            switch (this.listingsType) {
                case 'timeline':
                    this.r.set('timelineType', true);
                    this.on(document, 'dataTimelineListings', this.setTimelineListings);
                    break;
                case 'user':
                    this.r.set('userType', true);
                    this.on(document, 'dataUserListings', this.setUserListings);
                    break;
                case 'discover':
                    this.r.set('discoverType', true);
                    this.on(document, 'dataDiscoverListings', this.setDiscoverListings);
                    break;
            }

        });

    }

});
