import { BaseCommand } from "./basecmd.js";
import prompts from "prompts";
export class Add extends BaseCommand {
  public async run(): Promise<[string, string, string, string]> {
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

    const passwordPrompt = await prompts({
      type: "password",
      name: "value",
      message: "Enter your master password: ",
    });
    return new Promise((resolve) =>
      resolve([
        websitePrompt.website,
        userNamePrompt.username,
        webPw.pw,
        passwordPrompt.value,
      ])
    );
  }
}
