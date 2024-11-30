import { pbkdf2, createDecipheriv } from "crypto";
import { CredentialsUI, SecurityUI } from "../../types.js";
import { BrowserWindow } from "electron";

export async function validatePassword(
  input: string,
  sec: SecurityUI,
  mainWindow: BrowserWindow,
): Promise<void> {
  const hashedInput = await generateHash(input, sec);
  const result = hashedInput === sec.masterPasswordHash;
  mainWindow.webContents.send("hashResult", result);
}

export async function readPassword(
  input: string,
  sec: SecurityUI,
  credentialsPassword: CredentialsUI,
  mainWindow: BrowserWindow,
): Promise<void> {
  const derivedKey = await pbkdf2Wrapper(input, sec);
  const result = await decrypt(credentialsPassword.password, derivedKey);
  mainWindow.webContents.send("parsePassword", result);
}

async function decrypt(credPw: string, derivedKey: Buffer): Promise<string> {
  const initializationVector: Buffer = Buffer.from(credPw.slice(0, 32), "hex");

  const encryptedData: string = credPw.slice(32);
  const decipher = createDecipheriv(
    "aes-256-cbc",
    derivedKey,
    initializationVector,
  );

  let decryptedPassword: string = decipher.update(encryptedData, "hex", "utf8");
  decryptedPassword += decipher.final("utf8");
  return decryptedPassword;
}

async function generateHash(
  password: string,
  sec: SecurityUI,
): Promise<string> {
  const derivedKey = await pbkdf2Wrapper(password, sec);
  return derivedKey.toString("hex");
}

async function pbkdf2Wrapper(
  masterPassword: string,
  sec: SecurityUI,
): Promise<Buffer> {
  const keyLen = 32;
  const digest = "sha512";
  return new Promise((res, rej) => {
    pbkdf2(
      masterPassword,
      sec.salt,
      sec.iterationCount,
      keyLen,
      digest,
      (err: Error | null, key: Buffer) => {
        if (err) rej(err);
        res(key);
      },
    );
  });
}
