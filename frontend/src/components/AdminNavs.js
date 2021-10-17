import { useLocation, useHistory } from "react-router";
import { VStack, Button } from "@chakra-ui/react";
import {
  RiHome5Line,
  RiBillLine,
  RiCalendarEventLine,
  RiUserLine,
  RiVidiconLine,
  RiHome5Fill,
  RiBillFill,
  RiCalendarEventFill,
  RiUserFill,
  RiVidiconFill,
} from "react-icons/ri";

export default function AdminNavs({ variant, closeNavDrawer }) {
  const currentRoute = useLocation();
  const history = useHistory();
  const activeRoute = currentRoute.pathname;
  const [hoverStyle, activeStyle] = [
    {
      ghost: { bg: "red.200", cursor: "pointer" },
      link: { cursor: "pointer" },
    },
    {
      ghost: { bg: "red.500", textColor: "white", fontWeight: "bold" },
      link: { fontWeight: "extrabold", color: "red.500" },
    },
  ];
  return (
    <VStack width="100%" align="flex-start" spacing="20px">
      <Button
        leftIcon={activeRoute === "/admin" ? <RiHome5Fill /> : <RiHome5Line />}
        onClick={() => {
          history.push(`/admin`);
          if (closeNavDrawer) closeNavDrawer();
        }}
        colorScheme="red"
        variant={variant}
        size="lg"
        borderRadius="full"
        justifyContent="flex-start"
        _hover={hoverStyle[variant]}
        _active={activeStyle[variant]}
        isActive={activeRoute === "/admin"}
      >
        Home
      </Button>
      <Button
        leftIcon={
          activeRoute === "/admin/invoices" ? <RiBillFill /> : <RiBillLine />
        }
        onClick={() => {
          history.push(`/admin/invoices`);
          if (closeNavDrawer) closeNavDrawer();
        }}
        colorScheme="red"
        variant={variant}
        size="lg"
        borderRadius="full"
        justifyContent="flex-start"
        _hover={hoverStyle[variant]}
        _active={activeStyle[variant]}
        isActive={activeRoute === "/admin/invoices"}
      >
        Invoices
      </Button>
      <Button
        leftIcon={
          activeRoute === "/admin/events" ? (
            <RiCalendarEventFill />
          ) : (
            <RiCalendarEventLine />
          )
        }
        onClick={() => {
          history.push(`/admin/events`);
          if (closeNavDrawer) closeNavDrawer();
        }}
        colorScheme="red"
        variant={variant}
        size="lg"
        borderRadius="full"
        justifyContent="flex-start"
        _hover={hoverStyle[variant]}
        _active={activeStyle[variant]}
        isActive={activeRoute === "/admin/events"}
      >
        Events
      </Button>
      <Button
        leftIcon={
          activeRoute === "/admin/editors" ? <RiUserFill /> : <RiUserLine />
        }
        onClick={() => {
          history.push(`/admin/editors`);
          if (closeNavDrawer) closeNavDrawer();
        }}
        colorScheme="red"
        variant={variant}
        size="lg"
        borderRadius="full"
        justifyContent="flex-start"
        _hover={hoverStyle[variant]}
        _active={activeStyle[variant]}
        isActive={activeRoute === "/admin/editors"}
      >
        Editors
      </Button>
      <Button
        leftIcon={
          activeRoute === "/admin/orders" ? (
            <RiVidiconFill />
          ) : (
            <RiVidiconLine />
          )
        }
        onClick={() => {
          history.push(`/admin/orders`);
          if (closeNavDrawer) closeNavDrawer();
        }}
        colorScheme="red"
        variant={variant}
        size="lg"
        borderRadius="full"
        justifyContent="flex-start"
        _hover={hoverStyle[variant]}
        _active={activeStyle[variant]}
        isActive={activeRoute === "/admin/orders"}
      >
        Orders
      </Button>
    </VStack>
  );
}
