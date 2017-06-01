import * as builder from 'botbuilder';
import {IItem} from '../index' ;

export function generateCards (session: builder.Session, results: IItem[]) {
  // Only return the top 10 results in a carousel
  let numCards;    
  if(results.length > 10) {
    numCards = 10;
  } else if (results.length < 1) {
    return false;
  } else {
    numCards = results.length;
  }

  let cards = [];
  for(var i = 0; i < numCards; i++){
    const item = results[i];

    // TODO: MAKE SURE EACH ITEM HAS THESE FIELDS BEFORE CREATING CARD
    const card = new builder.HeroCard(session)
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
