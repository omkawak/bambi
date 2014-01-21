define(function(require) {

    'use strict';

    /**
     * Module dependencies
     */

    var defineComponent = require('flight/lib/component');
    var Ractive = require('/bower_components/ractive/build/Ractive.min.js');
    var template = require('text!template/messages.html');

    /**
     * Module exports
     */

    return defineComponent(messages);

    /**
     * Module function
     */

    function messages() {

        this.defaultAttrs({

        });

        this.setConversation = function(e, data) {
            this.r.set("conversation", data.message);
        };

        this.setConversations = function(e, data) {
            this.r.set("conversations", data.messages);
        };

        this.after('initialize', function() {

            this.r = new Ractive({
                el: this.$node,
                template: template,
                data: {}
            });

            this.on(document, 'dataMessages', this.setConversations);
            this.on(document, 'dataMessage', this.setConversation);

        });
    }

});
