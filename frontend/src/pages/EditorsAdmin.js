import { Flex, Spinner } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useAuthState } from "../contexts";
import SummariesSlider from "../components/SummariesSlider";

export default function EditorsAdmin() {
  const ROOT_URL = process.env.REACT_APP_API_HOST_URL;
  const [editors, setEditors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const currentUser = useAuthState();

  useEffect(() => {
    async function fetchEditors() {
      setIsLoading(true);
      try {
        let res = await fetch(`${ROOT_URL}/auth/allEditors`, {
          headers: {
            Authorization: "Bearer " + currentUser.token,
          },
        });
        if (res.status !== 200) {
          throw new Error("Failed to fetch editors.");
        }
        let resData = await res.json();
        setEditors(resData.editors);
      } catch (err) {
        console.log(err);
      }
      setIsLoading(false);
    }
    fetchEditors();
  }, [ROOT_URL, currentUser.token]);
  return (
    <Flex
      width="100%"
      height="100%"
      justify="center"
      align="center"
      direction="column"
    >
      {isLoading ? (
        <Spinner
          p="50"
          thickness="8px"
          speed="0.65s"
          emptyColor="gray.200"
          color="red.500"
          size="2xl"
        />
      ) : (
        <>
          {editors.map((editor) => (
            <Flex
              width="90%"
              mb={{ base: 5, md: 10 }}
              borderColor="gray.200"
              boxShadow="sm"
              borderWidth="2px"
              borderRadius="xl"
              justify="center"
              align="center"
              bg="white"
            >
              <SummariesSlider editor={editor} />
            </Flex>
          ))}
        </>
      )}
    </Flex>
  );
}
