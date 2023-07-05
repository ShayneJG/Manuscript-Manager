import { Heading } from "@chakra-ui/react";
import ProfileAvatarDropdown from "../profile/profileIcon";



//default header component for all pages
//assumes parent div/main has styling for page positioning
export default function Header () {
    return <header className="flex justify-between pb-8">
        <Heading size="lg"><a href="/">Manuscript Manager</a></Heading>
        <ProfileAvatarDropdown />
    </header>
}