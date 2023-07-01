import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import { ManuscriptType } from "@/types/manuscripts";
import DeleteManuscriptButton from "../manuscript/deleteManuscriptButton";
import UpdateManuscriptButton from "../manuscript/updateManuscriptButton";
import styles from "/custom styles/tableStyles.module.css";

//This component is used to place manuscript data into a table.

interface ManuscriptTableProps {
  data: ManuscriptType[];
  caption?: string;
  setManuscriptToUpdate: (manuscript: ManuscriptType) => void;

  setManuscriptsInState: (manuscript: ManuscriptType[]) => void;
}

// Takes data and caption passed from Home component and displays it in a table.
export default function ManuscriptTable({
  data,
  caption,
  setManuscriptToUpdate,

  setManuscriptsInState,
}: ManuscriptTableProps) {
  let tick: string = "✓";
  return (
    <TableContainer>
      <Table variant={"striped"} size="md">
        {caption ? <TableCaption>{caption}</TableCaption> : undefined}
        <Thead>
          <Tr>
            <Th maxWidth="100px">Manuscript</Th>
            <Th maxWidth="60px">Wordcount</Th>
            <Th maxWidth="60px">LaTeX</Th>
            <Th maxWidth="60px">Double</Th>
            <Th maxWidth="60px">Triple</Th>
            <Th maxWidth="60px">Bonus</Th>
            <Th maxWidth="60px">Turnaround</Th>
            <Th maxWidth="60px">Author Bio</Th>
            <Th maxWidth="60px">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((manuscript, index) => {
            // getServerSideProps is returning the dates as strings - see the required workaround solution in index.tsx
            // so they need to be converted back into dates and then toDateString() to display them as needed for the table
            const date = new Date(manuscript.date);

            return (
              <Tr key={index}>
                {/* <Td>{date.toDateString()}</Td>
                <Td>{manuscript.user}</Td> */}
                <Td>{manuscript.manuscriptID}</Td>
                <Td>{manuscript.wordCount}</Td>
                <Td>{manuscript.latex ? tick : undefined}</Td>
                <Td>{manuscript.double ? tick : undefined}</Td>
                <Td>{manuscript.triple ? tick : undefined}</Td>
                <Td>{manuscript.bonus}</Td>
                <Td>{manuscript.turnAround}</Td>
                <Td>{manuscript.authorBio}</Td>
                <Td>
                  <UpdateManuscriptButton
                    setManuscriptToUpdate={setManuscriptToUpdate}
                    manuscript={manuscript}
                  />
                  <DeleteManuscriptButton
                    manuscript={manuscript}
                    manuscriptsInState={data}
                    setManuscriptsInState={setManuscriptsInState}
                  />
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
