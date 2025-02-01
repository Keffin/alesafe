import type { Credential } from "../models/alesafeTypes.js";
import chalk from "chalk";

export type BaseResult = object;

export abstract class BaseCommand {
  abstract run(): Promise<BaseResult>;

  render(credential: Credential): void {
    console.log(`
Website : ${chalk.green(credential.website)}
Username: ${chalk.green(credential.username)}
Password: ${chalk.red(credential.password)}
      `);
  }
}
