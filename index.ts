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
import { Setup } from "./commands/setup";
import { Add } from "./commands/add";

const sec: AleSafeSecurityService = new AleSafeSecurityService();
const aleSafeManager: AleSafeManager = new AleSafeManager(sec);

const aleSafeLoop: AlesafeLoop = new AlesafeLoop(sec, aleSafeManager);

// During first run if missing; User prompts to input master password, and the dir + file is created.

const program: Command = new Command();
program
  .name("Alesafe")
  .description("CLI tool for managing your passwords.")
  .version("0.0.1");

const listCmd: List = new List();
const getCmd: Get = new Get();
const setupCmd: Setup = new Setup();
const addCmd: Add = new Add();

program
  .command("list")
  .description("Lists all your saved passwords, given a valid master password")
  .action(async () => {
    try {
      const pw = await listCmd.run();
      const creds = aleSafeLoop.getAllCredentials(pw[0]);
      creds.map((cred) => listCmd.render(cred));
    } catch (error) {
      if (error instanceof AleSafeError) {
        console.log(chalk.red(`✖ ${error.message}`));
        return;
      }
      console.log(chalk.red("✖ Something went wrong: " + error));
    }
  });

program
  .command("get")
  .description("Gets a saved password, given valid master password")
  .action(async () => {
    try {
      const credRes: [string, string] = await getCmd.run();
      const cred = aleSafeLoop.getCredential(credRes[1], credRes[0]);
      getCmd.render(cred);
    } catch (error) {
      if (error instanceof AleSafeError) {
        console.log(chalk.red(`✖ ${error.message}`));
        return;
      }
      console.log(chalk.red("✖ something went wrong: " + error));
    }
  });

program
  .command("setup")
  .description("Sets up your AleSafe config.")
  .action(async () => {
    const pw = await setupCmd.run();
    aleSafeLoop.setup(pw[0]);
  });

program
  .command("add")
  .description(
    "Encrypts and saves a new password, given a valid master password"
  )
  .action(async () => {
    const cred = await addCmd.run();

    aleSafeLoop.add(
      {
        website: cred[0],
        username: cred[1],
        password: cred[2],
      },
      cred[3]
    );
  });

// TODO: Also add some update command.

program.parse();
