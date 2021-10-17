import {
  Heading,
  Image,
  Flex,
  Spacer,
  Box,
  useDisclosure,
} from "@chakra-ui/react";
//import { IoSettingsSharp } from "react-icons/io5";

import { logout, useAuthState, useAuthDispatch } from "../contexts";
import { useHistory, useLocation } from "react-router-dom";
import SearchBoxModal from "./SearchBoxModal.js";
import TopSecButtonsCluster from "./TopSecButtonsCluster";
import TopSecNavDrawerButton from "./TopSecNavDrawerButton";

function TopSec() {
  const dispatch = useAuthDispatch(); // read dispatch method from context
  const currentUser = useAuthState(); //read user details from context
  const history = useHistory();
  const location = useLocation();

  const {
    isOpen: searchModalIsOpen,
    onOpen: openSearchModal,
    onClose: closeSearchModal,
  } = useDisclosure();

  const handleLogout = () => {
    logout(dispatch); //call the logout action
  };

  return (
    <Flex align="center" width="100%" height="100%">
      <Box display="flex" flexShrink={0} justify="center" align="center">
        <Image
          objectFit="cover"
          boxSize={{ base: "40px", xl: "50px" }}
          src="/images/EE_LOGO.svg"
          mr={5}
        />
        <Heading display={{ base: "none", xl: "inline-block" }} color="red.500">
          EQUIREEL EDITORS
        </Heading>
      </Box>
      <Spacer display={{ base: "none", lg: "inline-block" }} />
      <TopSecButtonsCluster
        currentRoute={location.pathname}
        history={history}
        currentUser={currentUser}
        openSearchModal={openSearchModal}
        handleLogout={handleLogout}
        display={{ base: "none", lg: "flex" }}
      />

      <Spacer display={{ base: "inline-block", lg: "none" }} />

      <TopSecNavDrawerButton
        currentRoute={location.pathname}
        history={history}
        currentUser={currentUser}
        openSearchModal={openSearchModal}
        handleLogout={handleLogout}
        display={{ base: "flex", lg: "none" }}
      />

      <SearchBoxModal
        modalControls={{
          isOpen: searchModalIsOpen,
          onClose: closeSearchModal,
        }}
      />
    </Flex>
  );
}

export default TopSec;
