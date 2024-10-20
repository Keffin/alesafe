import chalk from "chalk";
import {
  getAleSafeFileContent,
  isFirstRun,
  setupAlesafeConfig,
  setupMuxAlesafeConfig,
} from "../detector/filedetector.js";
import { AleSafeManager } from "../manager/alesafemanager.js";
import { AlesafeError } from "../models/alesafeError.js";
import type {
  AlesafeFull,
  AlesafeSecurity,
  Credential,
} from "../models/alesafeTypes.js";
import {authenticate, readCredentialPassword, setupMasterPassword} from "../security/security.js";

export class AlesafeLoop {
  private aleSafeManager: AleSafeManager;

  constructor(
    aleSafeManager: AleSafeManager
  ) {
    this.aleSafeManager = aleSafeManager;
  }

  public getAllCredentials(pw: string): Credential[] {
    if (!authenticate(pw)) {
      throw new AlesafeError("invalid master password supplied");
    }

    const aleSafe: AlesafeFull = getAleSafeFileContent();

    const allPws: Credential[] = [];
    for (const cred of aleSafe.credentials) {
      allPws.push({
        website: cred.website,
        username: cred.username,
        password: readCredentialPassword(
          cred,
          pw,
          aleSafe.aleSafeSecurity
        ),
      });
    }
    return allPws;
  }

  public getCredential(masterPassword: string, website: string): Credential {
    if (!authenticate(masterPassword)) {
      throw new AlesafeError("invalid master password supplied");
    }

    const aleSafe: AlesafeFull = getAleSafeFileContent();

    const credential = aleSafe.credentials.find(
      (cred) => cred.website === website
    );

    if (credential) {
      return {
        website: website,
        username: credential.username,
        password: readCredentialPassword(
          credential,
          masterPassword,
          aleSafe.aleSafeSecurity
        ),
      };
    }

    throw new AlesafeError("no matching credentials for given webpage");
  }

  public add(credential: Credential, masterPassword: string): void {
    if (!authenticate(masterPassword)) {
      throw new AlesafeError("invalid master password supplied");
    }
    this.aleSafeManager.addPasswordEntry(credential, masterPassword);
  }

  public setup(masterPassword: string): void {
    if (isFirstRun()) {
      const hashedConfig: AlesafeSecurity =
        setupMasterPassword(masterPassword);

      setupAlesafeConfig(hashedConfig);
      return;
    }
    console.log(
        chalk.yellow("⚠ your AleSafe config already exists, exiting...")
      );
  }

  public setupMux() {
    return setupMuxAlesafeConfig();
  }
}
