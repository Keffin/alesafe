import type { AlesafeFull, Credential } from "../models/alesafeTypes.js";
import fs from "fs";
import { AleSafeSecurityService } from "../security/security.js";
import {
  getAlesafeFile,
  getAleSafeFileContent,
} from "../detector/filedetector.js";

export class AleSafeManager {
  private securityService: AleSafeSecurityService;

  constructor(securityService: AleSafeSecurityService) {
    this.securityService = securityService;
  }

  public addPasswordEntry(credentialToAdd: Credential, mPw: string) {
    this.writeEntry(credentialToAdd, mPw);
  }

  private writeEntry(credentialToAdd: Credential, mPw: string): void {
    const aleSafeConfig: AlesafeFull = getAleSafeFileContent();

    if (this.isDuplicate(credentialToAdd, aleSafeConfig)) {
      return;
    }

    const encryptPw = this.securityService.setupCredentialPassword(
      credentialToAdd.password,
      mPw,
      aleSafeConfig.aleSafeSecurity
    );

    const encryptedCredentials: Credential = {
      ...credentialToAdd,
      password: encryptPw,
    };

    aleSafeConfig.credentials.push(encryptedCredentials);

    // TODO: Handle `getAleSafeFile()` failure.

    fs.writeFileSync(getAlesafeFile(), JSON.stringify(aleSafeConfig, null, 2));
  }

  private isDuplicate(
    credentialsToAdd: Credential,
    aleSafeConfig: AlesafeFull
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
