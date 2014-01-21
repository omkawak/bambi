var _ = require("underscore");

// Recursive .toJSON function
Parse.Object.prototype.toJSON = function() {
    var json = _.clone(this.attributes);
    for (var attr in json) {
        if ((json[attr] instanceof Parse.Object) || (json[attr] instanceof Parse.Collection)) {
            json[attr] = json[attr].toJSON();
        }
    }
    json.id = this.id;
    return json;
};

exports.Comment = Parse.Object.extend("Comment");
exports.Product = Parse.Object.extend("Product");
exports.User = Parse.Object.extend("User");
exports.Follow = Parse.Object.extend("Follow");
exports.Like = Parse.Object.extend("Like");
exports.Listing = Parse.Object.extend("Listing");
exports.Message = Parse.Object.extend("Message");
exports.Conversation = Parse.Object.extend("Conversation");
