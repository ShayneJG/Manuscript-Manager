/*
This component renders the profile icon and its subsequent dropdown menu
*/
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
    MenuDivider,
  } from "@chakra-ui/react";
  import { useSession, signIn, signOut } from "next-auth/react"
  
  
  export default function ProfileAvatarDropdown() {
    
  
    const { data: session } = useSession();
    
    let name = session?.user?.name || "no name";
    let image = session?.user?.image || "no image";
    let email = session?.user?.email || "no email";
  
    
      

  
    if(session) {return (
      //User exists: Show profile and menu
      <Flex>
        <Menu>
          <MenuButton>
            <Avatar name={name} src={image} />
          </MenuButton>
          <MenuList>
            <MenuGroup title="Profile">
              <MenuItem>My Profile</MenuItem>
              <MenuItem>Manuscript Search</MenuItem>
              <MenuItem>Monthly Data</MenuItem>
              <MenuItem>Goals</MenuItem>
  
              <MenuItem onClick={() => {signOut()}}>
                Sign Out
              </MenuItem>
            </MenuGroup>
            <MenuDivider />
            <MenuGroup title="Help">
              <MenuItem>FAQ</MenuItem>
              <MenuItem>Contact</MenuItem>
            </MenuGroup>
          </MenuList>
        </Menu>
        <h1>{name}</h1>
      </Flex>
    )} else {return (
        <Flex>
            <Menu>
          <Avatar name={"Guest"} src={"Guest Image"} />
          
          <Button as="a" onClick={() => signIn()} colorScheme="blue">
            Sign In
          </Button></Menu><h1>{"Guest: Not signed in"}</h1>
        </Flex>
      );}
  }
  