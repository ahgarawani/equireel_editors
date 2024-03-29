import { useState, useEffect } from "react";
import {
  Flex,
  Spacer,
  FormControl,
  Select,
  Input,
  IconButton,
  ButtonGroup,
  Heading,
} from "@chakra-ui/react";

import { HiSearch, HiX } from "react-icons/hi";

import { useAuthState } from "../contexts";

function SearchForm({ searchFunc, clearSearch }) {
  const ROOT_URL = process.env.REACT_APP_API_HOST_URL;

  const [seasons, setSeasons] = useState([]);
  const [events, setEvents] = useState([]);
  const [formValues, setFormValues] = useState({
    season: "",
    event: "",
    type: "",
    itemsValues: "",
  });

  const currentUser = useAuthState();

  const performSearch = () => {
    if (formValues.season === "" || formValues.event === "") {
      return;
    }
    const query = {
      event: formValues.event,
      type: formValues.type,
      itemsStr: formValues.itemsValues,
    };
    searchFunc(query, currentUser);
  };

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

  useEffect(() => {
    performSearch();
  }, [formValues]);

  const fetchEventsBySeason = async (season) => {
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
  };

  const clearForm = () => {
    setFormValues({
      season: "",
      event: "",
      type: "",
      itemsValues: "",
    });
    setEvents([]);
    clearSearch();
  };

  return (
    <FormControl width="100%" p="4">
      <Heading textAlign="center" size="md" mb="5">
        Search for Items
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
          value={formValues.season}
          onChange={(e) => {
            e.persist();
            setFormValues({
              ...formValues,
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
          value={formValues.event}
          onChange={(e) => {
            e.persist();
            setFormValues({
              ...formValues,
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
          value={formValues.type}
          onChange={(e) => {
            e.persist();
            setFormValues({
              ...formValues,
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
          value={formValues.itemsValues}
          onChange={(e) => {
            e.persist();
            setFormValues({
              ...formValues,
              itemsValues: e.target.value,
            });
          }}
          focusBorderColor="red.500"
          isRequired
        />
        <ButtonGroup alignSelf="flex-end">
          <IconButton
            icon={<HiSearch />}
            borderRadius="full"
            size="md"
            colorScheme="red"
            variant="solid"
            mr="4"
            onClick={performSearch}
          />
          <IconButton
            icon={<HiX />}
            borderRadius="full"
            size="md"
            colorScheme="gray"
            variant="solid"
            onClick={clearForm}
          />
        </ButtonGroup>
      </Flex>
    </FormControl>
  );
}

export default SearchForm;
