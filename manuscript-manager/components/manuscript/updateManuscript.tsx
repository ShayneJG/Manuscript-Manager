import { ManuscriptType } from "@/types/manuscripts";

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

  return <button onClick={() => handleEditClick(manuscript)}>Update</button>;
}
