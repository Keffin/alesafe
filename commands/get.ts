import prompts, { PromptObject } from "prompts";

export class Get {
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
