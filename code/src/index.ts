declare const exports;

import * as builder from 'botbuilder';
import * as itemSearchDialog from './dialogs/initialSearch';
import * as refineSearchDialog from './dialogs/refineSearch';

const lib = new builder.Library('itemSearch');
let options;

export interface IItem {
    title: string;
    subtitle?: string;
    text?: string;
    imageUrl?: string;
    openUrl?: string;
}

export interface IItemSearchPromptOptions {
  searchParameters: [{
      name: string;
      prompt: string;
      type: ItemPromptType;
      choices?: [string];
  }],
  searchFunction: ((queryParams: [string]) => [IItem]),
}

export enum ItemPromptType {
    choice = 0,
    text = 1,
    number = 2,
    confirm = 3,
}

exports.createLibrary = (ops: IItemSearchPromptOptions) => {
  options = ops
  
  itemSearchDialog.register(lib, options);
  refineSearchDialog.register(lib, options);
  
  return lib;
};

exports.itemSearchDialog = (session: builder.Session) => {  
  return session.beginDialog('itemSearch:initialSearch', options);
};
