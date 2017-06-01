import * as builder from 'botbuilder';
import * as initialSearchDialog from './dialogs/initialSearch';
import * as refineSearchDialog from './dialogs/refineSearch';

const lib = new builder.Library('itemSearch');

export interface IItem {
  title: string;
  subtitle?: string;
  text?: string;
  imageUrl?: string;
  openUrl?: string;
}

export interface IParam {
  name: string;
  prompt: string;
  type: ItemPromptType;
  choices?: string[];
  userVal?: string;
}

export interface IItemSearchPromptOptions {
  searchParameters: IParam[],
  searchFunction: ((queryParams: string[]) => IItem[]),
}

export enum ItemPromptType {
  choice = 0,
  text = 1,
  number = 2,
  confirm = 3,
}

export function createLibrary (options: IItemSearchPromptOptions) {
  initialSearchDialog.register(lib, options);
  refineSearchDialog.register(lib);
  
  return lib;
};

export function itemSearchDialog (session: builder.Session) {  
  return session.beginDialog('itemSearch:initialSearch');
};
