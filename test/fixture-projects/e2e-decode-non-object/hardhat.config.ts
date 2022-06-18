// We load the plugin here.
import type { HardhatUserConfig } from "hardhat/types";

import "../../../";
import "./tasks/e2e";

declare module "hardhat/types" {
  interface HardhatSettings {
    foobar?: string;
  }
}

const config: HardhatUserConfig = {
  solidity: "0.8.10",
  settings: {
    foobar: {
      decode(input) {
        return input;
      },
    },
  },
};

export default config;
