define(function(require) {

    'use strict';

    /**
     * Module dependencies
     */

    var defineComponent = require('flight/lib/component');

    /**
     * Module exports
     */

    return defineComponent(window);

    /**
     * Module function
     */

    function window() {
        this.defaultAttrs({
            closeButtonSelector: '.window-close',
            overlaySelector: '#overlay'
        });

        this.open = function() {
            this.$node.addClass("show");
            this.$overlay.addClass("show");
        }

        this.close = function() {
            this.$node.removeClass("show");
            this.$overlay.removeClass("show");
        }

        this.after('initialize', function() {
            this.$overlay = $(this.attr.overlaySelector);
            this.on('uiWindowOpen', this.open);
            this.on('uiWindowClose', this.close);
            this.on('click', {
                closeButtonSelector: this.close
            });
            this.on(this.$overlay, 'click', this.close);
            this.on(document, 'uiWindowCloseAll', this.close);
        });
    }

});
