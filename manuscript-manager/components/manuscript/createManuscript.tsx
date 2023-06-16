import { ManuscriptType } from "@/types/manuscripts";
import DatePicker from "react-datepicker";
import { MouseEvent } from "react";

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
  Tooltip,
} from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";
import UserType from "@/types/user";
import { useEffect } from "react";
import { handleManuscripts } from "@/utils/handleManuscripts";
//this component handles the creation of new manuscripts, and will eventually send the manuscript as a request to the backend.

interface CreateManuscriptProps {
  manuscriptToUpdate?: ManuscriptType;
  setManuscriptsInState: (manuscript: ManuscriptType[]) => void;
  user: UserType
}

export default function CreateManuscript({
  manuscriptToUpdate,
  setManuscriptsInState,
  user
}: CreateManuscriptProps) {
  const [manuscriptID, setManuscriptID] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [wordCount, setWordCount] = useState<number | undefined>();
  const [latex, setLatex] = useState<boolean>(false);
  const [double, setDouble] = useState<boolean>(false);
  const [triple, setTriple] = useState<boolean>(false);
  const [bonus, setBonus] = useState<number>(0);
  const [turnAround, setTurnAround] = useState<string>("");
  const [authorBio, setAuthorBio] = useState<number>(0);
  const name = user.name || undefined;
  const payRate = user.payRate || undefined;

  // Resets state to default values.
  function resetManuscriptState() {
    setManuscriptID("");
    setDate(new Date());
    setWordCount(undefined);
    setLatex(false);
    setDouble(false);
    setTriple(false);
    setBonus(0);
    setTurnAround("");
    setAuthorBio(0);
  }

  // Fetches today's manuscripts from db
  async function getTodaysManuscripts() {
    // update manuscripts in state
    try {
      const response = await fetch("/api/manuscripts/getTodaysManuscripts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await response.json();

      if (!response.ok) {
        console.log("There was an error getting the manuscripts.");
      }

      if (response.ok) {
        // update todays manuscripts in state
        console.log("Response ok:", json);

        setManuscriptsInState(json);
      }
    } catch (error) {
      console.error("Error getting manuscripts:", error);
    }
  }

  // Handles submission of a manuscript
  async function handleSubmit(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    const userInfo = {
      user: name,
      payrate: payRate
    }
    
    handleManuscripts(
      "POST",
      resetManuscriptState,
      getTodaysManuscripts,
      date,
      manuscriptID,
      wordCount,
      latex,
      double,
      triple,
      bonus,
      turnAround,
      authorBio,
      userInfo,
      undefined
    }
  }

  // Handles updating of a manuscript
  async function handleUpdate(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    
    const userInfo = {
      user: name,
      payrate: payRate
    }
    
    handleManuscripts(
      "PATCH",
      resetManuscriptState,
      getTodaysManuscripts,
      date,
      manuscriptID,
      wordCount,
      latex,
      double,
      triple,
      bonus,
      turnAround,
      authorBio,
      userInfo,
      manuscriptToUpdate
    );
  }

  // If there is a manuscript being updated, sets state values accordingly so the manuscript details are displayed in the form ready to edit
  useEffect(() => {
    if (manuscriptToUpdate) {
      const m = manuscriptToUpdate;
      // convert m.date (string) into Date
      const inputDate = new Date(m.date);
      setManuscriptID(m.manuscriptID);
      setDate(inputDate);
      setWordCount(m.wordCount);
      setLatex(m.latex);
      setDouble(m.double);
      setTriple(m.triple);
      setBonus(m.bonus);
      setTurnAround(m.turnAround);
      setAuthorBio(m.authorBio);
    }
  }, [manuscriptToUpdate]);

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
          required
        />
      </FormControl>

      <FormControl id="wordCount" isRequired>
        <FormLabel>Wordcount</FormLabel>
        <Input
          type="number"
          value={!wordCount ? "" : wordCount}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setWordCount(e.target.valueAsNumber);
          }}
        />
      </FormControl>
      <FormControl isRequired id="turnAround time">
        <FormLabel>Turnaround Time</FormLabel>
        <Input
          placeholder="Turnaround"
          value={turnAround}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setTurnAround(e.target.value)
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
          value={authorBio}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setAuthorBio(e.target.valueAsNumber);
          }}
        />
      </FormControl>
    {manuscriptToUpdate ? (
        <Tooltip hasArrow bg="red.600" label="No user or pay rate found. If logged in, please ensure your profile is up-to-date" isDisabled={name && payRate ? true : false}>
      <Button isDisabled={name && payRate ? false : true} onClick={(e) => handleUpdate(e)}>Update</Button></Tooltip>
      ) : (
        <Tooltip hasArrow bg="red.600" label="No user or pay rate found. If logged in, please ensure your profile is up-to-date" isDisabled={name && payRate ? true : false}>
      <Button isDisabled={name && payRate ? false : true} onClick={(e) => handleSubmit(e)}>Submit</Button></Tooltip>
      )}
    </Box>
  );
}
