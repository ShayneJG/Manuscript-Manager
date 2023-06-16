import { ManuscriptType } from "@/types/manuscripts";
import { MouseEvent } from "react";
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
  Tooltip,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";
import UserType from "@/types/user";
import { useEffect } from "react";
import { handleManuscripts } from "@/utils/handleManuscripts";
//this component handles the creation of new manuscripts, and will eventually send the manuscript as a request to the backend.

interface CreateManuscriptProps {
  manuscriptToUpdate?: ManuscriptType;
  setManuscriptsInState: (manuscript: ManuscriptType[]) => void;
  user: UserType;
}

export default function CreateManuscript({
  manuscriptToUpdate,
  setManuscriptsInState,
  user,
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
      payRate: payRate,
    };

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
    );
  }

  // Handles updating of a manuscript
  async function handleUpdate(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    const userInfo = {
      user: name,
      payRate: payRate,
    };

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
      <Grid
        templateColumns="repeat(2, 50%)"
        alignItems="center"
        gap={2}
        width="98%"
      >
        <GridItem>
          <FormControl id="date">
            <FormLabel fontSize="sm">Date</FormLabel>
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
        </GridItem>
        <GridItem>
          <FormControl id="author biography">
            <FormLabel fontSize="sm">Author Biography</FormLabel>
            <Input
              type="number"
              value={authorBio}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setAuthorBio(e.target.valueAsNumber);
              }}
              size="sm"
            />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl id="manuscript ID" isRequired>
            <FormLabel fontSize="sm">Manuscript ID</FormLabel>
            <Input
              placeholder="Manuscript ID"
              value={manuscriptID}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setManuscriptID(e.target.value)
              }
              required
              size="sm"
            />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl id="bonus">
            <FormLabel fontSize="sm">Bonus</FormLabel>
            <NumberInput
              value={bonus + "%"}
              onChange={(e: string) => {
                const inputValue = e;
                const numericValue = Number(inputValue.replace("%", ""));
                if (!isNaN(numericValue)) {
                  setBonus(numericValue);
                }
              }}
              size="sm"
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>

            {/* <FormHelperText>
              Bonuses are sometimes offered by the English Department
            </FormHelperText> */}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl id="wordCount" isRequired>
            <FormLabel fontSize="sm">Wordcount</FormLabel>
            <Input
              type="number"
              placeholder="4156"
              value={!wordCount ? "" : wordCount}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setWordCount(e.target.valueAsNumber);
              }}
              size="sm"
            />
          </FormControl>
        </GridItem>
        <GridItem alignSelf="end">
          <Stack direction="row" id="checkboxes">
            <Checkbox
              checked={latex}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setLatex(e.target.checked);
              }}
            >
              <FormLabel margin={0} fontSize="sm">
                LaTeX
              </FormLabel>
            </Checkbox>
            <Checkbox
              checked={double}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setDouble(e.target.checked);
              }}
            >
              <FormLabel margin={0} fontSize="sm">
                Double
              </FormLabel>
            </Checkbox>
            <Checkbox
              checked={triple}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setTriple(e.target.checked);
              }}
            >
              <FormLabel margin={0} fontSize="sm">
                Triple
              </FormLabel>
            </Checkbox>
          </Stack>
        </GridItem>
        <GridItem>
          <FormControl isRequired id="turnAround time">
            <FormLabel fontSize="sm">Turnaround Time</FormLabel>
            <Input
              placeholder="Turnaround"
              value={turnAround}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setTurnAround(e.target.value)
              }
              size="sm"
            />
          </FormControl>
        </GridItem>
        {/* Boxing together the 3 toggle options to make layout simpler
          The checkbox component from Chakra UI also appears to use the HTMLInputElement type.
      */}

        <GridItem w="100%" alignSelf="end">
          {manuscriptToUpdate ? (
            <Tooltip
              hasArrow
              bg="red.600"
              label="No user or pay rate found. If logged in, please ensure your profile is up-to-date"
              isDisabled={name && payRate ? true : false}
            >
              <Button
                isDisabled={name && payRate ? false : true}
                onClick={(e) => handleUpdate(e)}
                className="w-full"
              >
                Update
              </Button>
            </Tooltip>
          ) : (
            <Tooltip
              hasArrow
              bg="red.600"
              label="No user or pay rate found. If logged in, please ensure your profile is up-to-date"
              isDisabled={name && payRate ? true : false}
            >
              <Button
                isDisabled={name && payRate ? false : true}
                onClick={(e) => handleSubmit(e)}
                className="w-full"
              >
                Submit
              </Button>
            </Tooltip>
          )}
        </GridItem>
      </Grid>
    </Box>
  );
}
