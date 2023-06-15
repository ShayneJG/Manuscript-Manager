export interface ManuscriptType {
  user?: string;
  payrate?: number;
  date: string;
  manuscriptID: string;
  wordCount: number | undefined;
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
}
