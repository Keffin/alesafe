import fsasync from "fs/promises";
import path from "path";
import os from "os";
import { BrowserWindow } from "electron";

export function isDev(): boolean {
  return process.env.NODE_ENV === "development";
}
const HOME_DIR: string = os.homedir();
const ALESAFE_DIR_NAME: string = ".alesafe";
const ALESAFE_FILE_NAME: string = ".alexp.json";

export async function getContent(fName: string, mainWindow: BrowserWindow) {
  const content = (await fsasync.readFile(fName)).toString();
  const asJson = JSON.parse(content);

  mainWindow.webContents.send("content", asJson);
}

export async function getAlesafeFile(
  mainWindow: BrowserWindow,
): Promise<string> {
  const fetchedFile: [string, boolean] = await fetchFile();
  if (!fetchedFile[1]) {
    throw new Error(fetchedFile[0]);
  }

  mainWindow.webContents.send("file", { c: fetchedFile[0] });
  return fetchedFile[0];
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
