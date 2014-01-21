'use strict';

requirejs.config({
    baseUrl: '/',
    paths: {
        'flight': 'bower_components/flight',
        'component': 'js/component',
        'page': 'js/page',
        'text': 'bower_components/text/text',
        'lodash': 'bower_components/lodash/dist/lodash'
    }
});

require(
    [
        'flight/lib/compose',
        'flight/lib/registry',
        'flight/lib/advice',
        'flight/lib/logger',
        'flight/lib/debug'
    ],

    function(compose, registry, advice, withLogging, debug) {

        debug.enable(true);
        compose.mixin(registry, [advice.withAdvice, withLogging]);

        require(['page/default'], function(initializeDefault) {
            initializeDefault();
        });

    }
);
