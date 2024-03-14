import fs from "fs";
import path from "path";
import os from "os";

export class FileDetector {
  // Public method for fetching the alesafe file.
  public getAlesafeFile(): string {
    try {
      const fetchedFiled: [string, boolean] = this.fetchFile();
      if (fetchedFiled[1] === false) {
        throw new Error(fetchedFiled[0]);
      }

      return fetchedFiled[0];
    } catch (err) {
      if (err instanceof Error) {
        console.error(err);
      }

      return "Failed to get AlesafeFile";
    }
  }

  // Looks into home dir to find the file.
  private fetchFile(): [string, boolean] {
    const homeDir: string = os.homedir();
    const hiddenDirName: string = ".alesafe";
    const fileName: string = ".alexp.json";
    // .alexp.json

    const hiddenDirPath: string = path.join(homeDir, hiddenDirName);

    if (
      !fs.existsSync(hiddenDirPath) ||
      !fs.statSync(hiddenDirPath).isDirectory()
    ) {
      return [
        `The directory ${hiddenDirName} does not exist. Create it by running mkdir ~/.alesafe`,
        false,
      ];
    }

    const fp: string = path.join(hiddenDirPath, fileName);
    if (!fs.existsSync(fp)) {
      return [
        `Filename: ${fileName} not found at ${hiddenDirName}. Create it by running touch ~/.alesafe/.test.txt`,
        false,
      ];
    }

    return [fp, true];
  }
}
