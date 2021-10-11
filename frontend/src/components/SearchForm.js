import { useState, useEffect } from "react";
import { HStack, Select, Input, IconButton } from "@chakra-ui/react";

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

  useEffect(() => {
    async function fetchSeasons() {
      try {
        let res = await fetch(`${ROOT_URL}/events/getSeasons`, {
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
    let url = new URL(`${ROOT_URL}/events/getEventsBySeason`),
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

  return (
    <HStack width="100%" zIndex="banner">
      <Select
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
        width="17%"
        isRequired
      >
        {seasons.map((season) => (
          <option key={season} value={Number(season)}>
            {season}
          </option>
        ))}
      </Select>
      <Select
        placeholder="Event"
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
        width="35%"
      >
        {events.map((event) => (
          <option key={event.id} value={JSON.stringify(event)}>
            {event.name}
          </option>
        ))}
      </Select>
      <Select
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
        width="14%"
      >
        <option value="Project">Project</option>
        <option value="XC">XC</option>
        <option value="SJ">SJ</option>
      </Select>
      <Input
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
        width="40%"
      />
      <IconButton
        icon={<HiSearch />}
        isRound="true"
        size="md"
        colorScheme="red"
        variant="solid"
        mr="4"
        onClick={performSearch}
      />
      <IconButton
        icon={<HiX />}
        isRound="true"
        size="md"
        colorScheme="gray"
        variant="solid"
        onClick={clearForm}
      />
    </HStack>
  );
}

export default SearchForm;
