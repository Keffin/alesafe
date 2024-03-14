import { FileDetector } from "./detector/FileDetector";
import fs from "fs";

type MasterPasswordFormat = {
  hash: string;
  salt: string;
  iterationCount: number;
};

type Credential = {
  website: string;
  username: string;
  password: string;
};

type Alesafe = {
  masterPassword: string;
  salt: string;
  iterationCount: number;
  credentials: Array<Credential>;
};

export class MasterPassword {
  private params: MasterPasswordFormat;
  private fileDetector: FileDetector;

  constructor(params: MasterPasswordFormat, fileDetector: FileDetector) {
    this.params = params;
    this.fileDetector = fileDetector;
  }

  public handle(): void {
    const fp: string = fs
      .readFileSync(this.fileDetector.getAlesafeFile())
      .toString();
    const aleSafe: Alesafe = JSON.parse(fp);

    const newData: Credential = {
      website: "gitlab",
      username: "kevlab",
      password: "kevlabpw",
    };
    aleSafe.credentials.push(newData);

    fs.writeFileSync(
      this.fileDetector.getAlesafeFile(),
      JSON.stringify(aleSafe, null, 2)
    );
  }
}
