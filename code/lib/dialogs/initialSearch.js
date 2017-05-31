"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var builder = require("botbuilder");
var index_1 = require("../index");
function register(library, options) {
    library.dialog('initialSearch', createDialog(options));
}
exports.register = register;
function createDialog(options) {
    var dialog = [
        function (session, args, next) {
            var firstParam = args.searchParameters[0];
            if (!firstParam) {
                session.endDialog();
                return 'Error';
            }
            else if (firstParam.type === index_1.ItemPromptType.choice && firstParam.choices != undefined) {
                builder.Prompts.choice(session, firstParam.prompt, firstParam.choices);
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
            session.userData[options.searchParameters[0].name] = paramVal;
            session.sendTyping();
            Promise.all([
                options.search([paramVal])
            ]).then(function (_a) {
                var searchResults = _a[0];
                var cards = generateCards(session, searchResults);
                if (cards) {
                    session.send(cards);
                    builder.Prompts.confirm(session, 'Did you find what you\'re looking for?');
                }
                else {
                    session.send('I\'m sorry, I couldn\'t find anything that matched your search. Tell me a little more about what you\'re looking for.');
                    return session.replaceDialog('/refineSearch');
                }
            });
        },
        function (session, args, next) {
            if (args.response) {
                session.endDialog('Glad I could help!');
            }
            else {
                return session.beginDialog('/refineSearch');
            }
        }
    ];
    return dialog;
}
function generateCards(session, results) {
    var numCards;
    if (results.length > 10) {
        numCards = 10;
    }
    else if (results.length < 1) {
        return false;
    }
    else {
        numCards = results.length;
    }
    var cards = [];
    for (var i = 0; i < numCards; i++) {
        var item = results[i];
        var card = new builder.HeroCard(session)
            .title(item.title)
            .subtitle(item.subtitle)
            .text(item.text)
            .images([builder.CardImage.create(session, item.imageUrl)])
            .buttons([
            builder.CardAction.openUrl(session, item.openUrl, 'More Details')
        ]);
        cards.push(card);
    }
    return new builder.Message(session).attachmentLayout('carousel').attachments(cards);
}
//# sourceMappingURL=initialSearch.js.map