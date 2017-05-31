import * as builder from 'botbuilder';
import {IItemSearchPromptOptions, ItemPromptType, IItem} from '../index' ;
let options;

export function register(library: builder.Library, options: IItemSearchPromptOptions): void {
  library.dialog('initialSearch', createDialog(options));
}

function createDialog (ops: IItemSearchPromptOptions) {
  options = ops

  var dialog = [
    (session: builder.Session, args: builder.IDialogResult<any>, next: (args?: builder.IDialogResult<any>) => void) => {      
      const firstParam = options.searchParameters[0];
    
      // Determine which prompt type to use
      if (!firstParam) {
        session.endDialog();
        return 'Error';
      } else if(firstParam.type === ItemPromptType.choice && firstParam.choices != undefined){
        builder.Prompts.choice(session, firstParam.prompt, firstParam.choices);     
      } else if (firstParam.type == ItemPromptType.text) {
        builder.Prompts.text(session, firstParam.prompt);
      } else if (firstParam.type == ItemPromptType.number) {
        builder.Prompts.number(session, firstParam.prompt);
      } else if (firstParam.type == ItemPromptType.confirm) {
        builder.Prompts.confirm(session, firstParam.prompt);
      }   
    },
    (session: builder.Session, args: builder.IDialogResult<any>, next: (args?: builder.IDialogResult<any>) => void) => {
      let paramVal;

      // If it was a choice prompt, the value we need is stored in args.response.entity
      if (args.response.entity) {
        paramVal = args.response.entity;
      } else { // Otherwise the value is in args.response
        paramVal = args.response;
      }

      // Store value in user data to search against later
      session.userData[options.searchParameters[0].name] = paramVal;

      session.sendTyping();
      Promise.all([
        options.searchFunction([paramVal])
      ]).then(([searchResults]) => {
        // Create a card carousel for the top 10 items returned
        let cards = generateCards(session, searchResults);

        if (cards) {
          session.send(cards);
          builder.Prompts.confirm(session, 'Did you find what you\'re looking for?');
        } else {
          session.send('I\'m sorry, I couldn\'t find anything that matched your search. Tell me a little more about what you\'re looking for.');  
          return session.replaceDialog('/refineSearch');
        }
      })
    },
    (session: builder.Session, args: builder.IDialogResult<any>, next: (args?: builder.IDialogResult<any>) => void) => {
      if (args.response) {
        session.endDialog('Glad I could help!');
      } else { // Else, ask for the next parameter
        return session.beginDialog('refineSearch');
      }
    }
  ]

  return dialog;
}

function generateCards (session: builder.Session, results: [IItem]) {
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