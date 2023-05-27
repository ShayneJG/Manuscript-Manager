import { useUser } from "@auth0/nextjs-auth0/client";
import { Alert, AlertIcon } from "@chakra-ui/react";
export default function Profile() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error)
    return (
      <Alert status="error">
        <AlertIcon />
        <p>{error.message}</p>
      </Alert>
    );

  const picture: string | undefined = user?.picture || "imageMissing";
  const name: string = user?.name || "nameMissing";
  return user ? (
    <div>
      <img src={picture} alt={name} />
      <h2>{name}</h2>
      <p>{user.email}</p>
    </div>
  ) : (
    // handles when user is undefined.
    <div>
      <Alert status="error">
        <AlertIcon />
        <p>No user details found.</p>
      </Alert>
    </div>
  );
}
