"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var builder = require("botbuilder");
var generateCards_1 = require("./generateCards");
var index_1 = require("../index");
var options;
function register(library, options) {
    library.dialog('initialSearch', createDialog(options));
}
exports.register = register;
function createDialog(ops) {
    options = ops;
    var dialog = [
        function (session, args, next) {
            clearOptions();
            var firstParam = options.searchParameters[0];
            if (firstParam.type === index_1.ItemPromptType.choice && firstParam.choices != undefined) {
                builder.Prompts.choice(session, firstParam.prompt, firstParam.choices, { listStyle: builder.ListStyle.button });
            }
            else if (firstParam.type == index_1.ItemPromptType.text) {
                builder.Prompts.text(session, firstParam.prompt);
            }
            else if (firstParam.type == index_1.ItemPromptType.number) {
                builder.Prompts.number(session, firstParam.prompt);
            }
            else if (firstParam.type == index_1.ItemPromptType.confirm) {
                builder.Prompts.confirm(session, firstParam.prompt);
            }
        },
        function (session, args, next) {
            var paramVal;
            if (args.response.entity) {
                paramVal = args.response.entity;
            }
            else {
                paramVal = args.response;
            }
            options.searchParameters[0].userVal = paramVal;
            session.sendTyping();
            Promise.all([
                options.searchFunction([paramVal])
            ]).then(function (_a) {
                var searchResults = _a[0];
                var cards = generateCards_1.generateCards(session, searchResults);
                if (cards) {
                    session.send(cards);
                    builder.Prompts.confirm(session, 'Did you find what you\'re looking for?');
                }
                else {
                    session.send('I\'m sorry, I couldn\'t find anything that matched your search. Tell me a little more about what you\'re looking for.');
                    return session.replaceDialog('itemSearch:refineSearch', options);
                }
            });
        },
        function (session, args, next) {
            if (args.response) {
                session.endDialog('Glad I could help!');
            }
            else {
                return session.beginDialog('itemSearch:refineSearch', options);
            }
        }
    ];
    return dialog;
}
function clearOptions() {
    options.searchParameters.forEach(function (p) {
        if (p.userVal) {
            p.userVal = undefined;
        }
    });
}
//# sourceMappingURL=initialSearch.js.map