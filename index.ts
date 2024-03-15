import { FileDetector } from "./detector/filedetector";
import { AlesafeLoop } from "./alesafeloop";
import { AleSafeSecurityService } from "./security/security";
import { AleSafeManager } from "./manager/alesafemanager";
import { Credential } from "./models/aleSafeTypes";

const fd: FileDetector = new FileDetector();
const sec: AleSafeSecurityService = new AleSafeSecurityService();
const aleSafeManager: AleSafeManager = new AleSafeManager(fd);

const aleSafeLoop: AlesafeLoop = new AlesafeLoop(fd, sec, aleSafeManager);
const allSafeMasterPassword = "kevkev42";

const credentialOne: Credential = {
  website: "gitlab3",
  username: "kevkev3",
  password: "hunter33",
};

const credentialTwo: Credential = {
  website: "gitlab4",
  username: "kevkev4",
  password: "hunter4",
};

const credentialThree: Credential = {
  website: "gitlab5",
  username: "kevkev5",
  password: "hunter5",
};

aleSafeLoop.handle(credentialThree, "invalid password");
//alesafeLoop.handle(credentialTwo, allSafeMasterPassword);
//alesafeLoop.handle(credentialOne, allSafeMasterPassword);
//alesafeLoop.handle(credentialOne, allSafeMasterPassword);
// During first run if missing; User prompts to input master password, and the dir + file is created.
