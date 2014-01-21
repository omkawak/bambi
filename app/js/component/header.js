define(function(require) {

    'use strict';

    /**
     * Module dependencies
     */

    var defineComponent = require('flight/lib/component');
    var Ractive = require('/bower_components/ractive/build/Ractive.min.js');
    var template = require('text!template/header.html');

    /**
     * Module exports
     */

    return defineComponent(header);

    /**
     * Module function
     */

    function header() {

        this.defaultAttrs({
            browseButtonSelector: '#header-browse-btn',
            searchButtonSelector: '#header-search-btn',
            userButtonSelector: '#header-user-btn',
            categoriesFlyoutSelector: '.navigation-flyout-categories',
            userFlyoutSelector: '.navigation-flyout-user',
            loginWindowSelector: '#window-login'
        });

        this.showCategoriesFlytout = function() {
            $(this.attr.categoriesFlyoutSelector).addClass('show');
            this.select('browseButtonSelector').addClass('active');
            this.categoriesFlyoutHidden = false;
            this.hideUserFlyout();
        };

        this.hideCategoriesFlyout = function() {
            $(this.attr.categoriesFlyoutSelector).removeClass('show');
            this.select('browseButtonSelector').removeClass('active');
            this.categoriesFlyoutHidden = true;
        };

        this.toggleCategoriesFlyout = function(e) {
            e.preventDefault();
            if (this.categoriesFlyoutHidden) {
                this.showCategoriesFlytout();
            } else {
                this.hideCategoriesFlyout();
            }
        };

        this.showUserFlyout = function() {
            $(this.attr.userFlyoutSelector).addClass('show');
            this.select('userButtonSelector').addClass('active');
            this.userFlyoutHidden = false;
            this.hideCategoriesFlyout();
        };

        this.hideUserFlyout = function() {
            $(this.attr.userFlyoutSelector).removeClass('show');
            this.select('userButtonSelector').removeClass('active');
            this.userFlyoutHidden = true;
        };

        this.toggleUserFlyout = function(e) {
            e.preventDefault();
            if (this.r.get("isLoggedIn")) {
                if (this.userFlyoutHidden) {
                    this.showUserFlyout();
                } else {
                    this.hideUserFlyout();
                }
            } else {
                this.trigger($(this.attr.loginWindowSelector), 'uiWindowOpen');
                this.hideCategoriesFlyout();
            }
        };
        
        this.logout = function(e, data) {
            this.r.set("isLoggedIn", false);
        };

        this.setCurrentUser = function(e, data) {
            if (data.currentUser) {
                this.r.set("isLoggedIn", true);
            }
            this.r.set("currentUser", data.currentUser);
        }

        this.after('initialize', function() {

            this.hideCategoriesFlyout();
            this.hideUserFlyout();

            this.r = new Ractive({
                el: this.$node,
                template: template,
                data: {}
            });

            this.on(document, 'uiMeLoggedOut', this.logout);

            this.on(document, 'dataCurrentUser', this.setCurrentUser);

            this.on(document, 'uiHeaderOpenLoginModal', this.toggleUserFlyout);

            this.on('click', {
                browseButtonSelector: this.toggleCategoriesFlyout,
                userButtonSelector: this.toggleUserFlyout
            });

        });

    }

});
