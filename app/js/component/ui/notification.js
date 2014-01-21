define(function (require) {

  'use strict';

  /**
   * Module dependencies
   */

  var defineComponent = require('flight/lib/component');

  /**
   * Module exports
   */

  return defineComponent(ui/notification);

  /**
   * Module function
   */

  function ui/notification() {
    this.defaultAttrs({

    });

    this.after('initialize', function () {

    });
  }

});
