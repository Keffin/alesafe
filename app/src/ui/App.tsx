import { useEffect, useState } from "react";
import "./App.css";
import { AlesafeFullElectron } from "../../types";
import { Box, Flex, Spinner } from "@chakra-ui/react";

function App() {
  const [alesafeSec, setAlesafeSec] = useState<AlesafeFullElectron>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      // @ts-expect-error ignore
      window.electron.getContent((r) => {
        setAlesafeSec(r);
        setIsLoading(false);
      });
    }, 1000);
  }, []);

  if (isLoading) {
    return <Spinner size="xl" />;
  }

  if (!alesafeSec) {
    return <div>No credentrials </div>;
  }

  const c1 = alesafeSec.credentials[0];
  return (
    <>
      <Box
        display="block"
        background="tomato"
        width="100%"
        padding="4"
        color="white"
        _hover={{ bg: "green" }}
      >
        hellofsdfsdsdf
      </Box>

      <div>{c1.username}</div>
    </>
  );
}

export default App;
