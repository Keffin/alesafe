import prompts from "prompts";
import { BaseCommand } from "./basecmd";
import { Credential } from "../models/AleSafeTypes";

export class List extends BaseCommand {
  public async run(): Promise<[string]> {
    const passwordPrompt = await prompts({
      type: "password",
      name: "value",
      message: "Enter your master password: ",
    });

    return new Promise((resolve) => resolve([passwordPrompt.value]));
  }

  public async selectPw(credentials: Credential[]) {
    const choices = credentials.map((cred) => ({
      title: cred.website,
      value: [cred.website, cred.username, cred.password],
    }));

    const listPrompt = await prompts({
      type: "select",
      name: "website",
      message: "Pick a website",
      choices: choices,
      initial: 0,
    });

    return listPrompt.website;
  }
}
