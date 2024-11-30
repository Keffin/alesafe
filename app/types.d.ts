export type AlesafeFullElectron = {
  security: SecurityUI;
  credentials: CredentialsUI[];
};

export type SecurityUI = {
  massPasswordHash: string;
  salt: string;
  iterationCount: number;
};

export type CredentialsUI = {
  website: string;
  username: string;
  password: string;
};

interface Window {
  electron: {
    getContent: () => Promise<AlesafeFullElectron>;
    //getFile: () => Promise<string>;
  };
}
