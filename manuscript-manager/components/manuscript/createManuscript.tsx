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
import { DM_Serif_Display } from "next/font/google";
import { useEffect } from "react";
//this component handles the creation of new manuscripts, and will eventually send the manuscript as a request to the backend.

interface CreateManuscriptProps {
  manuscriptToUpdate?: ManuscriptType;
}

export default function CreateManuscript({
  manuscriptToUpdate,
}: CreateManuscriptProps) {
  const [manuscriptID, setManuscriptID] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [wordCount, setWordCount] = useState<number>();
  const [latex, setLatex] = useState<boolean>(false);
  const [double, setDouble] = useState<boolean>(false);
  const [triple, setTriple] = useState<boolean>(false);
  const [bonus, setBonus] = useState<number>(0);
  const [turnAround, setTurnAround] = useState<string>("");
  const [authorBio, setAuthorBio] = useState<number>(0);

  // Sends a POST request through the postManuscript API endpoint
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // capture date manuscript was submitted (previously Mongoose did this for us)
    const createdAt = new Date().toISOString();

    const manuscript = {
      date,
      manuscriptID,
      wordCount,
      latex,
      double,
      triple,
      bonus,
      turnAround,
      authorBio,
      createdAt,
    };

    console.log("manuscript submitted: ", JSON.stringify(manuscript));
    const response = await fetch("/api/manuscripts/postManuscript", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(manuscript),
    });

    const json = await response.json();

    if (!response.ok) {
      console.log("There was an error submitting the manuscript.");
    }

    if (response.ok) {
      // TODO: reset state values and input fields
      console.log("Response ok:", json);
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
  };

  // sents a PATCH request through the updateManuscript API endpoint
  const handleUpdate = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // capture date manuscript was submitted (previously Mongoose did this for us)
    const updatedAt = new Date().toISOString();
    const createdAt = manuscriptToUpdate?.createdAt;

    const manuscript = {
      date,
      manuscriptID,
      wordCount,
      latex,
      double,
      triple,
      bonus,
      turnAround,
      authorBio,
      createdAt,
      updatedAt,
    };

    console.log("manuscript updated: ", JSON.stringify(manuscript));
    if (manuscriptToUpdate) {
      try {
        const response = await fetch(
          `/api/manuscripts/updateManuscript?id=${manuscriptToUpdate._id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(manuscript),
          }
        );

        const json = await response.json();

        if (!response.ok) {
          console.log("There was an error updating the manuscript.");
        }

        if (response.ok) {
          // reset state values and input fields
          console.log("Response ok:", json);
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
      } catch (error) {
        console.error(e);
      }
    }
  };

  // if there is a manuscript to update, set state values accordingly
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
          value={wordCount}
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
        <Button onClick={(e) => handleUpdate(e)}>Update</Button>
      ) : (
        <Button onClick={(e) => handleSubmit(e)}>Submit</Button>
      )}
    </Box>
  );
}
