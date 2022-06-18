// We load the plugin here.
import type { HardhatUserConfig } from "hardhat/types";
import * as path from "path";

import "../../../";
import "./tasks/e2e";

declare module "hardhat/types" {
  interface HardhatSettings {
    person?: {
      firstName: string;
      lastName: string;
    };
  }
}

const config: HardhatUserConfig = {
  solidity: "0.8.10",
  settings: {
    person: {
      path: path.join(__dirname, "./config/person.json"),
    },
  },
};

export default config;
