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
import { useUser } from "@auth0/nextjs-auth0/client";

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

  const name: string = user?.name || "Guest";
  const image: string | undefined = user?.picture || undefined;

  if (user === undefined) {
    return (
      <Flex>
        <Avatar name={name} src={image} />
        <h1>{name}</h1>
        <Button as="a" href="/api/auth/login" colorScheme="blue">
          Log In
        </Button>
      </Flex>
    );
  }

  return (
    //User exists: Show profile and menu
    <Flex>
      <Menu>
        <MenuButton>
          <Avatar name={name} src={image} />
        </MenuButton>
        <MenuList>
          <MenuGroup title="Profile">
            <MenuItem>My Account</MenuItem>
            <MenuItem>Manuscript Search</MenuItem>
            <MenuItem>Monthly Data</MenuItem>
            {user ? (
              <MenuItem as="a" href="/api/auth/logout">
                Log Out
              </MenuItem>
            ) : (
              <MenuItem as="a" href="/api/auth/login">
                Log In
              </MenuItem>
            )}
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
  );
}
