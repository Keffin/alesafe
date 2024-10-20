import { BaseCommand } from "./basecmd.js";
import prompts from "prompts";
export class Setup extends BaseCommand {
  public async run(): Promise<[string]> {
    const passwordPrompt = await prompts({
      type: "password",
      name: "value",
      message: "Enter a master password: ",
    });
    return new Promise((resolve) => resolve([passwordPrompt.value]));
  }
}
