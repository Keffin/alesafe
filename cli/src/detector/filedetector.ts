import fs from "fs";
import fsasync from "fs/promises";
import path from "path";
import os from "os";
import type { AlesafeFull, AlesafeSecurity } from "../models/alesafeTypes.js";
import { AlesafeError } from "../models/alesafeError.js";

const HOME_DIR: string = os.homedir();
const ALESAFE_DIR_NAME: string = ".alesafe";
const ALESAFE_FILE_NAME: string = ".alexp.json";

async function isFirstRun(): Promise<boolean> {
  try {
    await getAlesafeFile();
    return false;
  } catch (error) {
    if (error instanceof AlesafeError) {
      return true;
    }
    throw error;
  }
}

// Purpose: Fetches the file and reads it into our type.
async function getAleSafeFileContent(): Promise<AlesafeFull> {
  const file: string = await getAlesafeFile();
  const content: string = (await fsasync.readFile(file)).toString();

  return JSON.parse(content) satisfies AlesafeFull;
}

// Public method for fetching the alesafe file path.
async function getAlesafeFile(): Promise<string> {
  const fetchedFiled: [string, boolean] = await fetchFile();
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

async function setupAlesafeConfig(
  aleSafeSecurityConfig: AlesafeSecurity,
): Promise<void> {
  console.log(
    "Seems like you are missing the config needed...setting it up...",
  );

  const alesafeDir = path.join(HOME_DIR, ALESAFE_DIR_NAME);
  // Create alesafe DIR
  try {
    await fsasync.mkdir(alesafeDir, { recursive: false });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message.includes("file already exists")) {
        console.log("Directory already exists...skipping mkdir");
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
  fsasync.writeFile(alesafeJson, JSON.stringify(fileContent, null, 2));
}

async function fetchFile(): Promise<[string, boolean]> {
  const hiddenDirPath: string = path.join(HOME_DIR, ALESAFE_DIR_NAME);
  const exists = await fileExists(hiddenDirPath);
  const isDir = fsasync
    .stat(hiddenDirPath)
    .then((res) => res.isDirectory())
    .catch(() => {
      return false;
    });

  if (!exists || !isDir) {
    return [
      `The directory ${ALESAFE_DIR_NAME} does not exist. Create it by running alesafe setup`,
      false,
    ];
  }

  const fp: string = path.join(hiddenDirPath, ALESAFE_FILE_NAME);
  if (!fileExists(fp)) {
    return [
      `Filename: ${ALESAFE_FILE_NAME} not found at ${ALESAFE_DIR_NAME}. Create it by running alesafe setup`,
      false,
    ];
  }

  return [fp, true];
}

async function fileExists(fp: string): Promise<boolean> {
  try {
    await fsasync.access(fp);
    return true;
  } catch (err) {
    return false;
  }
}

export {
  getAleSafeFileContent,
  getAlesafeFile,
  setupAlesafeConfig,
  setupMuxAlesafeConfig,
  isFirstRun,
};
