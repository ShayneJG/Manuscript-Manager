
import NoUser from "@/components/profile/noUser";
import DataView from "@/components/stats/dataView";
import UserType from "@/types/user";
import getUser from "@/utils/getUser";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import {useState} from 'react'
interface StatisticsProps {
    user: UserType
}


//this page was built differently with more reusable components and functions as a test. 
//if all goes well, we can adopt this style to follow DRY principles.
export default function Statistics({user}: StatisticsProps) {

  const monthLabels: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const [month, setMonth] = useState(0);






    if(user == undefined) {
        return <NoUser />
    } else 
    return(
        <main>
          <DataView labels={monthLabels} view={month} setView={setMonth}  />
        </main>

    )

}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getUser(context);
  let user;
  if (session) {
    user = session;
  }

  return { props: { user: user } };
};
