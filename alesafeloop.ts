import { FileDetector } from "./detector/filedetector";
import { AleSafeManager } from "./manager/alesafemanager";
import { AleSafeError } from "./models/AleSafeError";
import {
  AleSafeFull,
  AleSafeSecurity,
  Credential,
} from "./models/AleSafeTypes";
import { AleSafeSecurityService } from "./security/security";

export class AlesafeLoop {
  private fd: FileDetector;
  private securityHandler: AleSafeSecurityService;
  private aleSafeManager: AleSafeManager;

  constructor(
    fd: FileDetector,
    securityHandler: AleSafeSecurityService,
    aleSafeManager: AleSafeManager
  ) {
    this.fd = fd;
    this.securityHandler = securityHandler;
    this.aleSafeManager = aleSafeManager;
  }

  public getAllPw(pw: string): Credential[] {
    if (!this.securityHandler.authenticate(pw)) {
      throw new AleSafeError("invalid master password supplied");
    }

    const aleSafe: AleSafeFull = this.fd.getAleSafeFileContent();

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

  public getPwPlain(pw: string, website: string): string {
    if (!this.securityHandler.authenticate(pw)) {
      throw new AleSafeError("invalid master password supplied");
    }

    const aleSafe: AleSafeFull = this.fd.getAleSafeFileContent();

    const credential = aleSafe.credentials.find(
      (cred) => cred.website === website
    );

    if (credential) {
      return this.securityHandler.readCredentialPassword(
        credential,
        pw,
        aleSafe.aleSafeSecurity
      );
    }

    return "no matching credentials for given webpage";
  }

  // TODO: Setup main loop
  public handle(credentials: Credential, masterPassword: string): void {
    // Handle first time setup
    if (this.isFirstRun()) {
      // So second time user auths it will be looking at inputted PW and hashing it with the hash from file and verifying.

      const hashedConfig: AleSafeSecurity =
        this.securityHandler.setupMasterPassword(masterPassword);

      this.fd.setupAlesafeConfig(hashedConfig);
    }

    if (!this.securityHandler.authenticate(masterPassword)) {
      throw new AleSafeError("invalid master password supplied");
    }
    this.aleSafeManager.addPasswordEntry(credentials, masterPassword);
  }

  private isFirstRun(): boolean {
    try {
      const _ = this.fd.getAlesafeFile();
      return false;
    } catch (error) {
      if (error instanceof AleSafeError) {
        return true;
      }
      throw error;
    }
  }
}
