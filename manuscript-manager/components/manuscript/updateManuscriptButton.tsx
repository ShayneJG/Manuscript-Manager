import { ManuscriptType } from "@/types/manuscripts";
import { Button } from "@chakra-ui/react";

interface UpdateManuscriptButtonProps {
  manuscript: ManuscriptType;
  setManuscriptToUpdate: (manuscript: ManuscriptType) => void;
}

export default function UpdateManuscriptButton({
  manuscript,
  setManuscriptToUpdate,
}: UpdateManuscriptButtonProps) {
  const handleEditClick = (manuscript: ManuscriptType) => {
    setManuscriptToUpdate(manuscript);
  };

  return <Button size={'sm'} colorScheme="blue" onClick={() => handleEditClick(manuscript)}>Update</Button>;
}
