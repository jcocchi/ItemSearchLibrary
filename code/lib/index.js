"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var builder = require("botbuilder");
var initialSearchDialog = require("./dialogs/initialSearch");
var refineSearchDialog = require("./dialogs/refineSearch");
var lib = new builder.Library('itemSearch');
var ItemPromptType;
(function (ItemPromptType) {
    ItemPromptType[ItemPromptType["choice"] = 0] = "choice";
    ItemPromptType[ItemPromptType["text"] = 1] = "text";
    ItemPromptType[ItemPromptType["number"] = 2] = "number";
    ItemPromptType[ItemPromptType["confirm"] = 3] = "confirm";
})(ItemPromptType = exports.ItemPromptType || (exports.ItemPromptType = {}));
exports.createLibrary = function (options) {
    initialSearchDialog.register(lib, options);
    refineSearchDialog.register(lib, options);
    return lib;
};
exports.itemSearchDialog = function (session) {
    return session.beginDialog('itemSearch:initialSearch');
};
//# sourceMappingURL=index.js.map