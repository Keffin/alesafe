import {
  randomBytes,
  pbkdf2Sync,
  createDecipheriv,
  createCipheriv,
  Cipher,
  Decipher,
} from "crypto";
import { FileDetector } from "../detector/filedetector";
import {
  AleSafeFull,
  AleSafeSecurity,
  Credential,
} from "../models/aleSafeTypes";

export class AleSafeSecurityService {
  private readonly iterationCount: number = 1000;
  private fd: FileDetector = new FileDetector();

  public authenticate(userInputPassword: string): boolean {
    const alesafeConfig: AleSafeFull = this.fd.getAleSafeFileContent();
    const hashedInput = this.generateHash(
      userInputPassword,
      alesafeConfig.aleSafeSecurity.salt
    );

    return alesafeConfig.aleSafeSecurity.masterPasswordHash === hashedInput;
  }

  // Purpose: Decrypts a `Credentials` password.
  public readCredentialPassword(
    cred: Credential,
    mPw: string,
    secConf: AleSafeSecurity
  ): string {
    const key: Buffer = this.getEncryptionKey(mPw, secConf);
    return this.decryptPassword(cred.password, key);
  }

  // Purpose: Encrypts a `Credentials` password.
  public setupCredentialPassword(
    credentialPassword: string,
    mPw: string,
    secConf: AleSafeSecurity
  ): string {
    const key: Buffer = this.getEncryptionKey(mPw, secConf);
    return this.encryptPassword(credentialPassword, key);
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

  // Purpose: Uses the master password to derive an encryption key
  private getEncryptionKey(
    masterPasswordInput: string,
    secConf: AleSafeSecurity
  ): Buffer {
    return pbkdf2Sync(
      masterPasswordInput,
      secConf.salt,
      secConf.iterationCount,
      32,
      "sha512"
    );
  }

  // Purpose: Symmetric encryption of the `Credential` password, with key derived from master password.
  private encryptPassword(
    credentialPassword: string,
    derivedKey: Buffer
  ): string {
    const initializationVector: Buffer = randomBytes(16);
    const cipher: Cipher = createCipheriv(
      "aes-256-cbc",
      derivedKey,
      initializationVector
    );

    let encryptedPw: string = cipher.update(credentialPassword, "utf8", "hex");
    encryptedPw += cipher.final("hex");
    // prepend IV to encrypted data.
    return initializationVector.toString("hex") + encryptedPw;
  }

  // Purpose: Symmetric decryption of the encrypted `Credential` password, with key derived from master password.
  private decryptPassword(
    encryptedPassword: string,
    derivedKey: Buffer
  ): string {
    // extract IV from encrypted password.
    const initializationVector: Buffer = Buffer.from(
      encryptedPassword.slice(0, 32),
      "hex"
    );

    const encryptedData: string = encryptedPassword.slice(32);
    const decipher: Decipher = createDecipheriv(
      "aes-256-cbc",
      derivedKey,
      initializationVector
    );

    let decryptedPassword: string = decipher.update(
      encryptedData,
      "hex",
      "utf8"
    );
    decryptedPassword += decipher.final("utf8");
    return decryptedPassword;
  }

  // Purpose: Hashes a given password, using KDF with a salt and iteration count.
  private generateHash(password: string, salt: string): string {
    const keyLen: number = 32;
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
