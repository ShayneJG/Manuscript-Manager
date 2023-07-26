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
  useToast,
  FormLabel,
  FormHelperText,
  Checkbox,
  Stack,
  Button,
  Tooltip,
  Grid,
  GridItem,
  FormErrorMessage,
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
  setManuscriptToUpdate: (manuscript: ManuscriptType | undefined) => void;
}

export default function CreateManuscript({
  manuscriptToUpdate,
  setManuscriptsInState,
  user,
  setManuscriptToUpdate,
}: CreateManuscriptProps) {
  //manuscript state
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
  //Error states
  const [manuscriptIDError, setManuscriptIDError] = useState<boolean>(false);
  const [wordCountError, setwordCountError] = useState<boolean>(false);
  const [turnAroundError, setTurnAroundError] = useState<boolean>(false);
  //button loading state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  //toast
  const toast = useToast();
  function formValidation() {
    //reset any previous errors
    setManuscriptIDError(false);
    setTurnAroundError(false);
    setwordCountError(false);
    let validates: boolean = true;
    const turnAroundRegex =
      /^(?:[0-9]|[0-9][0-9]):(?:[0-5][0-9]):(?:[0-5][0-9])$/;

    if (!manuscriptID) {
      setManuscriptIDError(true);
      validates = false;
    }

    if (!turnAroundRegex.test(turnAround)) {
      setTurnAroundError(true);
      validates = false;
    }
    if (!wordCount) {
      setwordCountError(true);
      validates = false;
    }
    return validates;
  }

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

        setManuscriptsInState(json);
      }
    } catch (error) {
      console.error("Error getting manuscripts:", error);
    }
  }

  // Handles submission of a manuscript
  async function handleSubmit(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setIsLoading(true);
    const userInfo = {
      user: name,
      payRate: payRate,
    };
    try {
      if (formValidation()) {
        const response = await handleManuscripts(
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
        //pop the toast based on response
        response === "success"
          ? toast({
              title: "Manuscript uploaded.",
              status: "success",
              duration: 5000,
            })
          : toast({
              title: "Manuscript failed to upload.",
              status: "error",
              description: `${response}`,
            });
      }
    } finally {
      setIsLoading(false);
    }
  }

  // Handles updating of a manuscript
  async function handleUpdate(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setIsLoading(true);

    const userInfo = {
      user: name,
      payRate: payRate,
    };
    try {
      if (formValidation()) {
        let success = await handleManuscripts(
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
        success && setManuscriptToUpdate(undefined);
      }
    } finally {
      setIsLoading(false);
    }
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
          <FormControl isRequired id="date">
            <FormLabel htmlFor="date-picker" fontSize="sm">
              Date
            </FormLabel>
            <Box>
              {/* Chakra UI does not have a date picker component. It has an input of type date,
          but that was too weird to use, so we are using react-datepicker here, which simplifies things a lot */}
              <DatePicker
                id="date-picker"
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
          <FormControl
            isInvalid={manuscriptIDError}
            id="manuscript ID"
            isRequired
          >
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
            <FormErrorMessage>Cannot be blank</FormErrorMessage>
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
          <FormControl isInvalid={wordCountError} id="wordCount" isRequired>
            <FormLabel fontSize="sm">Wordcount</FormLabel>
            <Input
              type="number"
              placeholder="4156"
              value={!wordCount ? "" : wordCount}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setWordCount(e.target.valueAsNumber);
              }}
              size="sm"
            />{" "}
            <FormErrorMessage>Cannot be blank</FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem alignSelf="end">
          <Stack direction="row" id="checkboxes">
            <Checkbox
              id="latex"
              isChecked={latex}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setLatex(e.target.checked);
              }}
            >
              <FormLabel htmlFor="latex" margin={0} fontSize="sm">
                LaTeX
              </FormLabel>
            </Checkbox>
            <Checkbox
              id="double"
              isChecked={double}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setDouble(e.target.checked);
              }}
            >
              <FormLabel htmlFor="double" margin={0} fontSize="sm">
                Double
              </FormLabel>
            </Checkbox>
            <Checkbox
              id="triple"
              isChecked={triple}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setTriple(e.target.checked);
              }}
            >
              <FormLabel htmlFor="triple" margin={0} fontSize="sm">
                Triple
              </FormLabel>
            </Checkbox>
          </Stack>
        </GridItem>
        <GridItem>
          <FormControl
            isInvalid={turnAroundError}
            isRequired
            id="turnAround time"
          >
            <FormLabel fontSize="sm">Turnaround Time</FormLabel>
            <Input
              placeholder="Turnaround"
              value={turnAround}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setTurnAround(e.target.value)
              }
              size="sm"
            />{" "}
            <FormErrorMessage>Must be in the format: 00:00:00</FormErrorMessage>
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
                isLoading={isLoading}
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
                isLoading={isLoading}
                isDisabled={name && payRate ? false : true}
                onClick={(e) => handleSubmit(e)}
                className="w-full"
              >
                Submit
              </Button>
            </Tooltip>
          )}
          <Button
            onClick={() => {
              resetManuscriptState();
            }}
          >
            Reset
          </Button>
        </GridItem>
      </Grid>
    </Box>
  );
}
