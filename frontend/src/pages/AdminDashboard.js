import React, { useState } from "react";

import {
  VStack,
  useToast,
  Flex,
  Box,
  FormControl,
  FormLabel,
  ButtonGroup,
  Button,
  Input,
  Spinner,
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useAuthState } from "../contexts";

import TopSec from "../components/TopSec.js";

function AdminDashboard() {
  const ROOT_URL = process.env.REACT_APP_API_HOST_URL;
  const [formValues, setFormValues] = useState({
    season: "",
    name: "",
    dateRange: [new Date(), null],
  });
  const {
    season,
    name,
    dateRange: [startDate, endDate],
  } = formValues;

  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isEndingWeek, setIsEndingWeek] = useState(false);
  const [isEndingMonth, setIsEndingMonth] = useState(false);

  const currentUser = useAuthState();

  const toast = useToast();

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch(`${ROOT_URL}/items/sync`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + currentUser.token,
        },
      });
      const resData = await res.json();
      setIsSyncing(false);
      if (res.status !== 200) {
        toast({
          title: "Syncing",
          description: "Syncing Failed! Please, try again!",
          status: "error",
          duration: 10000,
          isClosable: true,
        });
        throw Error(resData.message);
      }
      toast({
        title: "Syncing",
        description: `${resData.message}. ${resData.newVideosCount} new videos were added.`,
        status: "success",
        duration: 6000,
        isClosable: true,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleEndWeek = async () => {
    setIsEndingWeek(true);
    try {
      const res = await fetch(`${ROOT_URL}/items/endWeek`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + currentUser.token,
        },
      });
      const resData = await res.json();
      setIsEndingWeek(false);
      if (res.status !== 200) {
        toast({
          title: "Ending the week",
          description: "Failed to end the Week",
          status: "error",
          duration: 10000,
          isClosable: true,
        });
        throw Error(resData.message);
      }
      toast({
        title: "Ending the week",
        description: `${resData.message}. The new week is: ${resData.newWeek}.`,
        status: "success",
        duration: 6000,
        isClosable: true,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleEndMonth = async () => {
    setIsEndingMonth(true);
    try {
      const res = await fetch(`${ROOT_URL}/items/endMonth`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + currentUser.token,
        },
      });
      const resData = await res.json();
      setIsEndingMonth(false);
      if (res.status !== 200) {
        toast({
          title: "Ending the Month",
          description: "Failed to end the Month",
          status: "error",
          duration: 10000,
          isClosable: true,
        });
        throw Error(resData.message);
      }
      toast({
        title: "Ending the Month",
        description: `${resData.message}. The new Month is: ${resData.newMonth}.`,
        status: "success",
        duration: 6000,
        isClosable: true,
      });
    } catch (err) {
      console.log(err);
    }
  };

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
        body: JSON.stringify({ ...formValues, period: { startDate, endDate } }),
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
      dateRange: [new Date(), null],
    });
  };

  return (
    <VStack bg="#fafafa" minH="100vh">
      <Box
        width="100vw"
        py={5}
        px={{ base: 30, lg: 45 }}
        maxH="100px"
        position="fixed"
        zIndex="banner"
        bg="white"
        borderBottomWidth="2px"
        borderColor="gray.200"
        boxShadow="sm"
        display="flex"
        justify="center"
        align="center"
      >
        <TopSec dashboard="admin" />
      </Box>
      <Flex width="100%" pt="18vh" flexDirection="column" align="center">
        <ButtonGroup
          maxW="75vw"
          spacing="25"
          bg="white"
          p="4"
          mb="5vh"
          colorScheme="red"
          borderColor="gray.200"
          borderWidth="2px"
          borderRadius="xl"
          boxShadow="sm"
        >
          <Button
            isLoading={isSyncing}
            loadingText="Syncing"
            onClick={handleSync}
          >
            Sync
          </Button>
          <Button
            isLoading={isEndingWeek}
            loadingText="Ending Week"
            onClick={handleEndWeek}
          >
            End Week
          </Button>
          <Button
            isLoading={isEndingMonth}
            loadingText="Ending Month"
            onClick={handleEndMonth}
          >
            End Month
          </Button>
        </ButtonGroup>
        <VStack
          minW="35vw"
          spacing="30"
          bg="white"
          p="6"
          borderColor="gray.200"
          borderWidth="2px"
          borderRadius="xl"
          boxShadow="sm"
          align="center"
        >
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
      </Flex>
    </VStack>
  );
}

export default AdminDashboard;
