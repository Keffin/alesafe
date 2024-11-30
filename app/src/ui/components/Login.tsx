import { Box, Button, Flex, VStack } from "@chakra-ui/react";
import { PasswordInput } from "@/components/ui/password-input";
import { Field } from "@/components/ui/field";
import { useEffect, useState } from "react";
import { AlesafeFullElectron, SecurityUI } from "../../../types";

export function Login() {
  const [submittedMasterPw, setSubmittedMasterPw] = useState<string>("");
  const [actualSec, setActualSec] = useState<SecurityUI | undefined>(undefined);
  const [successfulAuth, setSuccessfulAuth] = useState<boolean>(false);
  const [alesafeFull, setAlesafeFull] = useState<
    AlesafeFullElectron | undefined
  >(undefined);

  useEffect(() => {
    // @ts-expect-error ignore
    window.electron.getContent((c: AlesafeFullElectron) => {
      setActualSec(c.aleSafeSecurity);
      setAlesafeFull(c);
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

    //const x = alesafeFull?.credentials[0].password;
    for (const x of alesafeFull?.credentials) {
      // @ts-expect-error ignore
      window.electron.getDec(
        submittedMasterPw,
        alesafeFull?.aleSafeSecurity,
        x,
      );
    }

    // @ts-expect-error ignore
    window.electron.getDecryptResult((c) => {
      console.log(c);
    });
  }

  if (successfulAuth && alesafeFull !== undefined) {
    // TODO: Return new component with parsed passwords
    // Something like:
    //return <ValidPw alesafe={alesafeFull} mPw={submittedMasterPw} />;
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
