import { randomBytes, pbkdf2Sync } from "crypto";
import { FileDetector } from "../detector/filedetector";
import fs from "fs";
import { AleSafeFull, AleSafeSecurity } from "../models/aleSafeTypes";

export class AleSafeSecurityService {
  private readonly iterationCount: number = 1000;
  private fd: FileDetector = new FileDetector();

  public authenticate(userInputPassword: string): boolean {
    const alesafeConfig: AleSafeFull = this.readConfig();
    const hashedInput = this.generateHash(
      userInputPassword,
      alesafeConfig.aleSafeSecurity.salt
    );

    return alesafeConfig.aleSafeSecurity.masterPasswordHash === hashedInput;
  }

  // Purpose: Generates salt + hashes the inputted password.
  public setupMasterPassword(userInputPassword: string): AleSafeSecurity {
    const salt: string = this.generateSalt();
    const masterPasswordHash: string = this.generateHash(
      userInputPassword,
      salt
    );

    return {
      masterPasswordHash,
      salt,
      iterationCount: this.iterationCount,
    } as AleSafeSecurity;
  }

  private readConfig(): AleSafeFull {
    const fp: string = fs.readFileSync(this.fd.getAlesafeFile()).toString();

    const conf: AleSafeFull = JSON.parse(fp);

    return conf;
  }

  // Purpose: Hashes a given password, using KDF with a salt and iteration count.
  private generateHash(password: string, salt: string): string {
    const keyLen: number = 64;
    const digest: string = "sha512";

    // Iteratively apply SHA-512 to password.concat(salt) x iterationCount
    const derivedKey = pbkdf2Sync(
      password,
      salt,
      this.iterationCount,
      keyLen,
      digest
    );

    return derivedKey.toString("hex");
  }

  // Purpose: Generate a random salt for each pw.
  // Convert a randomly generated buffer of bytes to HEX format.
  private generateSalt(): string {
    return randomBytes(16).toString("hex");
  }
}
