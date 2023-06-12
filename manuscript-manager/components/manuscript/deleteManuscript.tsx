import { ManuscriptType } from "@/types/manuscripts";

interface UpdateManuscriptButtonProps {
  manuscript: ManuscriptType;
}

export const DeleteManuscriptButton: React.FC<UpdateManuscriptButtonProps> = ({
  manuscript,
}) => {
  const deleteManuscript = async () => {
    console.log("ManuscriptID:", manuscript._id);
    const response = await fetch("/api/manuscripts/deleteManuscript", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: manuscript._id }),
    });

    const json = await response.json();
    if (!response.ok) {
      console.log("There was an error deleting the manuscript.");
    }
    if (response.ok) {
      console.log("Response:", json);
    }
  };

  return <button onClick={deleteManuscript}>Delete</button>;
};
