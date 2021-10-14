import { useState, useEffect } from "react";
import {
  FormControl,
  Heading,
  Flex,
  Select,
  Input,
  Button,
  ButtonGroup,
  Spinner,
  Spacer,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";

import WorngItemsAlertModal from "./WorngItemsAlertModal";

import { useAuthState } from "../contexts";

import { itemsListReducer } from "../utils";

function AddItem() {
  const ROOT_URL = process.env.REACT_APP_API_HOST_URL;

  const [seasons, setSeasons] = useState([]);
  const [events, setEvents] = useState([]);
  const [addItemFormValues, setAddItemFormValues] = useState({
    season: "",
    event: "",
    type: "",
    itemsValues: "",
  });
  const [nonExistentItems, setNonExistentItems] = useState({
    event: "",
    type: "",
    number: 0,
    items: "",
  });
  const [duplicateItems, setDuplicateItems] = useState({
    event: "",
    type: "",
    number: 0,
    items: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const currentUser = useAuthState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    async function fetchSeasons() {
      try {
        let res = await fetch(`${ROOT_URL}/events/seasons`, {
          headers: {
            Authorization: "Bearer " + currentUser.token,
          },
        });
        if (res.status !== 200) {
          throw new Error("Failed to fetch seasons.");
        }
        let resData = await res.json();
        setSeasons(resData.seasons);
      } catch (err) {
        console.log(err);
      }
    }
    fetchSeasons();
  }, [ROOT_URL, currentUser.token]);

  async function fetchEventsBySeason(season) {
    let url = new URL(`${ROOT_URL}/events/eventsBySeason`),
      params = { season: season };
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );
    try {
      let res = await fetch(url, {
        headers: {
          Authorization: "Bearer " + currentUser.token,
        },
      });
      if (res.status !== 200) {
        throw new Error("Failed to fetch events.");
      }
      let resData = await res.json();
      setEvents(resData.events);
    } catch (err) {
      console.log(err);
    }
  }

  const handleAddItemsSubmit = async (event) => {
    event.preventDefault();
    let formValues = {
      type: addItemFormValues.type,
      event: JSON.parse(addItemFormValues.event),
      itemsValuesArray: addItemFormValues.itemsValues
        .split(/[\s-]+/)
        .map((item) => item.charAt(0).toUpperCase() + item.slice(1)),
    };

    try {
      setIsLoading(true);
      const res = await fetch(`${ROOT_URL}/items/markItemsDone`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + currentUser.token,
        },
        body: JSON.stringify(formValues),
      });
      setIsLoading(false);
      if (res.status !== 201 && res.status !== 207) {
        toast({
          title: "Marking As Done",
          description: "Marking items as done failed! Try Again",
          status: "error",
          duration: 10000,
          isClosable: true,
        });
        throw new Error("Marking items as done failed!");
      }
      const resData = await res.json();
      if (res.status === 201) {
        toast({
          title: "Marking As Done",
          description: resData.message,
          status: "success",
          duration: 6000,
          isClosable: true,
        });
      }
      if (res.status === 207) {
        if (resData.nonExistentItems.itemsValues.length > 0) {
          setNonExistentItems({
            event: resData.nonExistentItems.event.name,
            type: resData.nonExistentItems.type,
            number: resData.nonExistentItems.itemsValues.length,
            items: itemsListReducer(resData.nonExistentItems.itemsValues),
          });
        }
        if (resData.duplicateItems.itemsValues.length > 0) {
          setDuplicateItems({
            event: resData.duplicateItems.event.name,
            type: resData.duplicateItems.type,
            number: resData.duplicateItems.itemsValues.length,
            items: itemsListReducer(resData.duplicateItems.itemsValues),
          });
        }
        onOpen();
      }
      clearForm();
    } catch (err) {
      clearForm();
      console.log(err);
    }
  };

  const clearForm = () => {
    setAddItemFormValues({
      season: "",
      event: "",
      type: "",
      itemsValues: "",
    });
    setEvents([]);
  };

  return isLoading ? (
    <Spinner
      p="50"
      thickness="8px"
      speed="0.65s"
      emptyColor="gray.200"
      color="red.500"
      size="2xl"
    />
  ) : (
    <FormControl width="100%" p="4">
      <Heading textAlign="center" size="md" mb="5">
        Mark Items as Done
      </Heading>
      <Spacer />
      <Flex
        direction={{ base: "column", lg: "row" }}
        width="100%"
        align="center"
      >
        <Select
          mb={{ base: "5", lg: "0" }}
          mr={{ base: "0", lg: "3" }}
          width={{ base: "90%", lg: "15%" }}
          placeholder="Season"
          name="season"
          value={addItemFormValues.season}
          onChange={(e) => {
            e.persist();
            setAddItemFormValues({
              ...addItemFormValues,
              season: e.target.value,
            });
            fetchEventsBySeason(e.target.value);
          }}
          focusBorderColor="red.500"
          isRequired
        >
          {seasons.map((season) => (
            <option key={season} value={Number(season)}>
              {season}
            </option>
          ))}
        </Select>
        <Select
          mb={{ base: "5", lg: "0" }}
          mr={{ base: "0", lg: "3" }}
          width={{ base: "90%", lg: "30%" }}
          placeholder="Select an Event"
          name="event"
          value={addItemFormValues.event}
          onChange={(e) => {
            e.persist();
            setAddItemFormValues({
              ...addItemFormValues,
              event: e.target.value,
            });
          }}
          focusBorderColor="red.500"
          isRequired
        >
          {events.map((event) => (
            <option key={event.id} value={JSON.stringify(event)}>
              {event.name}
            </option>
          ))}
        </Select>
        <Select
          mb={{ base: "5", lg: "0" }}
          mr={{ base: "0", lg: "3" }}
          width={{ base: "90%", lg: "15%" }}
          placeholder="Type"
          name="type"
          value={addItemFormValues.type}
          onChange={(e) => {
            e.persist();
            setAddItemFormValues({
              ...addItemFormValues,
              type: e.target.value,
            });
          }}
          focusBorderColor="red.500"
          isRequired
        >
          <option value="Project">Project</option>
          <option value="XC">XC</option>
          <option value="SJ">SJ</option>
        </Select>
        <Input
          mb={{ base: "5", lg: "0" }}
          mr={{ base: "0", lg: "3" }}
          width={{ base: "90%", lg: "40%" }}
          placeholder="Items"
          name="itemsValues"
          value={addItemFormValues.itemsValues}
          onChange={(e) => {
            e.persist();
            setAddItemFormValues({
              ...addItemFormValues,
              itemsValues: e.target.value,
            });
          }}
          focusBorderColor="red.500"
          isRequired
        />
        <ButtonGroup alignSelf="flex-end">
          <Button colorScheme="red" onClick={handleAddItemsSubmit}>
            Add
          </Button>
          <Button colorScheme="gray" onClick={clearForm}>
            Clear
          </Button>
        </ButtonGroup>

        <WorngItemsAlertModal
          nonExistentItems={nonExistentItems}
          setNonExistentItems={setNonExistentItems}
          duplicateItems={duplicateItems}
          setDuplicateItems={setDuplicateItems}
          modalControls={{ isOpen: isOpen, onClose: onClose }}
        />
      </Flex>
    </FormControl>
  );
}

export default AddItem;
