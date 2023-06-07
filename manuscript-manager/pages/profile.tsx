import { useUser } from "@auth0/nextjs-auth0/client";

import {
  UserPayType,
  getUserMetadata,
  updateUserMetadata,
} from "@/utils/auth/auth0management";
import {
  Alert,
  AlertIcon,
  Center,
  Box,
  FormLabel,
  FormControl,
  Input,
  Flex,
  FormHelperText,
  Button,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
export default function Profile() {
  //useUser is async
  const { user, error, isLoading } = useUser();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [rate, setRate] = useState<number>(0);
  //this handles the async nature of useUser. When the data finally comes in,
  //it updates the required fields
  useEffect(() => {
    const fetchPayRate = async () => {
      console.log(user?.sub!);
      let metadata = await getUserMetadata(user?.sub!);
      if (metadata) {
        console.log(metadata);
        // setRate(userPayRate);
      } else {
        console.log("metadata was not retreived");
      }
    };

    fetchPayRate();
    if (user?.name) {
      setName(user.name);
    }
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  if (isLoading) return <div>Loading...</div>;
  if (error)
    return (
      <Alert status="error">
        <AlertIcon />
        <p>{error.message}</p>
      </Alert>
    );

  async function handlePayUpdate(userID: string, userRate: number) {
    const payRate: UserPayType = {
      payRate: userRate,
    };
    console.log("handlePayUpdate called", userID, userRate);
    await updateUserMetadata(userID, payRate);
  }
  return user ? (
    <Center flexDirection="column">
      <h1>Profile</h1>
      <Box>
        <form>
          <FormControl isDisabled>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            ></Input>
          </FormControl>
          <FormControl isDisabled>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            ></Input>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Pay Rate</FormLabel>
            <Input
              type="number"
              value={rate}
              onChange={(e) => {
                setRate(e.target.valueAsNumber);
              }}
            ></Input>
            <FormHelperText>e.g., 0.0070</FormHelperText>
          </FormControl>
          <Button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              if (user?.sub) handlePayUpdate(user.sub, rate);
            }}
          >
            Update
          </Button>
        </form>
      </Box>
    </Center>
  ) : (
    // handles when user is undefined.
    <div>
      <Alert status="error">
        <AlertIcon />
        <p>No user details found.</p>
      </Alert>
    </div>
  );
}
