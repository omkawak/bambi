define(function(require) {

    'use strict';

    /**
     * Module dependencies
     */

    var defineComponent = require('flight/lib/component');
    var Ractive = require('/bower_components/ractive/build/Ractive.min.js');
    var template = require('text!template/user.html');

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

        this.render = function(e, data) {
            var user = data.user;
            this.r.set("user", user);
        };

        this.follow = function(e, data) {
            this.trigger('uiFollowAction', {
                userId: this.r.get("user").id
            });
        };

        this.unfollow = function(e, data) {

        };

        this.after('initialize', function() {

            this.r = new Ractive({
                el: this.$node,
                template: template,
                data: {}
            });

            this.on(document, 'dataUser', this.render);

        });

    }

});
