import { useState } from "react";

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
function ItemPriceGroup({ itemId, itemPrice, itemType }) {
  const ROOT_URL = process.env.REACT_APP_API_HOST_URL;

  const [price, setPrice] = useState(itemPrice);
  const [finalPrice, setFinalPrice] = useState(itemPrice);
  const [editing, setEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const currentUser = useAuthState();

  const toast = useToast();

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
      if (res.status !== 200) {
        setPrice(finalPrice);
        toast({
          title: "Updating Price",
          description: "Updating price failed! Try Again",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        throw new Error("Updating price failed!");
      }
      const resData = await res.json();
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
            {price !== 2.0 && <option value={2.0}>$2.00</option>}
            {price !== 1.5 && <option value={1.5}>$1.50</option>}
            {price !== 1.15 && <option value={1.15}>$1.15</option>}
            {price !== 0.75 && <option value={0.75}>$0.75</option>}
            {price !== 0.65 && <option value={0.65}>$0.65</option>}
            {price !== 0.5 && <option value={0.5}>$0.50</option>}
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
          {itemType !== "Project" && (
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
