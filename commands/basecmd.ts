import { Credential } from "../models/AleSafeTypes";
import chalk from "chalk";

export abstract class BaseCommand {
  abstract run(): Promise<string[]>;

  render(credential: Credential): void {
    console.log(` 
Website : ${chalk.green(credential.website)}
Username: ${chalk.green(credential.username)}
Password: ${chalk.red(credential.password)}
      `);
  }
}
