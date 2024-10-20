import prompts from "prompts";
import {BaseCommand, type BaseResult} from "./basecmd.js";

export interface GetResult extends BaseResult{
  website: string,
  password: string,
};

export class Get extends BaseCommand {
  public async run(): Promise<GetResult> {
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
      resolve({website: websitePrompt.website, password: passwordPrompt.value})
    );
  }
}
