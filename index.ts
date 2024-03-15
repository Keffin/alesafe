import { FileDetector } from "./detector/filedetector";
import { AlesafeLoop } from "./alesafeloop";
import { AleSafeSecurityService } from "./security/security";
import { AleSafeManager } from "./manager/alesafemanager";
import { Credential } from "./models/aleSafeTypes";

const fd: FileDetector = new FileDetector();
const sec: AleSafeSecurityService = new AleSafeSecurityService();
const aleSafeManager: AleSafeManager = new AleSafeManager(fd, sec);

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

const credFour: Credential = {
  website: "gitlab6",
  username: "kevkevk6",
  password: "hunter6",
};

//aleSafeLoop.handle(credFour, allSafeMasterPassword);
//aleSafeLoop.getPwPlain(allSafeMasterPassword);

/*aleSafeLoop.handle(credentialOne, allSafeMasterPassword);
aleSafeLoop.handle(credentialTwo, allSafeMasterPassword);
aleSafeLoop.handle(credentialThree, allSafeMasterPassword);
aleSafeLoop.handle(credFour, allSafeMasterPassword);*/

console.log(aleSafeLoop.getPwPlain(allSafeMasterPassword, "gitlab5"));
// During first run if missing; User prompts to input master password, and the dir + file is created.
