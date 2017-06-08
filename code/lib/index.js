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
function createLibrary(options) {
    validateOptions(options);
    initialSearchDialog.register(lib, options);
    refineSearchDialog.register(lib);
    return lib;
}
exports.createLibrary = createLibrary;
;
function itemSearchDialog(session) {
    return session.beginDialog('itemSearch:initialSearch');
}
exports.itemSearchDialog = itemSearchDialog;
;
function validateOptions(options) {
    if (options.searchParameters.length < 1) {
        throw "You must pass in at least one search parameter.";
    }
    options.searchParameters.forEach(function (p) {
        if (p.type < 0 || p.type > 3) {
            throw "You must use a valid ItemPromptType value.";
        }
        else if (p.type == 0 && p.choices.length < 1) {
            throw "All choice types must also have an array of choices.";
        }
    });
    if (!options.searchFunction) {
        throw "'searchFunction' parameter missing";
    }
    return true;
}
;
//# sourceMappingURL=index.js.map