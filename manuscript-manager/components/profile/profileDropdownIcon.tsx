/*
This component renders the profile icon and its subsequent dropdown menu
*/
import {
  Spinner,
  Alert,
  AlertIcon,
  Avatar,
  Button,
  Menu,
  MenuGroup,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from "@chakra-ui/react";
import { useUser } from "@auth0/nextjs-auth0/dist/client/use-user";

export default function ProfileAvatarDropdown() {
  const { user, error, isLoading } = useUser();

  if (isLoading) {
    return <Spinner />;
  }
  if (error) {
    return (
      <Alert>
        <AlertIcon />
        <p>{error.message}</p>
      </Alert>
    );
  }

  const name: string = user?.name || "";
  const image: string = user?.picture || "noImage";
  return user ? (
    //User exists: Show profile and menu
    <div>
      <Avatar name={name} src={image} />
      <Menu>
        <MenuButton as={Button} colorScheme="blue">
          Profile
        </MenuButton>
        <MenuList>
          <MenuGroup title="Profile">
            <MenuItem>My Account</MenuItem>
            <MenuItem>Manuscript Search</MenuItem>
            <MenuItem>Monthly Data</MenuItem>
            <MenuItem>Something else</MenuItem>
          </MenuGroup>
          <MenuDivider />
          <MenuGroup title="Help">
            <MenuItem>FAQ</MenuItem>
            <MenuItem>Contact</MenuItem>
          </MenuGroup>
        </MenuList>
      </Menu>
    </div>
  ) : (
    //User undefined: Guest mode.
    <div>
      <Avatar />
      <Button colorScheme="blue">Login</Button>
    </div>
  );
}
