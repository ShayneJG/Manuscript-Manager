import { ManuscriptType } from "@/types/manuscripts";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import {
  Input,
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";
//this component handles the creation of new manuscripts, and will eventually send the manuscript as a request to the backend.

export default function CreateManuscript() {
  const [manuscriptID, setManuscriptID] = useState<string>("");
  const [manuscriptDate, setManuscriptDate] = useState<Date>(new Date());
  return (
    <div>
      <FormControl isRequired>
        <FormLabel>Manuscript ID</FormLabel>
        <Input
          id="Manuscript ID"
          placeholder="Manuscript ID"
          value={manuscriptID}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setManuscriptID(e.target.value)
          }
        />
      </FormControl>
      <FormControl>
        <FormLabel>Date</FormLabel>
        <Box>
          {/* Chakra UI does not have a date picker component. It has an input of type date,
          but that was too weird to use, so we are using react-datepicker here, which simplifies things a lot */}
          <DatePicker
            dateFormat={"dd/MM/yyyy"}
            selected={manuscriptDate}
            onChange={(date: Date) => setManuscriptDate(date)}
          />
        </Box>
      </FormControl>
    </div>
  );
}
