import {
  Heading,
  ButtonGroup,
  IconButton,
  Button,
  Spacer,
  Box,
} from "@chakra-ui/react";
import { HiOutlineLogout, HiSearch } from "react-icons/hi";
import {
  RiPencilLine,
  RiPencilFill,
  RiAdminLine,
  RiAdminFill,
} from "react-icons/ri";

import ComponentGate from "./ComponentGate.js";
export default function TopSecButtonsCluster({
  currentRoute,
  history,
  currentUser,
  openSearchModal,
  handleLogout,
  display,
}) {
  return (
    <>
      <Box display={display}>
        <ButtonGroup size="lg" colorScheme="red" bg="white">
          <Button
            leftIcon={
              currentRoute === "/" ? <RiPencilFill /> : <RiPencilLine />
            }
            isActive={currentRoute === "/"}
            _hover={{ bg: "red.200", cursor: "pointer" }}
            _active={{ bg: "red.500", textColor: "white", fontWeight: "bold" }}
            variant="ghost"
            onClick={() => {
              history.push(`/`);
            }}
            borderRadius="full"
          >
            Editor Dashboard
          </Button>
          <ComponentGate role="admin">
            <Button
              leftIcon={
                new RegExp("/admin").test(currentRoute) ? (
                  <RiAdminFill />
                ) : (
                  <RiAdminLine />
                )
              }
              isActive={new RegExp("/admin").test(currentRoute)}
              _hover={{ bg: "red.200", cursor: "pointer" }}
              _active={{
                bg: "red.500",
                textColor: "white",
                fontWeight: "bold",
              }}
              variant="ghost"
              onClick={() => {
                history.push(`/admin`);
              }}
              borderRadius="full"
            >
              Admin Dashboard
            </Button>
          </ComponentGate>
        </ButtonGroup>
      </Box>
      <Spacer display={display} />
      <Box display={display}>
        <Heading size="lg" mr="5">
          {currentUser.userDetails.name}
        </Heading>
        <ButtonGroup size="md" colorScheme="red" variant="outline">
          <IconButton
            borderRadius="full"
            icon={<HiSearch />}
            onClick={openSearchModal}
          />
          {/* <IconButton borderRadius="full" icon={<IoSettingsSharp />} /> */}
          <IconButton
            borderRadius="full"
            icon={<HiOutlineLogout />}
            onClick={handleLogout}
          />
        </ButtonGroup>
      </Box>
    </>
  );
}
