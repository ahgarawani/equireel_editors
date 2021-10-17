import { useState, useRef } from "react";
import {
  Heading,
  ButtonGroup,
  IconButton,
  Button,
  Spacer,
  Box,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { HiOutlineLogout, HiSearch } from "react-icons/hi";
import {
  RiPencilLine,
  RiPencilFill,
  RiAdminLine,
  RiAdminFill,
  RiMenuFill,
} from "react-icons/ri";

import ComponentGate from "./ComponentGate.js";
import AdminNavs from "./AdminNavs.js";
export default function TopSecNavDrawerButton({
  currentRoute,
  history,
  currentUser,
  openSearchModal,
  handleLogout,
  display,
}) {
  const {
    isOpen: navDrawerIsOpen,
    onOpen: openNavDrawer,
    onClose: closeNavDrawer,
  } = useDisclosure();
  const btnRef = useRef();
  const isAdmin = new RegExp("/admin").test(currentRoute);
  const [adminNavsIsVisible, setAdminNavsIsVisible] = useState(isAdmin);
  return (
    <>
      <Box display={display}>
        <Heading size="lg">{currentUser.userDetails.name}</Heading>
      </Box>
      <Spacer display={display} />
      <Box display={display}>
        <IconButton
          ref={btnRef}
          icon={<RiMenuFill />}
          colorScheme="red"
          variant="ghost"
          fontSize="35px"
          onClick={openNavDrawer}
        />
      </Box>
      <Drawer
        isOpen={navDrawerIsOpen}
        placement="right"
        onClose={closeNavDrawer}
        finalFocusRef={btnRef}
        size="sm"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton colorScheme="red" />
          <DrawerHeader>Navigate</DrawerHeader>
          <DrawerBody>
            <ButtonGroup
              as="a"
              size="lg"
              colorScheme="red"
              variant="link"
              flexDir="column"
            >
              <Box></Box>
              <Button
                mb={8}
                width="100%"
                justifyContent="flex-start"
                leftIcon={
                  currentRoute === "/" ? <RiPencilFill /> : <RiPencilLine />
                }
                onClick={() => {
                  history.push(`/`);
                }}
                isDisabled={currentRoute === "/"}
                _disabled={{ fontWeight: "extrabold", color: "red.500" }}
              >
                Editor Dashboard
              </Button>
              <ComponentGate role="admin">
                <Button
                  mb={adminNavsIsVisible ? 5 : 8}
                  width="100%"
                  justifyContent="flex-start"
                  leftIcon={isAdmin ? <RiAdminFill /> : <RiAdminLine />}
                  onClick={() => {
                    setAdminNavsIsVisible(true);
                  }}
                  isDisabled={isAdmin}
                  _disabled={{ fontWeight: "extrabold", color: "red.500" }}
                >
                  Admin Dashboard
                </Button>
                {adminNavsIsVisible && (
                  <Box pl={8} mb={8}>
                    <AdminNavs variant="link" closeNavDrawer={closeNavDrawer} />
                  </Box>
                )}
              </ComponentGate>
              <Button
                mb={8}
                width="100%"
                justifyContent="flex-start"
                leftIcon={<HiSearch />}
                onClick={openSearchModal}
              >
                Search
              </Button>
              <Button
                mb={8}
                width="100%"
                justifyContent="flex-start"
                leftIcon={<HiOutlineLogout />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </ButtonGroup>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
