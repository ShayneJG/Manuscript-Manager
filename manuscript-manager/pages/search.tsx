import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import Head from "next/head";
import UserType from "@/types/user";
import {
  Alert,
  AlertIcon,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalContent,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ManuscriptTable from "@/components/table/table";
import { ManuscriptType } from "@/types/manuscripts";
import CreateManuscript from "@/components/manuscript/createManuscript";
import clientPromise from "@/lib/mongodb";
import { authOptions } from "./api/auth/[...nextauth]";

interface SearchProps {
  user: UserType;
}

export default function Search({ user }: SearchProps) {
  const { status, data: session } = useSession();
  const [manIdError, setManIdError] = useState(false);
  const [manuscriptID, setManuscriptID] = useState("");
  const [manuscriptToUpdate, setManuscriptToUpdate] = useState<
    ManuscriptType | undefined
  >(undefined);
  const [manuscriptsInState, setManuscriptsInState] = useState<
    ManuscriptType[]
  >([]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  useEffect(() => {
    manuscriptToUpdate ? onOpen() : onClose();
  }, [manuscriptToUpdate]);

  const toast = useToast();

  const handleSubmit = async () => {
    setManIdError(false);
    if (manuscriptID === "") {
      setManIdError(true);
      return undefined;
    } else {
      try {
        const result = await fetch(
          `api/manuscripts/getManuscript?identification=${manuscriptID}`
        );

        if (result.status === 404) {
          toast({
            title: "Manuscript not found",
            description: `${manuscriptID} cannot be found, please try again`,
            status: "info",
            duration: 2000,
            isClosable: true,
          });
          return undefined;
        }

        if (result.ok) {
          const manuscript = await result.json();

          setManuscriptsInState([manuscript]);
        }
      } catch (e: any) {
        console.error(e.message);
      }
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

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <CreateManuscript
              user={user}
              setManuscriptToUpdate={setManuscriptToUpdate}
              manuscriptToUpdate={manuscriptToUpdate}
              setManuscriptsInState={setManuscriptsInState}
            />
          </ModalContent>
        </Modal>

        <FormControl isInvalid={manIdError} isRequired>
          <FormLabel>Manuscript ID</FormLabel>
          <Input
            value={manuscriptID}
            onChange={(e) => {
              setManuscriptID(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit();
              }
            }}
          ></Input>
          <FormErrorMessage>
            Please insert a valid manuscript ID
          </FormErrorMessage>
          <Button
            type="submit"
            onClick={() => {
              handleSubmit();
            }}
          >
            Search
          </Button>
        </FormControl>

        <ManuscriptTable
          includeDate
          data={manuscriptsInState}
          setManuscriptToUpdate={setManuscriptToUpdate}
          setManuscriptsInState={setManuscriptsInState}
        />
      </main>
    );
  }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const client = await clientPromise;
  const db = client.db();

  // gets userdata from the session and passes a user object to the page. This is basically the same data as the user session, but it has the payrate added.

  const session = await getServerSession(context.req, context.res, authOptions);

  let user: UserType = {
    name: "guest",
    email: "guest@email.com",
    payRate: Number(process.env.PAYRATE_DEFAULT),
  };

  if (session) {
    // Find the document with the same email
    const email = session?.user?.email;
    const userData = await db.collection("users").findOne({ email });

    //creates and passes user object for email and payrate usage. Probably not the correct way, as this overlaps with getSession, but it works.
    user = {
      name: userData?.name,
      email: userData?.email,
      payRate: userData?.payRate ? userData.payRate : null,
    };
    // console.log("user updated: ", user);
  }
  return {
    props: {
      user,
    },
  };
};
