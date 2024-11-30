export type AlesafeFullElectron = {
  aleSafeSecurity: SecurityUI;
  credentials: CredentialsUI[];
};

export type SecurityUI = {
  iterationCount: number;
  masterPasswordHash: string;
  salt: string;
};

export type CredentialsUI = {
  website: string;
  username: string;
  password: string;
};
