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
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { ChangeEvent, useState } from "react";
import { authOptions } from "../api/auth/[...nextauth]";
import clientPromise from "@/lib/mongodb";
import UserType from "@/types/user";
import Header from "@/components/page/header";

interface ProfileProps {
  user: UserType;
}

export default function Profile({ user }: ProfileProps) {
  const updatePayRate = async (payRate: number, email: string) => {
    const user = {
      email: email,
      payRate: payRate,
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
  };

  const { status, data: session } = useSession();

  //state
  const [payRate, setPayRate] = useState<number>(user.payRate);
  const [day, setDay] = useState<number>(0);
  const [weekGoal, setWeekGoal] = useState<number>();
  const [monthGoal, setMonthGoal] = useState<number>();
  const toast = useToast();

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
                <Button
                  onClick={async (e) => {
                    e.preventDefault();
                    if (!payRate) {
                      toast({
                        title: "Update unsuccessful",
                        description: "A field cannot be blank",
                        status: "error",
                        duration: 9000,
                        isClosable: true,
                      });
                      return;
                    }
                    let update = await updatePayRate(
                      payRate,
                      session?.user?.email!
                    );
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

          {/* GOALS */}

          <Box className="w-2/3">
            <Heading>Goals</Heading>
            
            <form>
              <FormControl>
                <FormLabel>Workdays a week</FormLabel>
                <Input
                  value={day}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setDay(e.target.valueAsNumber);
                  }}
                  type="number"
                ></Input>
              </FormControl>
              <FormControl>
                <FormLabel>Monthly Earnings</FormLabel>
                <Input
                  value={!monthGoal ? "" : monthGoal}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setMonthGoal(e.target.valueAsNumber);
                  }}
                  type="number"
                ></Input>
              </FormControl>
              <Button
                type="submit"
                onSubmit={async (e) => {
                  e.preventDefault();
                  //TODO: submit the data to the db
                }}
              >
                Update
              </Button>
            </form>
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

  if (session) {
    // Find the document with the same email
    const email = session?.user?.email;
    const userData = await db.collection("users").findOne({ email });

    if (!userData) {
      user = {
        name: session.user?.name,
        email: session.user?.email,
        payRate: process.env.PAYRATE_DEFAULT,
      };
      await db.collection("users").insertOne(user);
    } else {
      user = {
        name: userData?.name,
        email: userData?.email,
        payRate: userData?.payRate,
      };
    }
  }

  return {
    props: {
      user: user,
    },
  };
};
