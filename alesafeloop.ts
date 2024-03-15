import { FileDetector } from "./detector/filedetector";
import { AleSafeManager } from "./manager/alesafemanager";
import { AleSafeError } from "./models/AlesafeError";
import { AleSafeSecurity, Credential } from "./models/aleSafeTypes";
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

  // TODO: Hash each individual password
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
    this.aleSafeManager.addPasswordEntry(credentials);
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
