import { ManuscriptType } from "@/types/manuscripts";

interface UpdateManuscriptButtonProps {
  manuscript: ManuscriptType;
}

export const UpdateManuscriptButton: React.FC<UpdateManuscriptButtonProps> = ({
  manuscript,
}) => {
  return <button>Update</button>;
};
