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

//This component is used to place manuscript data into a table.

interface ManuscriptTableProps {
  data: ManuscriptType[];
  caption?: string;
}

// Takes data and caption passed from Home component and displays it in a table.
export default function ManuscriptTable({
  data,
  caption,
}: ManuscriptTableProps) {
  
  const testDate = new Date('2011-04-11T10:20:30Z')
  console.log(testDate.toDateString());
  
  let tick: string = "✓";
  return (
    <TableContainer>
      <Table variant={"striped"}>
        {caption ? <TableCaption>{caption}</TableCaption> : undefined}
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th>User</Th>
            <Th>Manuscript</Th>
            <Th>Wordcount</Th>
            <Th>LaTeX</Th>
            <Th>Double</Th>
            <Th>Triple</Th>
            <Th>Bonus</Th>
            <Th>TurnAround</Th>
            <Th>Author Biography</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((manuscript, index) => {
            
            // getServerSideProps returns dates as strings - see the required workaround solution in index.tsx
            // so they need to be converted back into dates and then toDateString() to display them as needed for the table
            const date = new Date(manuscript.date) 
            
            return (
              <Tr key={index}>
                <Td>{date.toDateString()}</Td>
                <Td>{manuscript.user}</Td>
                <Td>{manuscript.manuscriptID}</Td>
                <Td>{manuscript.wordCount}</Td>
                <Td>{manuscript.latex ? tick : undefined}</Td>
                <Td>{manuscript.double ? tick : undefined}</Td>
                <Td>{manuscript.triple ? tick : undefined}</Td>
                <Td>{manuscript.bonus}</Td>
                <Td>{manuscript.turnAround}</Td>
                <Td>{manuscript.authorBio}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
