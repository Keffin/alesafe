import { FileDetector } from "../detector/filedetector";
import { AleSafeFull, Credential } from "../models/AleSafeTypes";
import fs from "fs";
import { AleSafeSecurityService } from "../security/security";

export class AleSafeManager {
  private fd: FileDetector;
  private securityService: AleSafeSecurityService;

  constructor(fd: FileDetector, securityService: AleSafeSecurityService) {
    this.fd = fd;
    this.securityService = securityService;
  }

  public addPasswordEntry(credentialToAdd: Credential, mPw: string) {
    this.writeEntry(credentialToAdd, mPw);
  }

  private writeEntry(credentialToAdd: Credential, mPw: string): void {
    const aleSafeConfig: AleSafeFull = this.fd.getAleSafeFileContent();

    if (this.isDupelicate(credentialToAdd, aleSafeConfig)) {
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
