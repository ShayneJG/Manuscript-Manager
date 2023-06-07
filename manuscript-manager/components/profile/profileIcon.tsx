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
              <MenuItem as="a" href="/profile">My Profile</MenuItem>
              <MenuItem as="a" href="/search">Manuscript Search</MenuItem>
              <MenuItem as="a" href="/monthly">Monthly Data</MenuItem>
              <MenuItem as="a" href="/goals">Goals</MenuItem>
  
              
            </MenuGroup>
            <MenuDivider />
            <MenuGroup title="Help">
              <MenuItem>FAQ</MenuItem>
              <MenuItem>Contact</MenuItem>
            </MenuGroup>
            <MenuGroup>
            <MenuItem onClick={() => {signOut()}}>
                Sign Out
              </MenuItem></MenuGroup>
          </MenuList>
        </Menu>
        <h1>{name}</h1>
      </Flex>
    )} else {return (
        <Flex>
            <Menu>
            <MenuButton> <Avatar name={"Guest"} src={"Guest Image"} /></MenuButton>
            <MenuList>
                <MenuItem onClick={() => signIn()}>Sign In</MenuItem>
            </MenuList>
          
          </Menu><h1>{"Guest: Not signed in"}</h1>
        </Flex>
      );}
  }
  