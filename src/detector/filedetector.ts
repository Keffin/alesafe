import fs from "fs";
import path from "path";
import os from "os";
import type { AlesafeFull, AlesafeSecurity } from "../models/alesafeTypes.js";
import { AlesafeError } from "../models/alesafeError.js";

const HOME_DIR: string = os.homedir();
const ALESAFE_DIR_NAME: string = ".alesafe";
const ALESAFE_FILE_NAME: string = ".alexp.json";

function isFirstRun(): boolean {
  try {
    getAlesafeFile();
    return false;
  } catch (error) {
    if (error instanceof AlesafeError) {
      return true;
    }
    throw error;
  }
}

// Purpose: Fetches the file and reads it into our type.
function getAleSafeFileContent(): AlesafeFull {
  const file: string = getAlesafeFile();
  const content: string = fs.readFileSync(file).toString();

  return JSON.parse(content) as AlesafeFull;
}

// Public method for fetching the alesafe file path.
function getAlesafeFile(): string {
  const fetchedFiled: [string, boolean] = fetchFile();

  if (!fetchedFiled[1]) {
    throw new AlesafeError(fetchedFiled[0]);
  }

  return fetchedFiled[0];
}

function setupMuxAlesafeConfig() {
  console.log("Setting up multiple configs...");
  return getFiles();
}

function getFiles(): string[] {
  const alesafeDir: string = path.join(HOME_DIR, ALESAFE_DIR_NAME);
  return fs
    .readdirSync(alesafeDir)
    .filter((fileName) => fileName !== ALESAFE_FILE_NAME);
}

function setupAlesafeConfig(aleSafeSecurityConfig: AlesafeSecurity): void {
  console.log(
    "Seems like you are missing the config needed...setting it up..."
  );

  const alesafeDir = path.join(HOME_DIR, ALESAFE_DIR_NAME);
  // Create alesafe DIR
  try {
    fs.mkdirSync(alesafeDir);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message.includes("file already exists")) {
        console.log("Directory already exists...skipping mkdir")
      }
    }
  }

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
  setupMuxAlesafeConfig,
  isFirstRun,
};
