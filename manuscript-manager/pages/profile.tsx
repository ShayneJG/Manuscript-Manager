import { useUser } from "@auth0/nextjs-auth0/client";
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
  const [rate, setRate] = useState<number>();
  //this handles the async nature of useUser. When the data finally comes in,
  //it updates the required fields
  useEffect(() => {
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

  const onSubmit = () => {};
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
          <Button type="submit">Update</Button>
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
