import { ManuscriptType } from "@/types/manuscripts";

//use this class to create fake manuscript objects for testing purposes. Must be given at least manID, 
//wordcount, and authorbio. 

export default class Manuscript implements ManuscriptType {
  user?: string;
  payrate?: number;
  date: string;
  manuscriptID: string;
  wordCount: number;
  latex: boolean;
  double: boolean;
  triple: boolean;
  bonus: number;
  turnAround: string;
  authorBio: number;
  createdAt: string;
  updatedAt?: string;
  __v?: number;
  _id?: string;

  constructor(
    manuscriptID: string,
    wordCount: number,
    authorBio: number,
    date?: string,
    latex?: boolean,
    double?: boolean,
    triple?: boolean,
    bonus?: number,
    turnAround?: string
  ) {
    this.manuscriptID = manuscriptID;
    this.wordCount = wordCount;
    this.authorBio = authorBio;
    this.date = date || new Date().toDateString();
    this.latex = latex || false;
    this.double = double || false;
    this.triple = triple || false;
    this.bonus = bonus || 0;
    this.turnAround = turnAround || "4:00:00";
    this.createdAt = this.date;
  }
}
