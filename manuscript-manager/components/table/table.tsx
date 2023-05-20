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
interface manuscriptType {
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
export default function ManuscriptTable(
  data: manuscriptType[],
  caption?: string
) {
  return (
    <TableContainer>
      <Table>
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
      </Table>
    </TableContainer>
  );
}
