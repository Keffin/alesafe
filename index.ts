import { FileDetector } from "./detector/filedetector";

import { AlesafeLoop } from "./alesafeloop";
import { AleSafeSecurityService } from "./security/security";
import { AleSafeManager } from "./manager/alesafemanager";
import { Credential } from "./models/AleSafeTypes";
import { Command, Option } from "commander";
import prompts from "prompts";
import chalk from "chalk";
import { List } from "./commands/list";
import { AleSafeError } from "./models/AleSafeError";
import { Get } from "./commands/get";

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

//console.log(aleSafeLoop.getPwPlain(allSafeMasterPassword, "gitlab5"));
// During first run if missing; User prompts to input master password, and the dir + file is created.

const program: Command = new Command();
program
  .name("Alesafe")
  .description("CLI tool for managing your passwords.")
  .version("0.0.1");

const listCmd: List = new List();
const getCmd: Get = new Get();

program
  .command("list")
  .description("Lists all your saved passwords, given a valid master password")
  .action(async () => {
    try {
      const creds = aleSafeLoop.getAllPw(await listCmd.run());
      listCmd.render(creds);
    } catch (error) {
      if (error instanceof AleSafeError) {
        console.log(chalk.red("✖ Invalid password supplied"));
        return;
      }
      console.log(chalk.red("✖ Something went wrong: " + error));
    }
  });

program
  .command("get")
  .description("Gets a saved password, given valid master password")
  //.argument("<website>", "the website credentials")
  //.argument("[password]", "your master password")
  .action(async () => {
    const credRes: [string, string] = await getCmd.run();
    const cred = aleSafeLoop.getPwPlain(credRes[1], credRes[0]);
    console.log(cred);
  });

program
  .command("set")
  .description(
    "Encrypts and saves a new password, given a valid master password"
  )
  .argument("<website>", "the website credentials you wish to add")
  .argument("<username>", "the username for your credentials")
  .argument("[password]", "the password for your credentials")
  .action((website: string, username: string, password: string) => {
    console.log(website, username, password);
  });

// TODO: Also add some update command.

program.parse();
