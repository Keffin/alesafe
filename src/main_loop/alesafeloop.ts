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
import {
  authenticate,
  readCredentialPassword,
  setupMasterPassword,
} from "../security/security.js";

export class AlesafeLoop {
  private aleSafeManager: AleSafeManager;

  constructor(aleSafeManager: AleSafeManager) {
    this.aleSafeManager = aleSafeManager;
  }

  public async getAllCredentials(pw: string): Promise<Credential[]> {
    if (!authenticate(pw)) {
      throw new AlesafeError("invalid master password supplied");
    }

    const aleSafe: AlesafeFull = await getAleSafeFileContent();

    const allPws: Credential[] = [];
    for (const cred of aleSafe.credentials) {
      allPws.push({
        website: cred.website,
        username: cred.username,
        password: await readCredentialPassword(
          cred,
          pw,
          aleSafe.aleSafeSecurity,
        ),
      });
    }
    return allPws;
  }

  public async getCredential(
    masterPassword: string,
    website: string,
  ): Promise<Credential> {
    if (!authenticate(masterPassword)) {
      throw new AlesafeError("invalid master password supplied");
    }

    const aleSafe: AlesafeFull = await getAleSafeFileContent();

    const credential = aleSafe.credentials.find(
      (cred) => cred.website === website,
    );

    if (credential) {
      return {
        website: website,
        username: credential.username,
        password: await readCredentialPassword(
          credential,
          masterPassword,
          aleSafe.aleSafeSecurity,
        ),
      };
    }

    throw new AlesafeError("no matching credentials for given webpage");
  }

  public async add(
    credential: Credential,
    masterPassword: string,
  ): Promise<void> {
    const authenticated = await authenticate(masterPassword);
    if (!authenticated) {
      throw new AlesafeError("invalid master password supplied");
    }
    this.aleSafeManager.addPasswordEntry(credential, masterPassword);
  }

  public async setup(masterPassword: string): Promise<void> {
    const isFirst = await isFirstRun();
    if (isFirst) {
      const hashedConfig: AlesafeSecurity = setupMasterPassword(masterPassword);
      await setupAlesafeConfig(hashedConfig);
      return;
    } else {
      console.log(
        chalk.yellow("⚠ your AleSafe config already exists, exiting..."),
      );
    }
  }

  public setupMux() {
    return setupMuxAlesafeConfig();
  }
}
