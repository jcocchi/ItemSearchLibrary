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
  searchFunction: ((queryParams: IParam[]) => IItem[]),
}

export enum ItemPromptType {
  choice,
  text,
  number,
  confirm
}

export function createLibrary (options: IItemSearchPromptOptions) {
  validateOptions(options);
  
  initialSearchDialog.register(lib, options);
  refineSearchDialog.register(lib);
  
  return lib;
};

export function itemSearchDialog (session: builder.Session) {  
  return session.beginDialog('itemSearch:initialSearch');
};

function validateOptions(options: IItemSearchPromptOptions): boolean {
  // There must be at least one search parameter
  if(options.searchParameters.length < 1){
    throw "You must pass in at least one search parameter.";
  }

  // The type of each parameter must be an int from 0 - 3
  // If the type is choice, there must also be a list of choices
  options.searchParameters.forEach(p => {
    if(p.type < 0 || p.type > 3){
      throw "You must use a valid ItemPromptType value."
    } else if (p.type == 0 && p.choices.length < 1){
      throw "All choice types must also have an array of choices."
    }
  })

  // There must be a search function
  if(!options.searchFunction){
    throw "'searchFunction' parameter missing"
  }

  return true;
};
