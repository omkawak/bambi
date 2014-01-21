define(function(require) {

    'use strict';

    /**
     * Module dependencies
     */

    var defineComponent = require('flight/lib/component');
    var html = require('text!template/window/upload.html')

    /**
     * Module exports
     */

    return defineComponent(upload);

    /**
     * Module function
     */

    function upload() {

        this.defaultAttrs({
            descriptionTextareaSelector: '#window-upload-description'
        });

        /**
         * Open a fresh upload window
         * @trigger {Event} uiWindowOpen
         */
        this.openWindow = function(e, data) {
            this.select('descriptionTextareaSelector').val("").autosize();
            this.trigger('uiWindowOpen');
            return false;
        };

        this.after('initialize', function() {
            this.$node.html(html);
            this.on(document, 'uiUploadAction', this.openWindow);
        });

    }

});
