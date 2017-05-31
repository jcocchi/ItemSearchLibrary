"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var builder = require("botbuilder");
var itemSearchDialog = require("./dialogs/initialSearch");
var refineSearchDialog = require("./dialogs/refineSearch");
var lib = new builder.Library('itemSearch');
var options;
var ItemPromptType;
(function (ItemPromptType) {
    ItemPromptType[ItemPromptType["choice"] = 0] = "choice";
    ItemPromptType[ItemPromptType["text"] = 1] = "text";
    ItemPromptType[ItemPromptType["number"] = 2] = "number";
    ItemPromptType[ItemPromptType["confirm"] = 3] = "confirm";
})(ItemPromptType = exports.ItemPromptType || (exports.ItemPromptType = {}));
exports.createLibrary = function (ops) {
    options = ops;
    itemSearchDialog.register(lib, options);
    refineSearchDialog.register(lib, options);
    return lib;
};
exports.itemSearchDialog = function (session) {
    return session.beginDialog('itemSearch:initialSearch', options);
};
//# sourceMappingURL=index.js.map