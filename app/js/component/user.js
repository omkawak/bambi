define(function(require) {

    'use strict';

    /**
     * Module dependencies
     */

    var defineComponent = require('flight/lib/component');
    var Ractive = require('/bower_components/ractive/build/Ractive.min.js');
    var template = require('text!template/user.html');
    var _ = require('lodash');

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
            var _self = this;
            if (data.userId != this.userId) {
                this.reset();
                this.userId = data.userId;
                Parse.Cloud.run('getUser', {
                    userId: this.userId
                }, {
                    success: function(user) {
                        console.log(user)
                        _self.r.set('user', user);
                    },
                    error: function(error) {}
                });
            }
        };

        this.reset = function() {
            this.r.set('user', {});
        };

        this.after('initialize', function() {

            this.r = new Ractive({
                el: this.$node,
                template: template,
                data: {}
            });

            this.reset();

            this.on('uiUserRender', this.render);

        });
    }

});
