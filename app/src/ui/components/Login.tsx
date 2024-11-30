import { Box, Button, Flex, VStack } from "@chakra-ui/react";
import { PasswordInput } from "@/components/ui/password-input";
import { Field } from "@/components/ui/field";
import { useEffect, useState } from "react";
import { AlesafeFullElectron, SecurityUI } from "../../../types";

export function Login() {
  const [submittedMasterPw, setSubmittedMasterPw] = useState<string>("");
  const [actualSec, setActualSec] = useState<SecurityUI | undefined>(undefined);
  const [successfulAuth, setSuccessfulAuth] = useState<boolean>(false);

  useEffect(() => {
    // @ts-expect-error ignore
    window.electron.getContent((c: AlesafeFullElectron) => {
      setActualSec(c.aleSafeSecurity);
    });
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    // This is to fetch the PW, electron client calls nodejs crypto method
    // @ts-expect-error ignore
    window.electron.getPwFromClient(submittedMasterPw, actualSec);
    // @ts-expect-error ignore
    window.electron.getPwCalculationResult((res: boolean) => {
      if (res) {
        setSuccessfulAuth(true);
      }
    });
  }

  if (successfulAuth) {
    return <div>Valid pw!</div>;
  }

  return (
    <Flex width="full" align="center" justifyContent="center">
      <Box p={24} borderWidth={1} borderRadius={8} boxShadow="lg" width="full">
        <form onSubmit={handleSubmit}>
          <VStack gap="4" align="flex-start" maxW="md">
            <Box>
              <Field label="Password"></Field>
            </Box>
            <Box>
              <PasswordInput
                variant="subtle"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setSubmittedMasterPw(event.currentTarget.value)
                }
              />
            </Box>
          </VStack>
          <Button width="80%" mt={6} type="submit" bgColor="white">
            Submit
          </Button>
        </form>
      </Box>
    </Flex>
  );
}
