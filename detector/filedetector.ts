import fs from "fs";
import path from "path";
import os from "os";
import { AleSafeFull, AleSafeSecurity } from "../models/AleSafeTypes";
import { AleSafeError } from "../models/AleSafeError";

const HOME_DIR: string = os.homedir();
const ALESAFE_DIR_NAME: string = ".alesafe";
const ALESAFE_FILE_NAME: string = ".alexp.json";

function isFirstRun(): boolean {
  try {
    getAlesafeFile();
    return false;
  } catch (error) {
    if (error instanceof AleSafeError) {
      return true;
    }
    throw error;
  }
}

// Purpose: Fetches the file and reads it into our type.
function getAleSafeFileContent(): AleSafeFull {
  const file: string = getAlesafeFile();
  const content: string = fs.readFileSync(file).toString();

  return JSON.parse(content) as AleSafeFull;
}

// Public method for fetching the alesafe file path.
function getAlesafeFile(): string {
  const fetchedFiled: [string, boolean] = fetchFile();

  if (fetchedFiled[1] === false) {
    throw new AleSafeError(fetchedFiled[0]);
  }

  return fetchedFiled[0];
}

function setupAlesafeConfig(aleSafeSecurityConfig: AleSafeSecurity): void {
  console.log(
    "Seems like you are missing the config needed...setting it up..."
  );

  // Create alesafe DIR
  const alesafeDir: string = path.join(HOME_DIR, ALESAFE_DIR_NAME);
  fs.mkdirSync(alesafeDir);
  // Create alesafe JSON file
  const alesafeJson: string = path.join(alesafeDir, ALESAFE_FILE_NAME);

  const fileContent = {
    aleSafeSecurity: {
      ...aleSafeSecurityConfig,
    },
    credentials: [],
  };
  // Write the master password details but hashed, its salt and the count
  fs.writeFileSync(alesafeJson, JSON.stringify(fileContent, null, 2));
}

function fetchFile(): [string, boolean] {
  const hiddenDirPath: string = path.join(HOME_DIR, ALESAFE_DIR_NAME);

  if (
    !fs.existsSync(hiddenDirPath) ||
    !fs.statSync(hiddenDirPath).isDirectory()
  ) {
    return [
      `The directory ${ALESAFE_DIR_NAME} does not exist. Create it by running alesafe setup`,
      false,
    ];
  }

  const fp: string = path.join(hiddenDirPath, ALESAFE_FILE_NAME);
  if (!fs.existsSync(fp)) {
    return [
      `Filename: ${ALESAFE_FILE_NAME} not found at ${ALESAFE_DIR_NAME}. Create it by running alesafe setup`,
      false,
    ];
  }

  return [fp, true];
}

export {
  getAleSafeFileContent,
  getAlesafeFile,
  setupAlesafeConfig,
  isFirstRun,
};
