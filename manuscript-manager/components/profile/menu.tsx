import {
  Menu,
  MenuGroup,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Button,
} from "@chakra-ui/react";

import { useUser } from "@auth0/nextjs-auth0/client";
export default function ProfileMenu() {
  const { user, error, isLoading } = useUser();

  return (
    <Menu>
      <MenuButton disabled={!user} as={Button} colorScheme="blue">
        Profile
      </MenuButton>
      <MenuList>
        <MenuGroup title="Profile">
          <MenuItem>My Account</MenuItem>
          <MenuItem>Manuscript Search</MenuItem>
          <MenuItem>Monthly Data</MenuItem>
          <MenuItem>
            <a href="/api/auth/logout">Log out</a>
          </MenuItem>
        </MenuGroup>
        <MenuDivider />
        <MenuGroup title="Help">
          <MenuItem>FAQ</MenuItem>
          <MenuItem>Contact</MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
  );
}
