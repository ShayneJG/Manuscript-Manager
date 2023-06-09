import getUser from "@/utils/getUser";
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


   export default function Profile() {
    const user = getUser();

    const {status} = useSession();

    //state
    const [payRate, setPayRate] = useState<number>(user.payRate)
    
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
            value={user.name}
            
          ></Input>
        </FormControl>
        <FormControl isDisabled>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={user.email}
            
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