
import {
    Spinner,
    Alert,
    AlertIcon,
    Avatar,
    Button,
    Flex,
    Menu,
    MenuGroup,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider, FormControl,
    Center,
    Box,
    FormLabel,
    Input,FormHelperText
  } from "@chakra-ui/react";
  import { useSession } from "next-auth/react"
import { useState } from "react";

const fetchUserData = async (email:string) => {
  try {
    const response = await fetch(`/api/user/getUser?email=${encodeURIComponent(email)}`);
    const data = await response.json();

    if (response.ok) {
      const user = data.user;
      const payRate = user ? user.payRate : null;
      return payRate;
    } else {
      console.error('Error:', data.error);
      return null;
    }
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};





   export default function Profile() {
    
    

    const {status, data: session} = useSession();

    //state
    const [payRate, setPayRate] = useState<number>()
    

    if(session) {
      fetchUserData(session?.user?.email!)
  .then((payRate) => {
    console.log('Pay Rate:', payRate);
   setPayRate(payRate)
  })
  .catch((error) => {
    console.error('Error:', error);
  });
    }

    
    if(status === "unauthenticated") {
        return <Alert>
            <AlertIcon>User not Logged in</AlertIcon>
        </Alert>
    } else if(status === "loading") {
        return <Spinner></Spinner>
    } else return (<Center flexDirection="column">
    <h1>Profile</h1>
    <Box>
      <form>
        <FormControl isDisabled>
          <FormLabel>Name</FormLabel>
          <Input
            type="text"
            value={session?.user?.name!}
            
          ></Input>
        </FormControl>
        <FormControl isDisabled>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={session?.user?.email!}
            
          ></Input>
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
        <Button type="submit">Update</Button>
      </form>
    </Box>
  </Center>)
  }