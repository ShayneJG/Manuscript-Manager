import { Auth0Client } from "@auth0/auth0-spa-js";

export interface UserPayType {
  payRate: number;
}

// Create a new instance of the Auth0Client
const createClient = async (): Promise<Auth0Client> => {
  const auth0 = new Auth0Client({
    domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN!,
    clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!,
  });

  return auth0;
};

// Function to update user metadata
export async function updateUserMetadata(
  userId: string,
  metadata: UserPayType
) {
  try {
    const auth0 = await createClient();

    // Get the access token
    const accessToken = await auth0.getTokenSilently();

    // Update the user's metadata
    await fetch(
      `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/api/v2/users/${userId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_metadata: metadata }),
      }
    );

    console.log("User metadata updated");
  } catch (error) {
    console.error("Error updating user metadata:", error);
  }
}

export async function getUserMetadata(userId: string) {
  try {
    const auth0 = await createClient();

    // Get the access token
    const accessToken = await auth0.getTokenSilently();

    // get the user's metadata
    let result = await fetch(
      `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/api/v2/users/${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("User data found");
    return result.json;
  } catch (error) {
    console.error("Could not get metadata:", error);
  }
}
