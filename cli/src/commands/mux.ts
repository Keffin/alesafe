import { BaseCommand } from "./basecmd.js";
import prompts from "prompts";

export class Mux extends BaseCommand {
  public async run(): Promise<string[]> {
    return Promise.resolve([]);
  }

  public async selectFile(files: string[]) {
    const choices: { title: string; value: string }[] = files.map(
      (fileName: string) => ({
        title: fileName,
        value: fileName,
      })
    );

    const listPrompt: prompts.Answers<string> = await prompts({
      type: "select",
      name: "storage",
      message: "pick a password file",
      choices: choices,
      initial: 0,
    });

    return listPrompt.storage;
  }
}
