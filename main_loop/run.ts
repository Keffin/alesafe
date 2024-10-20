import { Command } from "commander";
import { Add } from "../commands/add.js";
import { Get } from "../commands/get.js";
import { List } from "../commands/list.js";
import { Setup } from "../commands/setup.js";
import { AleSafeManager } from "../manager/alesafemanager.js";
import { AleSafeError } from "../models/AleSafeError.js";
import { AleSafeSecurityService } from "../security/security.js";
import { AlesafeLoop } from "./alesafeloop.js";
import chalk from "chalk";
import pkg from "../package.json" with { type: "json" };
import { Mux } from "../commands/mux.js";

const sec: AleSafeSecurityService = new AleSafeSecurityService();
const aleSafeManager: AleSafeManager = new AleSafeManager(sec);
const aleSafeLoop: AlesafeLoop = new AlesafeLoop(sec, aleSafeManager);
const program: Command = new Command();
const listCmd: List = new List();
const getCmd: Get = new Get();
const setupCmd: Setup = new Setup();
const addCmd: Add = new Add();
const muxCmd: Mux = new Mux();

program
  .name("Alesafe")
  .description("Alesafe is a CLI tool for managing your passwords locally.")
  .version(pkg.version);

program
  .command("list")
  .description("Lists all your saved passwords, given a valid master password")
  .option("-a, --all", "log all passwords")
  .action(async (options) => {
    try {
      const { all } = options;
      const pw = await listCmd.run();
      const creds = aleSafeLoop.getAllCredentials(pw[0]);

      if (creds.length === 0) {
        console.log(
          chalk.yellow(
            "You have no saved passwords yet. Run add command to setup."
          )
        );
        return;
      }

      if (all) {
        console.log("all activated");
        creds.map((cred) => listCmd.render(cred));
        return;
      }

      // Handle is length is 1, since choices prompts will fail.
      const [website, username, pass] = await listCmd.selectPw(creds);
      listCmd.render({ website, username, password: pass });
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
  .command("mux")
  .description("Allows you to setup multiple AleSafe configuration files.")
  .option("-c, --create", "creates a new alesafe json file")
  .option("-a, --all", "logs all passwords")
  .option("-s, --single", "logs a selected password")
  .action(async () => {
    const files = aleSafeLoop.setupMux();
    const fileName = await muxCmd.selectFile(files);
    console.log(fileName);
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
