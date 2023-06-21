// takes manuscript as a prop from the table
// so manuscript will correspond with it's own delete button

import { ManuscriptType } from "@/types/manuscripts";
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, useDisclosure } from "@chakra-ui/react";
import { RefObject, useRef } from "react";

interface DeleteManuscriptButtonProps {
  manuscript: ManuscriptType;
  manuscriptsInState: ManuscriptType[] | undefined;
  setManuscriptsInState: (manuscript: ManuscriptType[]) => void;
}

export default function DeleteManuscriptButton({
  manuscript,
  manuscriptsInState,
  setManuscriptsInState,
}: DeleteManuscriptButtonProps) {

  //Hooks for alert
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<any>() //Could not figure out typing. leastDestructiveRef requires RefObject<FocusableElement>. RefObject comes from react, but I could not find FocusableElement as a type in what we have. 

  const deleteManuscript = async () => {
    // delete manuscript from state
    if (manuscriptsInState) {
      const filteredManuscripts = manuscriptsInState.filter(
        (m) => m._id !== manuscript._id
      );
      setManuscriptsInState(filteredManuscripts);
    }

    // delete manuscript from db
    try {
      const response = await fetch(
        `/api/manuscripts/deleteManuscript?id=${manuscript._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const json = await response.json();

      if (!response.ok) {
        console.log("There was an error deleting the manuscript.");
      }
      if (response.ok) {
        console.log("Response:", json);
      }
    } catch (error) {
      console.error("Error:", error);
    }
    onClose();
  };

  return <>
  
  <button onClick={onOpen}>Delete</button>

{/* 
  Below is the confirmation popup for the delete button
*/}
  <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
  <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Delete Manuscript
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? This cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme='red' onClick={deleteManuscript} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
  </AlertDialog>


  
  </>;
}
