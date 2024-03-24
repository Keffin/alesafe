import { Command } from "commander";
import { Add } from "../commands/add";
import { Get } from "../commands/get";
import { List } from "../commands/list";
import { Setup } from "../commands/setup";
import { AleSafeManager } from "../manager/alesafemanager";
import { AleSafeError } from "../models/AleSafeError";
import { AleSafeSecurityService } from "../security/security";
import { AlesafeLoop } from "./alesafeloop";
import chalk from "chalk";
import pkg from "../package.json";

const sec: AleSafeSecurityService = new AleSafeSecurityService();
const aleSafeManager: AleSafeManager = new AleSafeManager(sec);
const aleSafeLoop: AlesafeLoop = new AlesafeLoop(sec, aleSafeManager);
const program: Command = new Command();
const listCmd: List = new List();
const getCmd: Get = new Get();
const setupCmd: Setup = new Setup();
const addCmd: Add = new Add();

program
  .name("Alesafe")
  .description("Alesafe is a CLI tool for managing your passwords locally.")
  .version(pkg.version);

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

export function main() {
  program.parse();
}
