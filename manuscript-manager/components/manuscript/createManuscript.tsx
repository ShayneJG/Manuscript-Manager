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
  FormErrorMessage,
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
  //Manuscript states
  const [manuscriptID, setManuscriptID] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [wordCount, setWordCount] = useState<number | ''>('');
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

  // Resets state to default values.
  function resetManuscriptState() {
    setManuscriptID("");
    setDate(new Date());
    setWordCount('');
    setLatex(false);
    setDouble(false);
    setTriple(false);
    setBonus(0);
    setTurnAround("");
    setAuthorBio(0);
  }

  function formValidation() {
    setManuscriptIDError(false);
    setTurnAroundError(false);
    setwordCountError(false);
    let validates: boolean = true;
    const turnAroundRegex = /^(?:[0-9]|[0-9][0-9]):(?:[0-5][0-9]):(?:[0-5][0-9])$/;

    if(!manuscriptID) {
      setManuscriptIDError(true);
      validates = false;
    }

    if(!turnAroundRegex.test(turnAround)) {
      setTurnAroundError(true);
      validates = false;
    }
    if(!wordCount) {
      setwordCountError(true);
      validates = false;
    } 
    
    console.log(validates)
    return validates;
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

    if(formValidation()) {
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
    );}
  }

  // Handles updating of a manuscript
  async function handleUpdate(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    const userInfo = {
      user: name,
      payRate: payRate,
    };

    



    

    if(formValidation()) {
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
    );}
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
      <FormControl isInvalid={manuscriptIDError} id="manuscript ID" isRequired>
        <FormLabel>Manuscript ID</FormLabel> 
        <Input
          placeholder="Manuscript ID"
          value={manuscriptID}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setManuscriptID(e.target.value)
          }
          required
           size="sm"
        /><FormErrorMessage>Cannot be blank</FormErrorMessage>
      </FormControl>
</GridItem>
  <GridItem>
      <FormControl isInvalid={wordCountError} id="wordCount" isRequired>
        <FormLabel>Wordcount</FormLabel>
        <Input
          type="number"
          value={wordCount}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            if(e.target.value === '') {
              setWordCount('')
            } else {
            setWordCount(Number(e.target.value))
          }
          }}
           size="sm"
        /><FormErrorMessage>Cannot be blank</FormErrorMessage>
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
      <FormControl isInvalid={turnAroundError} isRequired id="turnAround time">
        <FormLabel>Turnaround Time</FormLabel>
        <Input
          placeholder="00:00:00"
          value={turnAround}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>{

            setTurnAround(e.target.value)}
          }
           size="sm"
        /><FormErrorMessage>Must be in the format: 00:00:00</FormErrorMessage>
      </FormControl>
                </GridItem>
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
