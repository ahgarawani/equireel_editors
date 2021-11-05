import React, { useState } from "react";

import { useToast, ButtonGroup, Button, Box } from "@chakra-ui/react";

import { useAuthState } from "../contexts";

function GeneralAdminControls() {
  const ROOT_URL = process.env.REACT_APP_API_HOST_URL;

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
      const res = await fetch(`${ROOT_URL}/configs/endWeek`, {
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
      const res = await fetch(`${ROOT_URL}/configs/endMonth`, {
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

  return (
    <Box
      maxW={{ base: "90%", md: "100%" }}
      mb={{ base: "20px", xl: "30px" }}
      bg="white"
      p="4"
      borderColor="gray.200"
      borderWidth="2px"
      borderRadius="xl"
      boxShadow="sm"
    >
      <ButtonGroup
        width="100%"
        colorScheme="red"
        spacing={{ base: "15", md: "25" }}
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
    </Box>
  );
}

export default GeneralAdminControls;
