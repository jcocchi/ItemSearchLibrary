import * as builder from 'botbuilder';
import {generateCards} from './generateCards' ;
import {IItemSearchPromptOptions, ItemPromptType, IItem, IParam} from '../index' ;
let options;

export function register(library: builder.Library): void {
  library.dialog('refineSearch', createDialog())
}

function createDialog () {
  const dialog = [
    (session: builder.Session, args: IItemSearchPromptOptions, next: (args?: builder.IDialogResult<any>) => void) => {
      options = args    
      let missingParams = findMissingParams(options.searchParameters);

      // If we have values for all of the parameters but still haven't found a product match tell the user and send an error
      if (missingParams.length < 1) {
        // TODO: HOW TO TELL THE LIB USER THAT THIS CASE HAPPENED
        return session.endDialog('I\'m sorry, I couldn\'t find any items that match your description.');                
      } 

      let nextParam = missingParams[0];
    
      // Determine which prompt type to use
      if (nextParam.type === ItemPromptType.choice && nextParam.choices != undefined) {
        builder.Prompts.choice(session, nextParam.prompt, nextParam.choices, {listStyle: builder.ListStyle.button});     
      } else if (nextParam.type == ItemPromptType.text) {
        builder.Prompts.text(session, nextParam.prompt);
      } else if (nextParam.type == ItemPromptType.number) {
        builder.Prompts.number(session, nextParam.prompt);
      } else if (nextParam.type == ItemPromptType.confirm) {
        builder.Prompts.confirm(session, nextParam.prompt);
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
      let firstParam = findFirstMissingParam();
      if(firstParam === null) {
        return session.endDialog('Oops! There was an error searching for your item.')
      }
      firstParam.userVal = paramVal;

      session.sendTyping();
      Promise.all([
        options.searchFunction([paramVal]) // TODO: PASS ARRAY OF ALL PARAM VALS, NOT JUST THE LATEST ONE
      ]).then(([searchResults]) => {
        // Create a card carousel for the top 10 items returned
        let cards = generateCards(session, searchResults);

        // If we got results, ask the user if they are happy before asking for the next parameter
        if(cards) {
          session.send(cards);
          builder.Prompts.confirm(session, 'Did you find what you\'re looking for?');
        } else {
          // Check if we found all of the parameters
          let missingEntities = findMissingParams(options.searchParameters);

          // If we have values for all of the parameters but the user still wasn't happy, tell the user we didn't find anything
          if (missingEntities.length < 1) {
            return session.endDialog('I\'m sorry, I couldn\'t find any items that match your description. I looked everywhere!');                
          } else {
            session.send('I\'m sorry, I couldn\'t find any gifts that matched your search. Tell me a little more about the gift you\'re looking for.');  
            return session.replaceDialog('itemSearch:refineSearch', options);
          }
        } 
      })
    },
    (session: builder.Session, args: builder.IDialogResult<any>, next: (args?: builder.IDialogResult<any>) => void) => {
      // True indicates the user was happy with their search, false means we need to ask them about the next entity           
      if (!args.response) {
        return session.replaceDialog('itemSearch:refineSearch', options);
      }

      session.endDialog('Glad I could help!');  
    }
  ];

  return dialog;
}

function findMissingParams(args: IParam[]): IParam[] {
  let missingParams = [];

  options.searchParameters.forEach(p => {
    if(!p.userVal) {
      missingParams.push(p);
    }
  });

  return missingParams;
}

function findFirstMissingParam(): IParam {  
  for(let i = 0; i < options.searchParameters.length; i++){
    if(!options.searchParameters[i].userVal) {
      return options.searchParameters[i];
    }
  } 

  return null;
}
