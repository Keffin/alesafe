import {BaseCommand, type BaseResult} from "./basecmd.js";
import prompts from "prompts";

export interface SetupResult extends BaseResult {
  masterPw: string
}
export class Setup extends BaseCommand {
  public async run(): Promise<SetupResult> {
    const passwordPrompt = await prompts({
      type: "password",
      name: "value",
      message: "Enter a master password: ",
    });

    return new Promise((resolve) => resolve({
      masterPw: passwordPrompt.value
    }));
  }
}
