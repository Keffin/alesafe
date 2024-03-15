export type AleSafeFull = {
  aleSafeSecurity: AleSafeSecurity;
  credentials: Array<Credential>;
};

export type AleSafeSecurity = {
  masterPasswordHash: string;
  salt: string;
  iterationCount: number;
};

export type Credential = {
  website: string;
  username: string;
  password: string;
};
