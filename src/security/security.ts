import {
  randomBytes,
  pbkdf2Sync,
  createDecipheriv,
  createCipheriv,
  Cipher,
  Decipher,
} from "crypto";
import {getAleSafeFileContent} from "../detector/filedetector.js";
import type {
  AlesafeSecurity,
  Credential,
} from "../models/alesafeTypes.js";


const ITERATION_COUNT = 1000;

export const authenticate = (incomingPw: string): boolean => {
  const alesafeConfig = getAleSafeFileContent();
  const hashed = generateHash(incomingPw, alesafeConfig.aleSafeSecurity.salt);

  return alesafeConfig.aleSafeSecurity.masterPasswordHash === hashed;
}

// Purpose: Decrypts a `Credentials` password.
export const readCredentialPassword = (
    cred: Credential,
    mPw: string,
    secConf: AlesafeSecurity
): string => {
  const key: Buffer = getEncryptionKey(mPw, secConf);
  return decryptPassword(cred.password, key);
}

// Purpose: Encrypts a `Credentials` password.
export const setupCredentialPassword = (
    credentialPassword: string,
    mPw: string,
    secConf: AlesafeSecurity
): string => {
  const key: Buffer = getEncryptionKey(mPw, secConf);
  return encryptPassword(credentialPassword, key);
}

// Purpose: Generates salt + hashes the inputted password.
export const setupMasterPassword = (userInputPassword: string): AlesafeSecurity => {
  const salt: string = generateSalt();
  const masterPasswordHash: string = generateHash(
      userInputPassword,
      salt
  );

  return {
    masterPasswordHash,
    salt,
    iterationCount: ITERATION_COUNT
  };
}

// Purpose: Symmetric decryption of the encrypted `Credential` password, with key derived from master password.
const decryptPassword = (
    encryptedPassword: string,
    derivedKey: Buffer
): string => {
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

// Purpose: Uses the master password to derive an encryption key
const getEncryptionKey = (
    masterPasswordInput: string,
    secConf: AlesafeSecurity
): Buffer => {
  return pbkdf2Sync(
      masterPasswordInput,
      secConf.salt,
      secConf.iterationCount,
      32,
      "sha512"
  );
}

// Purpose: Symmetric encryption of the `Credential` password, with key derived from master password.
const encryptPassword = (
    credentialPassword: string,
    derivedKey: Buffer
): string => {
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

// Purpose: Hashes a given password, using KDF with a salt and iteration count.
const generateHash = (password: string, salt: string): string => {
  const keyLen: number = 32;
  const digest: string = "sha512";

  // Iteratively apply SHA-512 to password.concat(salt) x iterationCount
  const derivedKey = pbkdf2Sync(
      password,
      salt,
      ITERATION_COUNT,
      keyLen,
      digest
  );

  return derivedKey.toString("hex");
}

// Purpose: Generate a random salt for each pw.
// Convert a randomly generated buffer of bytes to HEX format.
const generateSalt = (): string => {
  return randomBytes(16).toString("hex");
}
