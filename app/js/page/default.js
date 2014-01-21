define(function(require) {

    'use strict';

    /**
     * Module dependencies
     */


    var dataMeComponent = require('component/data/me');
    var dataProductComponent = require('component/data/product');
    var dataUserComponent = require('component/data/user');

    var uiProductComponent = require('component/ui/product');
    var uiUserComponent = require('component/ui/user');

    var userComponent = require('component/user');

    var uploadComponent = require('component/upload');
    var headerComponent = require('component/header');

    var windowComponent = require('component/window');

    var viewsComponent = require('component/views');

    /**
     * v1.0.0
     */

    var uiListingsComponent = require('component/ui/listings');
    var uiMessagesComponent = require('component/ui/messages');
    var dataListingsComponent = require('component/data/listings');
    var dataMessagesComponent = require('component/data/messages');
    var windowBuyComponent = require('component/window/buy');
    var windowUploadComponent = require('component/window/upload');    
    var routerComponent = require('component/router');
    var splashComponent = require('component/splash');

    /**
     * Module exports
     */

    return initialize;

    /**
     * Module function
     */

    function initialize() {

        userComponent.attachTo('[data-user]');
        uploadComponent.attachTo('[data-upload]');
        headerComponent.attachTo('header');

        windowComponent.attachTo('[data-window]');

        viewsComponent.attachTo('#views');

        // ui
        uiProductComponent.attachTo('#product');
        uiUserComponent.attachTo('#user');

        // data
        dataMeComponent.attachTo(document);
        dataProductComponent.attachTo(document);
        dataUserComponent.attachTo(document);

        /**
         * v1.0.0
         */

        // window
        windowBuyComponent.attachTo('#window-buy');
        windowUploadComponent.attachTo('#window-upload');

        // ui
        uiListingsComponent.attachTo('[data-listings]');
        uiMessagesComponent.attachTo('#messages');

        // data
        dataListingsComponent.attachTo(document);
        dataMessagesComponent.attachTo(document);

        splashComponent.attachTo('#splash');
        routerComponent.attachTo(document);


    }

});
