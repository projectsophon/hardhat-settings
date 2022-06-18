// We load the plugin here.
import type { HardhatUserConfig } from "hardhat/types";

import "../../../";

const config: HardhatUserConfig = {
  solidity: "0.8.10",
  settings: {
    HardhatOverrides: {
      path: "./config.json",
      decode: () => 1,
      lazy: false,
    },
  },
};

export default config;
