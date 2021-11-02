import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import {
  VStack,
  Flex,
  Spinner,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Checkbox,
  Button,
  ButtonGroup,
  useToast,
} from "@chakra-ui/react";

import Select from "react-select";

import { useAuthState } from "../contexts";

export default function AddRuleForm() {
  const ROOT_URL = process.env.REACT_APP_API_HOST_URL;

  const [eventsOptions, setEventsOptions] = useState([]);

  const [formValues, setFormValues] = useState({
    title: "",
    events: [],
    itemType: [],
    itemPrice: "",
    indefinite: false,
    upperLimit: "",
    isDefault: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  const currentUser = useAuthState();

  const history = useHistory();

  useEffect(() => {
    setIsLoading(true);
    const fetchAllEvents = async () => {
      try {
        const res = await fetch(`${ROOT_URL}/events`, {
          headers: {
            Authorization: "Bearer " + currentUser.token,
          },
        });
        if (res.status !== 200) {
          throw new Error("Failed to fetch events.");
        }
        let resData = await res.json();
        setEventsOptions(
          resData.events.map((event) => ({
            value: event.id,
            label: event.name,
          }))
        );
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllEvents();
  }, [currentUser]);

  const toast = useToast();

  const handleRuleSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const res = await fetch(`${ROOT_URL}/rules`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + currentUser.token,
        },
        body: JSON.stringify({
          title: formValues.title,
          events: formValues.events.map((event) => event.value),
          description: {
            itemType: formValues.itemType.map((type) => type.value),
            itemPrice: formValues.itemPrice,
            timeRange: [0, formValues.upperLimit],
          },
          isDefault: formValues.isDefault,
        }),
      });
      const resData = await res.json();
      setIsLoading(false);
      if (res.status === 201) {
        clearForm();
        toast({
          title: "Adding a Rule",
          description: resData.message,
          status: "success",
          duration: 6000,
          isClosable: true,
        });
        history.push("/admin");
        history.push("/admin/rules");
      } else {
        toast({
          title: "Adding a Rule",
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
      title: "",
      events: [],
      itemType: [],
      itemPrice: "",
      indefinite: false,
      upperLimit: "",
      isDefault: false,
    });
  };

  return isLoading ? (
    <VStack width="100%" p={6}>
      <Spinner
        p="50"
        thickness="8px"
        speed="0.65s"
        emptyColor="gray.200"
        color="red.500"
        size="2xl"
      />
    </VStack>
  ) : (
    <VStack p={5} spacing={30}>
      <FormControl id="title" maxW="90%" isRequired>
        <FormLabel>Rule Title</FormLabel>
        <Input
          placeholder="Rule Title"
          name="title"
          focusBorderColor="red.500"
          isRequired
          value={formValues.title}
          onChange={(e) => {
            setFormValues({ ...formValues, title: e.target.value });
          }}
        />
      </FormControl>
      <Flex width="90%" justify="space-between">
        <FormControl id="types" isRequired mr={2}>
          <FormLabel>Item Types</FormLabel>
          <Select
            theme={(theme) => ({
              ...theme,
              borderRadius: 6,
              colors: {
                ...theme.colors,
                neutral20: "#E2E8F0",
                neutral30: "#CBD5E0",
                neutral40: "#A0AEC0",
                neutral50: "#718096",
                neutral60: "#4A5568",
                neutral70: "#2D3748",
                neutral80: "#1A202C",
                neutral90: "#171923",
                primary25: "#FED7D7",
                primary: "#E53E3E",
              },
            })}
            value={formValues.itemType}
            options={[
              { value: "XC", label: "XC" },
              { value: "SJ", label: "SJ" },
              { value: "Project", label: "Project" },
            ]}
            isMulti
            menuPosition="fixed"
            closeMenuOnSelect={false}
            onChange={(values) => {
              setFormValues({
                ...formValues,
                itemType: values,
              });
            }}
          />
        </FormControl>
        <FormControl id="price" isRequired ml={2}>
          <FormLabel>Item Price</FormLabel>
          <NumberInput value={formValues.itemPrice} focusBorderColor="red.500">
            <NumberInputField
              placeholder="Item Price"
              name="price"
              isRequired
              onChange={(e) => {
                setFormValues({
                  ...formValues,
                  itemPrice: e.target.value,
                });
              }}
            />
          </NumberInput>
        </FormControl>
      </Flex>

      <FormControl id="window" maxW="90%" isRequired>
        <FormLabel>Time Window</FormLabel>
        <Flex width="100%" justify="space-between" align="center">
          <FormControl id="indefinite" isRequired ml={2}>
            <Checkbox
              isChecked={formValues.indefinite}
              size="lg"
              colorScheme="red"
              isDisabled={formValues.upperLimit && !formValues.indefinite}
              onChange={(e) => {
                setFormValues({
                  ...formValues,
                  indefinite: e.target.checked,
                  upperLimit: e.target.checked ? Number.POSITIVE_INFINITY : "",
                });
              }}
            >
              Indefinite
            </Checkbox>
          </FormControl>
          <FormControl id="limit" isRequired={!formValues.indefinite} ml={2}>
            <FormLabel>Upper Limit In Minutes</FormLabel>
            <NumberInput
              value={
                isFinite(formValues.upperLimit) ? formValues.upperLimit : ""
              }
              isDisabled={formValues.indefinite}
              focusBorderColor="red.500"
            >
              <NumberInputField
                placeholder="Upper Limit In Minutes"
                name="limit"
                onChange={(e) => {
                  setFormValues({
                    ...formValues,
                    indefinite: !e.target.value,
                    upperLimit: e.target.value,
                  });
                }}
              />
            </NumberInput>
          </FormControl>
        </Flex>
      </FormControl>

      <FormControl id="events" maxW="90%" isRequired>
        <FormLabel>Events</FormLabel>
        <Select
          value={formValues.events}
          options={eventsOptions}
          theme={(theme) => ({
            ...theme,
            borderRadius: 5,
            colors: {
              ...theme.colors,
              neutral20: "#E2E8F0",
              neutral30: "#CBD5E0",
              neutral40: "#A0AEC0",
              neutral50: "#718096",
              neutral60: "#4A5568",
              neutral70: "#2D3748",
              neutral80: "#1A202C",
              neutral90: "#171923",
              primary25: "#FED7D7",
              primary: "#E53E3E",
            },
          })}
          isMulti
          menuPosition="fixed"
          closeMenuOnSelect={false}
          onChange={(values) => {
            setFormValues({ ...formValues, events: values });
          }}
        />
      </FormControl>

      <FormControl id="is-default" maxW="90%" isRequired>
        <Checkbox
          size="lg"
          colorScheme="red"
          isChecked={formValues.isDefault}
          onChange={(e) => {
            setFormValues({
              ...formValues,
              isDefault: e.target.checked,
            });
          }}
        >
          Default Rule
        </Checkbox>
      </FormControl>

      <ButtonGroup alignSelf="flex-end" size="md">
        <Button onClick={handleRuleSubmit} colorScheme="red">
          Add Rule
        </Button>
        <Button onClick={clearForm} colorScheme="gray">
          Clear
        </Button>
      </ButtonGroup>
    </VStack>
  );
}
