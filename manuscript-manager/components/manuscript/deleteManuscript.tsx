// takes manuscript as a prop from the table
// so manuscript will correspond with it's own delete button

import { ManuscriptType } from "@/types/manuscripts";

interface UpdateManuscriptButtonProps {
  manuscript: ManuscriptType;
}

export const DeleteManuscriptButton: React.FC<UpdateManuscriptButtonProps> = ({
  manuscript,
}) => {
  const deleteManuscript = async () => {
    try {
      console.log("_id:", manuscript._id);

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
  };

  return <button onClick={deleteManuscript}>Delete</button>;
};
