import * as builder from 'botbuilder';
import {IItemSearchPromptOptions, ItemPromptType, IItem} from '../index' ;

export function register(library: builder.Library, options: IItemSearchPromptOptions): void {
  library.dialog('itemSearch', createDialog(options))
}

function createDialog (options) {
  const dialog = [
    (session, args, next) => {
      session.endDialog('I will eventually refine your search, but I don\'t know how to do that yet.');
    }
  ];

  return dialog;
}
