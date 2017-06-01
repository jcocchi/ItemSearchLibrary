import * as builder from 'botbuilder';
import {generateCards} from './generateCards' ;
import {IItemSearchPromptOptions, ItemPromptType, IItem, IParam} from '../index' ;
let options;

export function register(library: builder.Library, options: IItemSearchPromptOptions): void {
  library.dialog('initialSearch', createDialog(options));
}

function createDialog (ops: IItemSearchPromptOptions) {
  options = ops

  var dialog = [
    (session: builder.Session, args: builder.IDialogResult<any>, next: (args?: builder.IDialogResult<any>) => void) => {      
      // Clear options from any previous search's user values
      clearOptions()
      const firstParam = options.searchParameters[0];
    
      // Determine which prompt type to use
      if (!firstParam) { 
        // TODO: THIS CASE SHOULD NEVER HAPPEN, SEND AN ERROR BACK TO THE USER
        session.endDialog();
        return 'Error';
      } else if(firstParam.type === ItemPromptType.choice && firstParam.choices != undefined){
        builder.Prompts.choice(session, firstParam.prompt, firstParam.choices, {listStyle: builder.ListStyle.button});     
      } else if (firstParam.type == ItemPromptType.text) {
        builder.Prompts.text(session, firstParam.prompt);
      } else if (firstParam.type == ItemPromptType.number) {
        builder.Prompts.number(session, firstParam.prompt);
      } else if (firstParam.type == ItemPromptType.confirm) {
        builder.Prompts.confirm(session, firstParam.prompt);
      } else {
        // TODO: THIS CASE SHOULD NEVER HAPPEN EITHER, INVALID PARAMETER TYPE
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

      // Store value in options to search against later
      options.searchParameters[0].userVal = paramVal;

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
          return session.replaceDialog('itemSearch:refineSearch', options);
        }
      })
    },
    (session: builder.Session, args: builder.IDialogResult<any>, next: (args?: builder.IDialogResult<any>) => void) => {
      if (args.response) {
        session.endDialog('Glad I could help!');
      } else { // Else, ask for the next parameter
        return session.beginDialog('itemSearch:refineSearch', options);
      }
    }
  ]

  return dialog;
}

function clearOptions() {
  options.searchParameters.forEach(p => {
    if(p.userVal) {
      p.userVal = undefined;
    }
  });
}