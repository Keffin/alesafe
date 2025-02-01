import { BaseCommand, type BaseResult } from "./basecmd.js";
import prompts from "prompts";

export interface AddResult extends BaseResult {
  website: string;
  username: string;
  password: string;
  masterPw: string;
}

export class Add extends BaseCommand {
  public async run(): Promise<AddResult> {
    const passwordPrompt = await prompts({
      type: "password",
      name: "value",
      message: "Enter your master password: ",
    });

    const websitePrompt = await prompts({
      type: "text",
      name: "website",
      message: "What website are you adding? ",
    });

    const userNamePrompt = await prompts({
      type: "text",
      name: "username",
      message: "What is your user name? ",
    });

    const webPw = await prompts({
      type: "password",
      name: "pw",
      message: "What is your password? ",
    });

    return new Promise((resolve) =>
      resolve({
        website: websitePrompt.website,
        username: userNamePrompt.username,
        password: webPw.pw,
        masterPw: passwordPrompt.value,
      }),
    );
  }
}
