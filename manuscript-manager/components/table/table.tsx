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
import { fakeManuscripts } from "@/data/Manuscripts";

//This component is used to place manuscript data into a table.
interface ManuscriptType {
  user: string;
  payrate: number;
  date: Date;
  manuscriptID: string;
  wordcount: number;
  latex: boolean;
  double: boolean;
  triple: boolean;
  bonus: number;
  turnAround: string;
  authorBio: number;
}

interface ManuscriptTableProps {
  data: ManuscriptType[];
  caption?: string;
}
export default function ManuscriptTable({
  data,
  caption,
}: ManuscriptTableProps) {
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
          {data.map((manuscript) => {
            return (
              <Tr>
                <Td>{manuscript.date.toDateString()}</Td>
                <Td>{manuscript.user}</Td>
                <Td>{manuscript.manuscriptID}</Td>
                <Td>{manuscript.wordcount}</Td>
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
