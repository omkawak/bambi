define(function(require) {

    'use strict';

    /**
     * Module dependencies
     */

    var defineComponent = require('flight/lib/component');

    /**
     * Module exports
     */

    return defineComponent(me);

    /**
     * Module function
     */

    function me() {

        /**
         * Retrieve current user profile
         * from Parse servers
         * @return {Promise}
         */
        this.fetchCurrentUser = function() {

            var _self = this;

            // Create the object.
            var User = Parse.Object.extend("User");
            var query = new Parse.Query(User);

            return query.get(Parse.User.current().id, {
                success: function(user) {
                    _self.broadcastCurrentUser(user.toJSON());
                }
            });

        };

        /**
         * Broadcast current user data
         * @param  {Object} user
         * @return {this}
         */
        this.broadcastCurrentUser = function(user) {
            this.trigger('dataCurrentUser', {
                currentUser: user
            });
            return this;
        };

        /**
         * Log in the current user using
         * his Facebook credentials
         */
        this.loginWithFacebook = function() {
            var _self = this;
            return Parse.FacebookUtils.logIn(null, {
                success: function(user) {
                    _self.trigger('uiMeLoggedIn');
                    FB.api('/me', function(facebookUser) {
                        FB.api('/me/picture', {
                            redirect: false,
                            height: 400,
                            width: 400,
                            type: 'normal'
                        }, function(response) {
                            facebookUser.imageUrl = response.data.url;
                            _self.updateCurrentUserWithFacebookData(facebookUser);
                        });
                    });
                },
                error: function(user, error) {}
            });
        };

        /**
         * Update the current user with the latest
         * data fetched from Facebook
         * @param  {Object} facebookUser
         * @return {Promise}
         */
        this.updateCurrentUserWithFacebookData = function(facebookUser) {

            var _self = this;

            // Create the object.
            var User = Parse.Object.extend("User");
            var user = new User();

            user.id = Parse.User.current().id;
            user.set("firstName", facebookUser.first_name);
            user.set("lastName", facebookUser.last_name);
            user.set("imageUrl", facebookUser.imageUrl);

            if (facebookUser.location) {
                user.set("location", facebookUser.location.name);
            }

            return user.save(null, {
                success: function(user) {
                    _self.fetchCurrentUser();
                }
            });

        };

        this.logout = function() {
            Parse.User.logOut();
            this.trigger('uiMeLoggedOut');
            this.trigger('dataCurrentUser', {
                currentUser: null
            });
        };

        this.after('initialize', function() {

            this.on('uiLoginWithFacebookAction', this.loginWithFacebook);
            this.on('uiLogoutAction', this.logout);

            // Trigger logging in events
            // if the user is already logged in
            if (Parse.User.current()) {
                this.trigger('uiMeLoggedIn');
                this.fetchCurrentUser();
            }

        });

    }

});
