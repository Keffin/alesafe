import prompts from "prompts";
import { BaseCommand } from "./basecmd";

export class List extends BaseCommand {
  // TODO: Add --all flag for getting all
  // TODO: Otherwise if list command get list of websites and allow user to choose which one
  // TODO: Use interactive prompt list
  public async run(): Promise<[string]> {
    const passwordPrompt = await prompts({
      type: "password",
      name: "value",
      message: "Enter your master password: ",
    });

    return new Promise((resolve) => resolve([passwordPrompt.value]));
  }
}
