define(function(require) {

    'use strict';

    /**
     * Module dependencies
     */

    var defineComponent = require('flight/lib/component');

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

        var Conversation = Parse.Object.extend("Conversation");
        var Message = Parse.Object.extend("Message");

        /**
         * Get all the conversations for
         * the current user
         * @trigger {Event} dataMessages
         */
        this.fetchMessages = function(e, data) {

            var _self;
            var query;

            _self = this;

            // fetch the listings listed or relisted by the followees
            query = new Parse.Query(Conversation);
            query.equalTo("users", Parse.User.current());
            query.include("users");
            query.include("lastMessage");

            query.find().done(function(conversations) {
                var messages = [];
                _.each(conversations, function(conversation) {
                    var message = conversation.toJSON();
                    // Parse users
                    for (var i = 0; i < message.users.length; i++) {
                        message.users[i] = message.users[i].toJSON();
                        // Assign the message to the destinataire
                        if (message.users[i].id != Parse.User.current().id) {
                            message.user = message.users[i];
                        }
                    }
                    messages.push(message);
                });
                _self.messages = messages;
                _self.trigger('dataMessages', {
                    messages: messages
                });
            });

        };

        /**
         * Get a specific conversation from the
         * user's message box
         * @trigger {Event} dataMessage
         */
        this.fetchMessage = function(e, data) {

            var _self;
            var query;
            var conversation;

            _self = this;

            if(!this.messages) {
                this.fetchMessages();
            }

            // fetch the listings listed or relisted by the followees
            query = new Parse.Query(Message);
            query.include("user");
            query.include("product");
            query.include("product.currency");

            conversation = new Conversation();
            conversation.id = data.messageId;

            query.equalTo("conversation", conversation);

            query.find().done(function(messages) {
                var conversation = [];
                _.each(messages, function(message) {
                    conversation.push(message.toJSON());
                });
                _self.trigger('dataMessage', {
                    message: conversation
                });
            });

        };

        this.after('initialize', function() {
            this.on('uiNeedsMessagesData', this.fetchMessages);
            this.on('uiNeedsMessageData', this.fetchMessage);
        });
    }

});
