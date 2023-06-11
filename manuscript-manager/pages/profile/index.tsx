
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
import { useState, useEffect } from "react";

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
      return data.error;
    }
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

const createUserData = async (name: string, email: string) => {
  try {
    const user = {
      name: name,
      email: email
    }
    const response = await fetch('/api/user/createUser', {method: 'POST', 
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(user)
  });

  const responseData = await response.json;
  console.log(responseData);
  } catch(error) {
    console.error(error)
  }
}

const updatePayRate = async (payRate: number, email: string) => {
  const user = {
        email: email,
        payRate: payRate
  }
  try {
    await fetch('/api/user/updateUser', {method: 'POST', headers: {'Content-Type': 'application/json'},
  body: JSON.stringify(user)
})
  } catch(error) {
    console.error(error);
  }
}






   export default function Profile() {
    
    

    const {status, data: session} = useSession();

    //state
    const [payRate, setPayRate] = useState<number>(0)
    

    useEffect(() => {
      if(status === "authenticated") {
        fetchUserData(session?.user?.email!)
      .then((payRate) => {
      console.log('Pay Rate:', payRate);
      if(typeof payRate === 'number') {setPayRate(payRate)} else {
        try {createUserData(session?.user?.name!, session?.user?.email!).then(() => {console.log('User Successfully Created')})}
      catch(error) {
        console.error(error);
      }
      }
  })
  .catch((error) => {
    
    console.error('Error:', error);
  })
      }
    }, [status])

    
    if(status === "unauthenticated") {
      
        return <Alert status='error'>
            <AlertIcon  />
            User not Logged in
        </Alert>
    } else if(status === "loading") {
        return <Spinner></Spinner>
    } else 
    {
      
     return (<Center flexDirection="column">
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
        <Button  onClick={(e) => {
          e.preventDefault()
          updatePayRate(payRate, session?.user?.email!)
          }} type="submit">Update</Button>
      </form>
    </Box>
  </Center>)
  }}