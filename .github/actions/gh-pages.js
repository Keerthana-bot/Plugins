const fs = require("fs");
const path = require("path");
const axios = require("axios");
const core = require("@actions/core");
const simpleGit = require("simple-git");
const github = require("@actions/github");
const { execSync } = require("child_process");
const JavaScriptObfuscator = require("javascript-obfuscator");

class RUN {
  constructor() {
    this.git = simpleGit();
    this.branchName = process.env.INPUT_BRANCH_NAME || "gh-pages";
    this.accessToken = process.env.GITHUB_TOKEN || undefined;
    this.owner = process.env.OWNER || "Ajayos";
    this.repo = process.env.REPO || "keerthana-plugins";
    this.localDirectory = "Plugins";
    this.pluginUrl = "https://github.com/Keerthana-bot/plugin";
  }

  async Start() {
    execSync(`npx prettier --write .`);
    this.cloneRepo(
      "https://github.com/Keerthana-bot/plugin",
      "Plugins",
      "gh-pages"
    );
    execSync(`npx prettier --write .`);
    if (fs.existsSync("./Plugins/.github")) {
      await fs.rmSync("./Plugins/.github", { recursive: true });
    }
    if (fs.existsSync("./Plugins/node_modules")) {
      await fs.rmSync("./Plugins/node_modules", { recursive: true });
    }
    if (fs.existsSync("./Plugins/package-lock.json")) {
      await fs.rmSync("./Plugins/package-lock.json", { recursive: true });
    }
    if (fs.existsSync("./Plugins/package.json")) {
      await fs.rmSync("./Plugins/package.json", { recursive: true });
    }
    if (fs.existsSync("./Plugins/.git")) {
      await fs.rmSync("./Plugins/.git", { recursive: true });
    }
    this.moveFilesFromPlugins();

    this.pushToGhPages();
  }
  async moveFilesFromPlugins() {
    const pluginFiles = await fs.readdir("./Plugins");
    for (const file of pluginFiles) {
      await fs.move(`./Plugins/${file}`, `./${file}`,  { overwrite: true });
    }
  }
  async cloneRepo(url, path, branch) {
    try {
      if (fs.existsSync(path)) {
        fs.rmdirSync(path, { recursive: true });
      }

      await this.git.clone(url, path, ["--branch", branch ? branch : "master"]);

      console.log("repository cloned successfully!");
    } catch (error) {
      console.error("Error cloning repository:", error.message);
      process.exit(0);
    }
  }
  async pushToGhPages() {
    try {
      await this.git.add("./*");
      await this.git.commit(" 👨‍💻CODE BY 🕊️★⃝AJAY O S©️🧚‍♂️");

      await this.git.push("origin", "gh-pages");

      console.log("Code pushed to gh-pages branch successfully.");
    } catch (error) {
      console.error("Error pushing to gh-pages branch:", error.message);
    }
  }
}

const cls = new RUN();
cls.Start();

