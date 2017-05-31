"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function register(library, options) {
    library.dialog('itemSearch', createDialog(options));
}
exports.register = register;
function createDialog(options) {
    var dialog = [
        function (session, args, next) {
            session.endDialog('I will eventually refine your search, but I don\'t know how to do that yet.');
        }
    ];
    return dialog;
}
//# sourceMappingURL=refineSearch.js.map