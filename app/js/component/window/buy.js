define(function(require) {

    'use strict';

    /**
     * Module dependencies
     */

    var defineComponent = require('flight/lib/component');
    var Ractive = require('/bower_components/ractive/build/Ractive.min.js');
    var template = require('text!template/window/buy.html');

    /**
     * Module exports
     */

    return defineComponent(buy);

    /**
     * Module function
     */

    function buy() {

        this.defaultAttrs({
            buyButtonSelector: '#window-buy-submit',
            buyTextareaSelector: '#window-buy-message'
        });

        var Message = Parse.Object.extend("Message");
        var Product = Parse.Object.extend("Product");
        var User = Parse.Object.extend("User");

        /**
         * Open a buy window for the current product
         * @trigger {Event} uiWindowOpen
         */
        this.openWindow = function(e, data) {
            this.select('buyTextareaSelector').val("");
            this.r.set('product', data.product);
            this.trigger('uiWindowOpen');
        };

        /**
         * Prepare and send a message to the
         * product's seller
         * @trigger {Event} uiWindowClose
         */
        this.buy = function(e, data) {

            var _self = this;

            var body = this.select('buyTextareaSelector').val();

            var product = new Product();
            var user = new User();
            var message = new Message();

            message.set("body", body);

            // Attach the product to the message
            product.id = this.r.get("product").id;
            message.set("product", product);

            // Attach the destinataire to the message
            user.id = this.r.get("product").user.id;
            message.set("to", user);

            message
                .save()
                .done(function() {
                    _self.trigger('uiWindowClose');
                });

        };

        this.after('initialize', function() {

            this.r = new Ractive({
                el: this.$node,
                template: template,
                data: {}
            });

            this.on(document, 'uiBuyAction', this.openWindow);

            this.on('click', {
                buyButtonSelector: this.buy
            });

        });

    }

});
