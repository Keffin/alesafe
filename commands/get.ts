import chalk from "chalk";
import prompts from "prompts";
import { BaseCommand } from "./basecmd";

export class Get extends BaseCommand {
  public async run(): Promise<[string, string]> {
    const websitePrompt = await prompts({
      type: "text",
      name: "website",
      message: "Which website credentials are you looking for? ",
    });

    const passwordPrompt = await prompts({
      type: "password",
      name: "value",
      message: "Enter your master password: ",
    });

    return new Promise((resolve) =>
      resolve([websitePrompt.website, passwordPrompt.value])
    );
  }
}
