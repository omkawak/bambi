define(function(require) {

    'use strict';

    /**
     * Module dependencies
     */

    var defineComponent = require('flight/lib/component');

    /**
     * Module exports
     */

    return defineComponent(splash);

    /**
     * Module function
     */

    function splash() {

        this.defaultAttrs({
            loginButtonSelector: '#splash-button-login'
        });

        /**
         * Dismiss the splash and
         * remove it from the DOM
         */
        this.dismiss = function() {
            var _self = this;
            _self.$node.addClass('dismissed');
            setTimeout(function(){
                _self.$node.remove();
                _self.teardown();
            }, 300);
        };

        /**
         * Broadcast current user data
         * @param  {Object} user
         * @return {this}
         */
        this.broadcastCurrentUser = function(user) {
            this.trigger('dataCurrentUser', {
                currentUser: user.toJSON()
            });
            return this;
        };

        /**
         * Update the current user with the latest
         * data fetched from Facebook
         * @param  {Object} facebookUser
         * @return {Promise}
         */
        this.updateCurrentUserWithFacebookData = function(parseUser, facebookUser) {

            var _self = this;

            parseUser.set("firstName", facebookUser.first_name);
            parseUser.set("lastName", facebookUser.last_name);
            parseUser.set("imageUrl", facebookUser.imageUrl);

            return parseUser.save().done(function(user) {
                _self.broadcastCurrentUser(parseUser);
                _self.dismiss();
            });

        };

        /**
         * Login the user
         * @return {Promise}
         */
        this.login = function() {
            var _self = this;
            return Parse.FacebookUtils.logIn(null, {
                success: function(user) {
                    FB.api('/me', function(facebookUser) {
                        FB.api('/me/picture', {
                            redirect: false,
                            height: 400,
                            width: 400,
                            type: 'normal'
                        }, function(response) {
                            facebookUser.imageUrl = response.data.url;
                            _self.updateCurrentUserWithFacebookData(user, facebookUser);
                        });
                    });
                }
            });
        };

        this.after('initialize', function() {

            this.select('completeScreenSelector').hide();

            this.on('click', {
                loginButtonSelector: this.login
            });

            if (Parse.User.current()) {
                // Dismiss the splash screen 
                // if the user is logged in
                this.dismiss();
            } else {
                // Show the login screen if the
                // user isn't
                this.$node.addClass('initialized');
            }

        });

    }

});
