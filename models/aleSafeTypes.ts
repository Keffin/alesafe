export type AlesafeFull = {
  aleSafeSecurity: AlesafeSecurity;
  credentials: Array<Credential>;
};

export type AlesafeSecurity = {
  masterPasswordHash: string;
  salt: string;
  iterationCount: number;
};

export type Credential = {
  website: string;
  username: string;
  password: string;
};
