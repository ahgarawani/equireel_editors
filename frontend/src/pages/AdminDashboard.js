import React from "react";

import { Switch } from "react-router-dom";

import { Box, Flex } from "@chakra-ui/react";

import RouteGate from "../components/RouteGate.js";
import AdminNavs from "../components/AdminNavs.js";

import TopSec from "../components/TopSec.js";

function AdminDashboard({ routes }) {
  return (
    <Flex width="100%" direction="column" justify="center" align="center">
      <Flex
        width="100vw"
        py={5}
        px={{ base: 30, lg: 45 }}
        maxH="100px"
        position="sticky"
        top="0px"
        left="10px"
        zIndex="banner"
        bg="white"
        borderBottomWidth="2px"
        borderColor="gray.200"
        boxShadow="sm"
        justify="center"
        align="center"
      >
        <TopSec />
      </Flex>
      <Flex width="100%" pt={{ base: "20px", md: "30px" }}>
        <Box
          display={{ base: "none", md: "block" }}
          minW="15%"
          height="0px"
          p={6}
          position="sticky"
          top="150px"
          left="0px"
        >
          <AdminNavs variant="ghost" />
        </Box>
        <Flex
          width={{ base: "100%", md: "85%" }}
          height="100%"
          justify="center"
          align="center"
        >
          <Switch>
            {routes.map((route) => (
              <RouteGate
                key={route.path}
                path={route.path}
                component={route.component}
                role={route.role}
                routes={route.routes}
                exact={route.isExact}
              />
            ))}
          </Switch>
        </Flex>
        {/* <Box
          maxW={{ base: "90%", md: "100%" }}
          mb={{ base: "20px", xl: "30px" }}
          bg="white"
          p="4"
          borderColor="gray.200"
          borderWidth="2px"
          borderRadius="xl"
          boxShadow="sm"
        >
          <GeneralAdminControls />
        </Box>
        <Box
          minWidth={{ base: "90%", md: "35%" }}
          bg="white"
          p="6"
          borderColor="gray.200"
          borderWidth="2px"
          borderRadius="xl"
          boxShadow="sm"
          align="center"
        >
          <AddEvent />
        </Box> */}
      </Flex>
    </Flex>
  );
}

export default AdminDashboard;
