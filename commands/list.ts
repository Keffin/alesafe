import prompts from "prompts";
import { Credential } from "../models/AleSafeTypes";
import chalk from "chalk";

export class List {
  // TODO: Add --all flag for getting all
  // TODO: Otherwise if list command get list of websites and allow user to choose which one
  public async run(): Promise<string> {
    const passwordPrompt = await prompts({
      type: "password",
      name: "value",
      message: "Enter your master password: ",
    });

    return new Promise((resolve) => resolve(passwordPrompt.value));
  }

  public render(credentials: Credential[]) {
    for (const cred of credentials) {
      console.log(` 
Website : ${chalk.green(cred.website)}
Username: ${chalk.green(cred.username)}
Password: ${chalk.red(cred.password)}
      `);
    }
  }
}
