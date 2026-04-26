import { MatchDescriptor } from "./MatchDescriptor";

export type ModuleDescriptor = {
  id:string,
  source:string,
  dependencies:Array<MatchDescriptor>,
  order:number,
};