import {
  getAlesafeFile,
  getAleSafeFileContent,
  isFirstRun,
  setupAlesafeConfig,
} from "./detector/filedetector";
import { AleSafeManager } from "./manager/alesafemanager";
import { AleSafeError } from "./models/AleSafeError";
import {
  AleSafeFull,
  AleSafeSecurity,
  Credential,
} from "./models/AleSafeTypes";
import { AleSafeSecurityService } from "./security/security";

export class AlesafeLoop {
  private securityHandler: AleSafeSecurityService;
  private aleSafeManager: AleSafeManager;

  constructor(
    securityHandler: AleSafeSecurityService,
    aleSafeManager: AleSafeManager
  ) {
    this.securityHandler = securityHandler;
    this.aleSafeManager = aleSafeManager;
  }

  public getAllCredentials(pw: string): Credential[] {
    if (!this.securityHandler.authenticate(pw)) {
      throw new AleSafeError("invalid master password supplied");
    }

    const aleSafe: AleSafeFull = getAleSafeFileContent();

    const allPws: Credential[] = [];
    for (const cred of aleSafe.credentials) {
      allPws.push({
        website: cred.website,
        username: cred.username,
        password: this.securityHandler.readCredentialPassword(
          cred,
          pw,
          aleSafe.aleSafeSecurity
        ),
      });
    }
    return allPws;
  }

  public getCredential(masterPassword: string, website: string): Credential {
    if (!this.securityHandler.authenticate(masterPassword)) {
      throw new AleSafeError("invalid master password supplied");
    }

    const aleSafe: AleSafeFull = getAleSafeFileContent();

    const credential = aleSafe.credentials.find(
      (cred) => cred.website === website
    );

    if (credential) {
      return {
        website: website,
        username: credential.username,
        password: this.securityHandler.readCredentialPassword(
          credential,
          masterPassword,
          aleSafe.aleSafeSecurity
        ),
      };
    }

    throw new AleSafeError("no matching credentials for given webpage");
  }

  public add(credential: Credential, masterPassword: string): void {
    if (!this.securityHandler.authenticate(masterPassword)) {
      throw new AleSafeError("invalid master password supplied");
    }
    this.aleSafeManager.addPasswordEntry(credential, masterPassword);
  }

  // TODO: Setup main loop
  public setup(masterPassword: string): void {
    // Handle first time setup
    if (isFirstRun()) {
      // So second time user auths it will be looking at inputted PW and hashing it with the hash from file and verifying.

      const hashedConfig: AleSafeSecurity =
        this.securityHandler.setupMasterPassword(masterPassword);

      setupAlesafeConfig(hashedConfig);
      return;
    } else {
      console.log("AleSafe config already setup...");
    }
  }
}
