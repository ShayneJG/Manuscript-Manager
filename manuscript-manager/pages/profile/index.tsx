import {
  Spinner,
  Alert,
  AlertIcon,
  Button,
  FormControl,
  Box,
  FormLabel,
  Input,
  FormHelperText,
  useToast,
  Heading,
  Grid,
  Text,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { ChangeEvent, useEffect, useState } from "react";
import { authOptions } from "../api/auth/[...nextauth]";
import clientPromise from "@/lib/mongodb";
import UserType, { UserEarnings } from "@/types/user";
import Header from "@/components/page/header";
import { roundLimit } from "@/utils/math";
import { lastMonthStartDate, payPeriodDays, thisMonthStartDate } from "@/utils/dates";
import { ManuscriptType } from "@/types/manuscripts";
import { WithId } from "mongodb";
import MonthlyEarningsChart from "@/components/stats/charts/monthlyEarnings";
import currentAndPreviousMonths from "@/utils/database/current-previous";
interface ProfileProps {
  user: UserType;
  currentMonth: ManuscriptType[];
  lastMonth: ManuscriptType[];
}

export default function Profile({ user, currentMonth, lastMonth }: ProfileProps) {
  const updateUser = async () => {
    if (session?.user) {
      const user: UserType = {
        name: session.user.name!,
        email: session.user.email!,
        payRate: payRate,
        earnings: {
          workDays: workDays,
          monthly: monthGoal,
        },
      };
      try {
        await fetch("/api/user/updateUser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        });
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    }
  };


  function dailyEarnings() {
    //assume 30 days a month, approx 4 weeks. 
    const totalWorkDays: number = workDays * 4; 
    const earningsPerDay: number = monthGoal / totalWorkDays;  

    setDayEarnings(roundLimit(earningsPerDay));
  }

  

  const { status, data: session } = useSession();

  //state
  const [payRate, setPayRate] = useState<number>(user.payRate);
  const [workDays, setWorkDays] = useState<number>(user.earnings?.workDays!);
  const [dayEarnings, setDayEarnings] = useState<number>();
  const [monthGoal, setMonthGoal] = useState<number>(user.earnings?.monthly!);
  const toast = useToast();

  useEffect(() => {dailyEarnings()}, [workDays, monthGoal])

  if (status === "unauthenticated") {
    return (
      <Alert status="error">
        <AlertIcon />
        User not Logged in
      </Alert>
    );
  } else if (status === "loading") {
    return <Spinner></Spinner>;
  } else {
    return (
      <div className="min-h-screen py-16 px-24">
        <Header />
        <Grid templateColumns={"repeat(2, 1fr)"} gap={6}>
          {/* PROFILE */}
          <Box className="w-2/3" id="profile">
            <Heading>Profile</Heading>
            <Box>
              <form>
                <FormControl isDisabled>
                  <FormLabel>Name</FormLabel>
                  <Input type="text" value={session?.user?.name!}></Input>
                </FormControl>
                <FormControl isDisabled>
                  <FormLabel>Email</FormLabel>
                  <Input type="email" value={session?.user?.email!}></Input>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Pay Rate</FormLabel>
                  <Input
                    type="number"
                    value={payRate}
                    onChange={(e) => {
                      setPayRate(e.target.valueAsNumber);
                    }}
                  ></Input>
                  <FormHelperText>e.g., 0.0070</FormHelperText>
                </FormControl>
                
                  
                  {/* GOALS */}

                  <Heading>Goals</Heading>

                  <FormControl>
                    <FormLabel>Workdays</FormLabel>
                    <InputGroup>
                      <Input
                        value={workDays}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          let val = e.target.valueAsNumber;
                          if (val >= 1 && val <= 7) {
                            setWorkDays(e.target.valueAsNumber);
                          }
                        }}
                        type="number"
                      ></Input>
                      <InputRightElement fontSize="0.8rem">
                        days a week
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Monthly Earnings</FormLabel>
                    <InputGroup>
                      <InputLeftElement
                        pointerEvents="none"
                        color="gray.300"
                        fontSize="1.2em"
                        children="$"
                      />
                      <Input
                        value={monthGoal}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          setMonthGoal(e.target.valueAsNumber);
                        }}
                        type="number"
                      ></Input>
                    </InputGroup>
                  </FormControl>
                  <Text>
                    Your daily earnings should approximately be: ${dayEarnings}
                  </Text>
                
                <Button
                  onClick={async (e) => {
                    e.preventDefault();
                    if (!payRate || !workDays || !monthGoal) {
                      toast({
                        title: "Update unsuccessful",
                        description: "A field cannot be blank",
                        status: "error",
                        duration: 9000,
                        isClosable: true,
                      });
                      return;
                    }
                    let update = await updateUser();
                    if (update) {
                      toast({
                        title: "Update successful",
                        status: "success",
                        duration: 9000,
                        isClosable: true,
                      });
                    }
                  }}
                  type="submit"
                >
                  Update
                </Button>
              </form>
            </Box>
          </Box>
           <Box>
           <MonthlyEarningsChart currentMonth={currentMonth} dateInPeriod={new Date()} />
          </Box>       
          
        </Grid>
      </div>
    );
  }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  const client = await clientPromise;
  const db = client.db("test");

  let user = {};
  let thisMonth;
  let lastMonth;

  if (session) {
    // Find the document with the same email
    const email = session?.user?.email;
    const userData = await db.collection("users").findOne({ email });

    //if there is no userData found, create a user based on the session data and insert into our user collection
    if (!userData) {
      user = {
        name: session.user?.name,
        email: session.user?.email,
        payRate: process.env.PAYRATE_DEFAULT,
        earnings: {
          workDays: process.env.WORKDAYS,
          monthly: process.env.MONTHLY_GOAL,
        },
      };
      await db.collection("users").insertOne(user);
    } else {
      user = {
        name: userData?.name,
        email: userData?.email,
        payRate: userData?.payRate,
        earnings: {
          workDays: userData.earnings?.workDays || process.env.WORKDAYS,
          monthly: userData.earnings?.monthly || process.env.MONTHLY_GOAL,
        },
      };
    }

      //Data for the charts

      //current month
      
      
      const [todaysManuscripts, thisMonthsManuscripts, lastMonthsManuscripts] = await currentAndPreviousMonths(session.user?.name!)
      

      console.log("serverside manuscripts: ", thisMonthsManuscripts)
      thisMonth = thisMonthsManuscripts;
      lastMonth = lastMonthsManuscripts;
      
       
       


      

      


    
  }





  

  return {
    props: {
      user: user,
      currentMonth: thisMonth,
      lastMonth: lastMonth
    },
  };
};
