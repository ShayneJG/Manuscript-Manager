import { Box, Heading } from "@chakra-ui/react";
import ProfileAvatarDropdown from "../profile/profileIcon";
import Link from "next/link";

//default header component for all pages
//assumes parent div/main has styling for page positioning
export default function Header() {
  return (
    <header className="flex justify-between pb-8 text-font italic border-b-2 mb-5">
      <Box>
        <Heading size="2xl">
          <Link href="/">Manuscript Manager</Link>
        </Heading>
        <Heading size="sm">Manuscripts made easy</Heading>
      </Box>
      <ProfileAvatarDropdown />
    </header>
  );
}
