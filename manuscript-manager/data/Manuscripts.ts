interface fakeManuscriptType {
  user: string;
  payrate: number;
  date: Date;
  manuscriptID: string;
  wordcount: number;
  latex: boolean;
  double: boolean;
  triple: boolean;
  bonus: number;
  turnAround: string;
  authorBio: number;
}

export let fakeManuscripts: fakeManuscriptType[] = [
  {
    user: "Shayne",
    payrate: 0.0074,
    date: new Date(),
    manuscriptID: "manuscript-1234",
    wordcount: 2000,
    latex: false,
    double: false,
    triple: false,
    bonus: 0,
    turnAround: "12:00:00",
    authorBio: 0,
  },
  {
    user: "Shayne",
    payrate: 0.0074,
    date: new Date(),
    manuscriptID: "manuscript-1234",
    wordcount: 2000,
    latex: false,
    double: false,
    triple: false,
    bonus: 0,
    turnAround: "12:00:00",
    authorBio: 0,
  },
  {
    user: "Shayne",
    payrate: 0.0074,
    date: new Date(),
    manuscriptID: "manuscript-444",
    wordcount: 123443,
    latex: true,
    double: false,
    triple: false,
    bonus: 0.5,
    turnAround: "4:00:00",
    authorBio: 120,
  },
  {
    user: "Shayne",
    payrate: 0.0074,
    date: new Date(),
    manuscriptID: "manuscript-12322",
    wordcount: 555555,
    latex: false,
    double: false,
    triple: false,
    bonus: 0,
    turnAround: "12:00:00",
    authorBio: 0,
  },
  {
    user: "Shayne",
    payrate: 0.0074,
    date: new Date(),
    manuscriptID: "manuscript-5242",
    wordcount: 6000,
    latex: false,
    double: false,
    triple: false,
    bonus: 0,
    turnAround: "12:00:00",
    authorBio: 0,
  },
];
