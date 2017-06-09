"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var builder = require("botbuilder");
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
        var card = void 0;
        if (!item.openUrl) {
            card = new builder.HeroCard(session)
                .title(item.title || '')
                .subtitle(item.subtitle || '')
                .text(item.text || '')
                .images([builder.CardImage.create(session, item.imageUrl || '')]);
        }
        else {
            card = new builder.HeroCard(session)
                .title(item.title || '')
                .subtitle(item.subtitle || '')
                .text(item.text || '')
                .images([builder.CardImage.create(session, item.imageUrl || '')])
                .buttons([
                builder.CardAction.openUrl(session, item.openUrl, 'More Details')
            ]);
        }
        cards.push(card);
    }
    return new builder.Message(session).attachmentLayout('carousel').attachments(cards);
}
exports.generateCards = generateCards;
//# sourceMappingURL=generateCards.js.map