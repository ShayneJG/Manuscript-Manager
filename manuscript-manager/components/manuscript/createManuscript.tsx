import { ManuscriptType } from "@/types/manuscripts";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Input,
  Box,
  FormControl,
  FormLabel,
  FormHelperText,
  Checkbox,
  Stack,
  Button,
} from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";
//this component handles the creation of new manuscripts, and will eventually send the manuscript as a request to the backend.

export default function CreateManuscript() {
  const [manuscriptID, setManuscriptID] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [wordcount, setWordcount] = useState<number>();
  const [latex, setLatex] = useState<boolean>(false);
  const [double, setDouble] = useState<boolean>(false);
  const [triple, setTriple] = useState<boolean>(false);
  const [bonus, setBonus] = useState<number>(0);
  const [turnaround, setTurnaround] = useState<string>("");
  const [authorbio, setAuthorbio] = useState<number>(0);

  //TODO: OnSubmit function sends SET request for manuscript to backend.
  return (
    <Box borderWidth="1px" borderRadius="lg" p={2}>
      <FormControl id="date">
        <FormLabel>Date</FormLabel>
        <Box>
          {/* Chakra UI does not have a date picker component. It has an input of type date,
          but that was too weird to use, so we are using react-datepicker here, which simplifies things a lot */}
          <DatePicker
            dateFormat={"dd/MM/yyyy"}
            selected={date}
            onChange={(date: Date) => setDate(date)}
          />
        </Box>
      </FormControl>
      <FormControl id="manuscript ID" isRequired>
        <FormLabel>Manuscript ID</FormLabel>
        <Input
          placeholder="Manuscript ID"
          value={manuscriptID}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setManuscriptID(e.target.value)
          }
        />
      </FormControl>

      <FormControl id="wordcount" isRequired>
        <FormLabel>Wordcount</FormLabel>
        <Input
          type="number"
          value={wordcount}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setWordcount(e.target.valueAsNumber);
          }}
        />
      </FormControl>
      <FormControl isRequired id="turnaround time">
        <FormLabel>Turnaround Time</FormLabel>
        <Input
          value={turnaround}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setTurnaround(e.target.value)
          }
        />
      </FormControl>
      {/* Boxing together the 3 toggle options to make layout simpler
          The checkbox component from Chakra UI also appears to use the HTMLInputElement type.
      */}
      <Stack direction="row" spacing={`2rem`} id="checkboxes">
        <Checkbox
          checked={latex}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setLatex(e.target.checked);
          }}
        >
          LaTeX
        </Checkbox>
        <Checkbox
          checked={double}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setDouble(e.target.checked);
          }}
        >
          Double
        </Checkbox>
        <Checkbox
          checked={triple}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setTriple(e.target.checked);
          }}
        >
          Triple
        </Checkbox>
      </Stack>
      <FormControl id="bonus">
        <FormLabel>Bonus</FormLabel>
        <NumberInput
          value={bonus + "%"}
          onChange={(e: string) => {
            const inputValue = e;
            const numericValue = Number(inputValue.replace("%", ""));
            if (!isNaN(numericValue)) {
              setBonus(numericValue);
            }
          }}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>

        <FormHelperText>
          Bonuses are sometimes offered by the English Department
        </FormHelperText>
      </FormControl>

      <FormControl id="author biography">
        <FormLabel>Author Biography</FormLabel>
        <Input
          type="number"
          value={authorbio}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setAuthorbio(e.target.valueAsNumber);
          }}
        />
      </FormControl>
      <Button>Submit</Button>
    </Box>
  );
}
