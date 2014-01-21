define(function(require) {

    'use strict';

    /**
     * Module dependencies
     */

    var defineComponent = require('flight/lib/component');
    var template = require('text!template/upload.html');

    /**
     * Module exports
     */

    return defineComponent(upload);

    /**
     * Module function
     */

    function upload() {

        this.defaultAttrs({
            uploadImageSelector: '.product-image-input',
            uploadImageButtonSelector: '.btn-upload',
            uploadImageInputSelector: '#newProductImage',
            thumbnailImageSelector: '.product-image-thumbnail',
            submitButtonSelector: '[data-upload-submit]',

            descriptionInputSelector: '#inputProductDescription',
            imageInputSelector: '#inputProductImageUrl',
            priceInputSelector: '#inputProductPrice'


        });

        this.renderThumbnail = function(file) {
            this.select('thumbnailImageSelector').children('img').attr('src', file.url());
            this.select('uploadImageSelector').hide();
            this.select('thumbnailImageSelector').show();

            this.select('imageInputSelector').val(file.url());

        };

        /**
         * Upload the picture to parse and
         * store the reference for future use
         */
        this.uploadPicture = function() {

            var fileUploadControl = this.select('uploadImageInputSelector')[0];

            if (fileUploadControl.files.length > 0) {

                var file = fileUploadControl.files[0];
                var name = file.name;

                var parseFile = new Parse.File(name, file);

                parseFile
                    .save()
                    .then($.proxy(this.renderThumbnail, this));

            }

            return this;

        };

        /**
         * Extract form values and send them to
         * server for processing
         * @return {Promise}
         */
        this.submit = function() {

            var _self = this;

            var description = this.select('descriptionInputSelector').val();
            var price = Number(this.select('priceInputSelector').val());
            var imageUrl = this.select('imageInputSelector').val();

            return Parse.Cloud.run('post', {
                description: description,
                price: price,
                imageUrl: imageUrl
            }).done(function() {
                _self.trigger('uiModalClose');
            });

        };

        /**
         * Open a brower prompt for user
         * to select a picture
         */
        this.selectPicture = function() {
            this.select('uploadImageInputSelector').trigger('click');
            return this;
        };

        this.after('initialize', function() {

            this.$node.html(template);

            this.select('thumbnailImageSelector').hide();

            this.on('click', {
                uploadImageButtonSelector: this.selectPicture,
                submitButtonSelector: this.submit
            });

            this.on('change', {
                uploadImageInputSelector: this.uploadPicture
            })

        });
    }

});
