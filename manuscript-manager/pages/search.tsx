import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import Head from "next/head";
import UserType from "@/types/user";
import {
  Alert,
  AlertIcon,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function Search() {
  const { status, data: session } = useSession();
  const [manIdError, setManIdError] = useState(false);
  const [manuscriptID, setManuscriptID] = useState("");

  const handleSubmit = async () => {
    setManIdError(false);
    if (manuscriptID === "") {
      setManIdError(true);
      return undefined;
    } else {
        const result = await fetch("")
    }
  };

  if (status === "unauthenticated") {
    return (
      <Alert status="error">
        <AlertIcon />
        User not Logged in
      </Alert>
    );
  } else if (status === "loading") {
    return <Spinner></Spinner>;
  } else {
    return (
      <main>
        <Head>
          <title>Manuscript Search</title>
        </Head>

        <FormControl isInvalid={manIdError} isRequired>
          <FormLabel>Manuscript ID</FormLabel>
          <Input value={manuscriptID}></Input>
          <FormErrorMessage>
            Please insert a valid manuscript ID
          </FormErrorMessage>
        </FormControl>
      </main>
    );
  }
}
