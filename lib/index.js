"use strict";
exports.__esModule = true;
var builder = require("botbuilder");
var lib = new builder.Library('itemSearch');
var options;
var ItemPromptType;
(function (ItemPromptType) {
    ItemPromptType[ItemPromptType["choice"] = 0] = "choice";
    ItemPromptType[ItemPromptType["text"] = 1] = "text";
    ItemPromptType[ItemPromptType["number"] = 2] = "number";
    ItemPromptType[ItemPromptType["confirm"] = 3] = "confirm";
})(ItemPromptType = exports.ItemPromptType || (exports.ItemPromptType = {}));
exports.createLibrary = function () {
    return lib;
};
exports.itemSearchDialog = function (session, options) {
    options = options;
    return session.beginDialog('itemSearch:itemSearch', options);
};
lib.dialog('itemSearch', [
    function (session, args, next) {
        var firstParam = args.searchParameters[0];
        // Determine which prompt type to use
        if (!firstParam) {
            session.endDialog();
            return 'Error';
        }
        else if (firstParam.type === ItemPromptType.choice && firstParam.choices != undefined) {
            builder.Prompts.choice(session, firstParam.prompt, firstParam.choices);
        }
        else if (firstParam.type == ItemPromptType.text) {
            builder.Prompts.text(session, firstParam.prompt);
        }
        else if (firstParam.type == ItemPromptType.number) {
            builder.Prompts.number(session, firstParam.prompt);
        }
        else if (firstParam.type == ItemPromptType.confirm) {
            builder.Prompts.confirm(session, firstParam.prompt);
        }
    },
    function (session, args, next) {
        var paramVal;
        // If it was a choice prompt, the value we need is stored in args.response.entity
        if (args.response.entity) {
            paramVal = args.response.entity;
        }
        else {
            paramVal = args.response;
        }
        // Store value in user data to search against later
        session.userData[options.searchParameters[0].name] = paramVal;
        session.sendTyping();
        Promise.all([
            options.search([paramVal])
        ]).then(function (_a) {
            var searchResults = _a[0];
            // Create a card carousel for the top 10 items returned
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
]);
lib.dialog('refineSearch', [
    function (session, args, next) {
        session.endDialog('I will eventually refine your search, but I don\'t know how to do that yet.');
    }
]);
function generateCards(session, results) {
    // Only return the top 10 results in a carousel
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
