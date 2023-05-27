/*
This component renders the profile icon and its subsequent dropdown menu
*/
import { Spinner, Alert, AlertIcon, Avatar, Button } from "@chakra-ui/react";
import { useUser } from "@auth0/nextjs-auth0/client";
import ProfileMenu from "./menu";

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
  return (
    //User exists: Show profile and menu
    <div>
      <Avatar name={name} src={image} />
      <h1>{name}</h1>
      <ProfileMenu />
      {!user && <Button>LogIn</Button>}
    </div>
  );
}
