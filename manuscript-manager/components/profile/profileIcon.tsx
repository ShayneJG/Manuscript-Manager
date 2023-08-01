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
import { useSession, signIn, signOut } from "next-auth/react";

export default function ProfileAvatarDropdown() {
  const { data: session } = useSession();

  let name: string = session?.user?.name || "no name";
  let image: string = session?.user?.image || "";

  

  if (session) {
    return (
      //User exists: Show profile and menu
      <Flex alignItems="center" gap="2">
        <Menu>
          <h1 className="text-font font-bold text-lg ">{name}</h1>
          <MenuButton>
            <Avatar name={name} src={image} size="lg" />
          </MenuButton>
          <MenuList>
            <MenuGroup title="Profile">
              <MenuItem as="a" href="/profile">
                My Profile
              </MenuItem>
              <MenuItem as="a" href="/search">
                Manuscript Search
              </MenuItem>
              <MenuItem as="a" href="/monthly">
                Monthly Data
              </MenuItem>
              <MenuItem as="a" href="/goals">
                Goals
              </MenuItem>
            </MenuGroup>
            <MenuDivider />
            <MenuGroup title="Help">
              <MenuItem>FAQ</MenuItem>
              <MenuItem>Contact</MenuItem>
            </MenuGroup>
            <MenuDivider />
            <MenuItem
              onClick={() => {
                signOut();
              }}
            >
              Sign Out
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    );
  } else {
    return (
      <Flex>
        <Menu>
          <MenuButton>
            
            <Avatar name={"Guest"} />
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => signIn()}>Sign In</MenuItem>
          </MenuList>
        </Menu>
        <h1>{"Guest: Not signed in"}</h1>
      </Flex>
    );
  }
}
