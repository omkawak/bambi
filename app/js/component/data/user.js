define(function(require) {

    'use strict';

    /**
     * Module dependencies
     */

    var defineComponent = require('flight/lib/component');

    /**
     * Module exports
     */

    return defineComponent(user);

    /**
     * Module function
     */

    function user() {

        this.defaultAttrs({

        });

        this.followUser = function(e, data) {

            var Follow = Parse.Object.extend("Follow");
            var User = Parse.Object.extend("User");

            var user = new User();
            user.id = data.userId;

            var follow = new Follow();
            follow.set("followee", user);

            follow
                .save();

        };

        this.fetchLatestUserData = function(e, data) {
            data.forceFetch = true;
            this.fetchUserData(e, data);
        };

        this.fetchUserData = function(e, data) {

            var _self = this;

            // Try to retrieve user from cache
            var localUser = _.findWhere(this.users, {
                id: data.userId
            });

            // Retrieve the user remotely
            if (data.forceFetch || this.users) {
                var query = new Parse.Query("User");
                query
                    .get(data.userId)
                    .done(function(user) {
                        // Broadcast remote user and update local collection
                        _self.broadcastUserData(user.toJSON());
                        _self.users.push(user);
                    });
            } else {
                this.broadcastUserData(localUser);
            }

        };

        this.broadcastUserData = function(userData) {
            this.trigger('dataUser', {
                user: userData
            });
        };

        this.after('initialize', function() {
            this.users = [];
            this.on('uiNeedsUserData', this.fetchUserData);
            this.on('uiNeedsLatestUserData', this.fetchLatestUserData);
            this.on('uiFollowAction', this.followUser);
        });

    }

});
