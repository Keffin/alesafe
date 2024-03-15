import { FileDetector } from "../detector/filedetector";
import { AleSafeFull, Credential } from "../models/aleSafeTypes";
import fs from "fs";

export class AleSafeManager {
  private fd: FileDetector;

  constructor(fd: FileDetector) {
    this.fd = fd;
  }

  public addPasswordEntry(credentialToAdd: Credential) {
    this.writeEntry(credentialToAdd);
  }

  // Setup encryption of each credentials password.
  // When running the app the user provides password and can get the password in plaintext.
  // Otherwise write each credential entry encrypted too.
  private writeEntry(credentialToAdd: Credential): void {
    const file: string = fs.readFileSync(this.fd.getAlesafeFile()).toString();

    const aleSafeConfig: AleSafeFull = JSON.parse(file);

    if (this.isDupelicate(credentialToAdd, aleSafeConfig)) {
      return;
    }

    aleSafeConfig.credentials.push(credentialToAdd);

    fs.writeFileSync(
      this.fd.getAlesafeFile(),
      JSON.stringify(aleSafeConfig, null, 2)
    );
  }

  private isDupelicate(
    credentialsToAdd: Credential,
    aleSafeConfig: AleSafeFull
  ): boolean {
    for (const cred of aleSafeConfig.credentials) {
      if (cred.website === credentialsToAdd.website) {
        if (cred.password === credentialsToAdd.password) {
          console.log("same password, don't update. This is duped entry..");
          return true;
        }
        // Handle this
        console.log("Password is diffing...update in place?");
        return false;
      }
    }
    return false;
  }
}
