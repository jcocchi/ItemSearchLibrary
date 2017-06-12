"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var builder = require("botbuilder");
var generateCards_1 = require("./generateCards");
var index_1 = require("../index");
var options;
function register(library) {
    library.dialog('refineSearch', createDialog());
}
exports.register = register;
function createDialog() {
    var dialog = [
        function (session, args, next) {
            options = args;
            var missingParams = findMissingParams();
            if (missingParams.length < 1) {
                return session.endDialog('I\'m sorry, I couldn\'t find any items that match your description.');
            }
            var nextParam = missingParams[0];
            if (nextParam.type === index_1.ItemPromptType.choice && nextParam.choices != undefined) {
                builder.Prompts.choice(session, nextParam.prompt, nextParam.choices, { listStyle: builder.ListStyle.button });
            }
            else if (nextParam.type == index_1.ItemPromptType.text) {
                builder.Prompts.text(session, nextParam.prompt);
            }
            else if (nextParam.type == index_1.ItemPromptType.number) {
                builder.Prompts.number(session, nextParam.prompt);
            }
            else if (nextParam.type == index_1.ItemPromptType.confirm) {
                builder.Prompts.confirm(session, nextParam.prompt);
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
            var firstParam = findFirstMissingParam();
            if (firstParam === null) {
                return session.endDialog('Oops! There was an error searching for your item.');
            }
            firstParam.userVal = paramVal;
            var foundParams = findFoundParams();
            session.sendTyping();
            Promise.all([
                options.searchFunction(foundParams)
            ]).then(function (_a) {
                var searchResults = _a[0];
                var cards = generateCards_1.generateCards(session, searchResults);
                if (cards) {
                    session.send(cards);
                    builder.Prompts.confirm(session, 'Did you find what you\'re looking for?');
                }
                else {
                    var missingEntities = findMissingParams();
                    if (missingEntities.length < 1) {
                        return session.endDialog('I\'m sorry, I couldn\'t find any items that match your description. I looked everywhere!');
                    }
                    else {
                        session.send('I\'m sorry, I couldn\'t find any gifts that matched your search. Tell me a little more about the gift you\'re looking for.');
                        return session.replaceDialog('itemSearch:refineSearch', options);
                    }
                }
            });
        },
        function (session, args, next) {
            if (!args.response) {
                return session.replaceDialog('itemSearch:refineSearch', options);
            }
            session.endDialog('Glad I could help!');
        }
    ];
    return dialog;
}
function findMissingParams() {
    var missingParams = [];
    options.searchParameters.forEach(function (p) {
        if (!p.userVal) {
            missingParams.push(p);
        }
    });
    return missingParams;
}
function findFirstMissingParam() {
    for (var i = 0; i < options.searchParameters.length; i++) {
        if (!options.searchParameters[i].userVal) {
            return options.searchParameters[i];
        }
    }
    return null;
}
function findFoundParams() {
    var foundParams = [];
    options.searchParameters.forEach(function (p) {
        if (p.userVal) {
            foundParams.push(p);
        }
    });
    return foundParams;
}
//# sourceMappingURL=refineSearch.js.map