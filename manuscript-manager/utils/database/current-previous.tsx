import clientPromise from "@/lib/mongodb";
import { currentDate, lastMonthStartDate, thisMonthStartDate } from "../dates";
import { ManuscriptType } from "@/types/manuscripts";

export default async function currentAndPreviousMonths(name: string) {
  const client = await clientPromise;
  const db = client.db("test");
  const data = await db
    .collection("manuscripts")
    .find({
      date: { $gte: lastMonthStartDate.toISOString() },
      user: name,
    })
    .sort({ date: -1 })
    .toArray();

  // getServerSideProps can only be passed a plain JS object
  // When we get data from MongoDB, it contains complex data types - Object ids, doubles, floats, etc.
  // getServerSideProps can only deal with strings, numbers, arrays, objects, etc.
  // So we have to add this workaround of stringifying the data we get back, and then reparsing it:
  const manuscripts = JSON.parse(JSON.stringify(data));

  // filter data for today's manuscripts, this month's manuscripts, and last month's
  // today: db dates stored as follows: "2023-04-25T08:10:13.000Z", currentDate as follows: Mon Jun 12 2023 16:32:37 GMT+0800 (Australian Western Standard Time)
  const todaysManuscripts = manuscripts.filter((manuscript: ManuscriptType) => {
    const manuscriptDate = new Date(manuscript.date);
    return manuscriptDate.toDateString() == currentDate.toDateString();
  });

  // this month: manuscripts with dates >= this month start date
  const thisMonthsManuscripts = manuscripts.filter(
    (manuscript: ManuscriptType) => {
      const manuscriptDate = new Date(manuscript.date);
      return manuscriptDate >= thisMonthStartDate;
    }
  );

  // last month: manuscripts with dates < this month start date and >= last month start date
  const lastMonthsManuscripts = manuscripts.filter(
    (manuscript: ManuscriptType) => {
      const manuscriptDate = new Date(manuscript.date);
      return (
        manuscriptDate >= lastMonthStartDate &&
        manuscriptDate < thisMonthStartDate
      );
    }
  );

  return [todaysManuscripts, thisMonthsManuscripts, lastMonthsManuscripts];
}
