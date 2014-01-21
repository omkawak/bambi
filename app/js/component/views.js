define(function(require) {

    'use strict';

    /**
     * Module dependencies
     */

    var defineComponent = require('flight/lib/component');

    /**
     * Module exports
     */

    return defineComponent(views);

    /**
     * Module function
     */

    function views() {

        this.defaultAttrs({
            viewSelector: '.view'
        });

        this.openView = function(e, data) {
            this.select('viewSelector').hide();
            this.select('viewSelector').filter('#' + data.viewId).show();
        };

        this.after('initialize', function() {
            this.on(document, 'uiViewsOpenView', this.openView);
        });
    }

});
