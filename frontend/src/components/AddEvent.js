import React, { useState } from "react";
import {
  VStack,
  Box,
  Spinner,
  FormControl,
  FormLabel,
  Input,
  Button,
  ButtonGroup,
  useToast,
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useAuthState } from "../contexts";

const createUTCDate = (dateToParse) => {
  const date = dateToParse ? new Date(dateToParse) : new Date();
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    )
  );
};

function AddEvent() {
  const ROOT_URL = process.env.REACT_APP_API_HOST_URL;
  const [formValues, setFormValues] = useState({
    season: "",
    name: "",
    dateRange: [null, null],
  });
  const {
    season,
    name,
    dateRange: [startDate, endDate],
  } = formValues;

  const [isLoading, setIsLoading] = useState(false);

  const currentUser = useAuthState();

  const toast = useToast();

  const handleEventSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const res = await fetch(`${ROOT_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + currentUser.token,
        },
        body: JSON.stringify({
          season: formValues.season,
          name: formValues.name,
          period: {
            startDate: createUTCDate(startDate),
            endDate: createUTCDate(endDate),
          },
        }),
      });
      const resData = await res.json();
      setIsLoading(false);
      if (res.status === 201) {
        clearForm();
        toast({
          title: "Adding an Event",
          description: resData.message,
          status: "success",
          duration: 6000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Adding an Event",
          description: resData.message,
          status: "error",
          duration: 10000,
          isClosable: true,
        });
        return;
      }
    } catch (err) {
      clearForm();
      console.log(err);
    }
  };

  const clearForm = () => {
    setFormValues({
      season: "",
      name: "",
      dateRange: [null, null],
    });
  };

  return (
    <Box
      minWidth={{ base: "90%", md: "35%" }}
      bg="white"
      p="6"
      borderColor="gray.200"
      borderWidth="2px"
      borderRadius="xl"
      boxShadow="sm"
      align="center"
    >
      <VStack spacing="30">
        {isLoading ? (
          <Spinner
            p="50"
            thickness="8px"
            speed="0.65s"
            emptyColor="gray.200"
            color="red.500"
            size="2xl"
          />
        ) : (
          <>
            <FormControl id="season" maxW="80%" isRequired>
              <FormLabel>Season</FormLabel>
              <Input
                minW="100%"
                placeholder="Season"
                name="season"
                focusBorderColor="red.500"
                width="50%"
                isRequired
                value={season}
                onChange={(e) => {
                  e.persist();
                  setFormValues({ ...formValues, season: e.target.value });
                }}
              />
            </FormControl>
            <FormControl id="name" maxW="80%" isRequired>
              <FormLabel>Event Name</FormLabel>
              <Input
                minW="100%"
                placeholder="Event Name"
                name="name"
                focusBorderColor="red.500"
                width="50%"
                isRequired
                value={name}
                onChange={(e) => {
                  setFormValues({ ...formValues, name: e.target.value });
                }}
              />
            </FormControl>
            <FormControl id="duration" maxW="80%" isRequired>
              <FormLabel>Duration</FormLabel>
              <Box width="100%">
                <DatePicker
                  selectsRange={true}
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(update) => {
                    setFormValues({ ...formValues, dateRange: update });
                  }}
                  isClearable={true}
                />
              </Box>
            </FormControl>
            <ButtonGroup alignSelf="flex-end" size="md">
              <Button onClick={handleEventSubmit} colorScheme="red">
                Add Event
              </Button>
              <Button onClick={clearForm} colorScheme="gray">
                Clear
              </Button>
            </ButtonGroup>
          </>
        )}
      </VStack>
    </Box>
  );
}

export default AddEvent;
