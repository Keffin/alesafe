import { pbkdf2 } from "crypto";
import { SecurityUI } from "../../types.js";
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
