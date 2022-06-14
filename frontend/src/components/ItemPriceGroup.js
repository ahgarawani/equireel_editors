import { useState, useEffect } from "react";

import {
  IconButton,
  HStack,
  Text,
  Select,
  Flex,
  Spinner,
  useToast,
} from "@chakra-ui/react";

import { FaEdit, FaCheck } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

import { useAuthState } from "../contexts";
function ItemPriceGroup({ itemId, itemPrice, itemType, itemWeek }) {
  const ROOT_URL = process.env.REACT_APP_API_HOST_URL;

  const [currentWeek, setCurrentWeek] = useState(0);

  const [price, setPrice] = useState(itemPrice);
  const [finalPrice, setFinalPrice] = useState(itemPrice);
  const [editing, setEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const currentUser = useAuthState();

  const toast = useToast();

  useEffect(() => {
    async function fetchWeek() {
      try {
        let res = await fetch(`${ROOT_URL}/configs/week`, {
          headers: {
            Authorization: "Bearer " + currentUser.token,
          },
        });
        if (res.status !== 200) {
          throw new Error("Failed to fetch week.");
        }
        let resData = await res.json();
        setCurrentWeek(resData.week);
      } catch (err) {
        console.log(err);
      }
    }
    fetchWeek();
  }, [ROOT_URL, currentUser]);

  const handleUpdatePrice = async (event, itemId, newPrice) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const res = await fetch(`${ROOT_URL}/items/updatePrice`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + currentUser.token,
        },
        body: JSON.stringify({
          itemId,
          newPrice: newPrice,
        }),
      });
      setIsLoading(false);
      const resData = await res.json();
      if (res.status !== 200) {
        setPrice(finalPrice);
        toast({
          title: "Updating Price",
          description: resData.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        throw new Error("Updating price failed!");
      }
      if (res.status === 200) {
        setFinalPrice(resData.itemPrice);
        toast({
          title: "Updating Price",
          description: resData.message,
          status: "success",
          duration: 2500,
          isClosable: true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const editingValues = {
    Project: [5, 10],
    XC: [0, 0.5, 0.65, 0.75, 1, 1.15, 1.25, 1.5, 1.65, 1.75, 2, 2.3, 3],
    SJ: [0, 0.5, 0.65, 0.75, 1, 1.15, 1.25, 1.5, 1.65, 1.75, 2, 2.3, 3],
  };

  console.log(currentWeek);
  console.log(itemWeek);

  return isLoading ? (
    <Flex width="100%" justify="center" align="center">
      <Spinner
        thickness="3px"
        speed="0.65s"
        emptyColor="gray.200"
        color="red.500"
        size="md"
      />
    </Flex>
  ) : (
    <HStack spacing={5} w={{ base: "100%", md: "35%", lg: "100%" }}>
      {editing ? (
        <>
          <Select
            size="sm"
            focusBorderColor="red.500"
            placeholder={`$${price.toFixed(2)}`}
            onChange={(e) => {
              e.persist();
              setPrice(parseFloat(e.target.value));
            }}
          >
            {editingValues[itemType].map((value) =>
              price !== value ? (
                <option value={value}>${`${value.toFixed(2)}`}</option>
              ) : (
                <></>
              )
            )}
          </Select>
          <HStack spacing={2}>
            <IconButton
              icon={<FaCheck />}
              size="xs"
              colorScheme="red"
              onClick={(e) => {
                handleUpdatePrice(e, itemId, price);
                setEditing(false);
              }}
            />
            <IconButton
              icon={<IoClose />}
              size="xs"
              onClick={() => {
                setPrice(finalPrice);
                setEditing(false);
              }}
            />
          </HStack>
        </>
      ) : (
        <>
          <Text>{`$${price.toFixed(2)}`}</Text>
          {itemWeek === currentWeek && (
            <IconButton
              icon={<FaEdit />}
              size="xs"
              onClick={() => {
                setEditing(true);
              }}
            />
          )}
        </>
      )}
    </HStack>
  );
}

export default ItemPriceGroup;
