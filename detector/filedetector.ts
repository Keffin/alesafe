import fs from "fs";
import path from "path";
import os from "os";

import { AleSafeSecurity } from "../models/aleSafeTypes";
import { AleSafeError } from "../models/AlesafeError";

export class FileDetector {
  private readonly homeDir: string = os.homedir();
  private readonly alesafeDirName: string = ".alesafe";
  private readonly alesafeFileName: string = ".alexp.json";

  // Public method for fetching the alesafe file.
  public getAlesafeFile(): string {
    const fetchedFiled: [string, boolean] = this.fetchFile();

    if (fetchedFiled[1] === false) {
      throw new AleSafeError(fetchedFiled[0]);
    }

    return fetchedFiled[0];
  }

  public setupAlesafeConfig(aleSafeSecurityConfig: AleSafeSecurity): void {
    console.log(
      "Seems like you are missing the config needed...setting it up..."
    );

    // Create alesafe DIR
    const alesafeDir: string = path.join(this.homeDir, this.alesafeDirName);
    fs.mkdirSync(alesafeDir);
    // Create alesafe JSON file
    const alesafeJson: string = path.join(alesafeDir, this.alesafeFileName);

    const fileContent = {
      aleSafeSecurity: {
        ...aleSafeSecurityConfig,
      },
      credentials: [],
    };
    // Write the master password details but hashed, its salt and the count
    fs.writeFileSync(alesafeJson, JSON.stringify(fileContent, null, 2));
  }

  // Looks into home dir to find the file.
  private fetchFile(): [string, boolean] {
    const hiddenDirPath: string = path.join(this.homeDir, this.alesafeDirName);

    if (
      !fs.existsSync(hiddenDirPath) ||
      !fs.statSync(hiddenDirPath).isDirectory()
    ) {
      return [
        `The directory ${this.alesafeDirName} does not exist. Create it by running mkdir ~/.alesafe`,
        false,
      ];
    }

    const fp: string = path.join(hiddenDirPath, this.alesafeFileName);
    if (!fs.existsSync(fp)) {
      return [
        `Filename: ${this.alesafeFileName} not found at ${this.alesafeDirName}. Create it by running touch ~/.alesafe/.test.txt`,
        false,
      ];
    }

    return [fp, true];
  }
}
